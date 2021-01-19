const Map = require('./Map.js');
const Constants = require('./Constants.js');

// set it to true to get more debug info during the game
const currentVerbosityLevel = Constants.VERBOSITY_LEVEL.NONE;

/**
 * Server class
 * Implement inner logic of server
 */
class Server {
    /**
     * Init server
     */
    constructor() {
        this.responses = {};
        this.enemies = {};
        this.gameContext = {};
        this.queue = [];
        this.playerState = {};
        this.playerTurn = {};
        this.delayedAnswer = {};
    }

    /**
     * Save response context to allow to send delayed response later
     * @param {string} guid
     * @param {Response} resContext
     * @param {Session} sessionContext
     */
    saveResponseContext(guid, resContext) {
        this.responses[guid] = resContext;
    }

    /**
     * Add new user to queue to wait game
     * @param {string} guid
     */
    addPlayerToQueue(guid) {
        this.queue.push(guid);
        this.playerState[guid] = Constants.STAGE.WAITING_SEARCH_PLAYER;
        this.logGameInfo('User [' + guid + '] started to search match', Constants.VERBOSITY_LEVEL.NORMAL);
    }

    /**
     * Save player information (map, status and etc)
     * @param {string} guid
     * @param {object} request
     */
    preparePlayer(guid, request) {
        if (this.playerState[guid] !== Constants.STAGE.PREPARE) {
            throw new Error('Game state of the player [' + guid + '] does not match request');
        }

        this.gameContext[guid] = new Map(request.map);
        this.playerState[guid] = Constants.STAGE.WAITING_PREPARE;
    }


    /**
     * Process requests of searching game
     * @param {*} guid
     * @return {bool}
     */
    searchGame(guid) {
        // if player is already on match - say him about it
        if (this.playerState[guid] === Constants.STAGE.PREPARE) {
            if (this.responses[guid]) {
                this.responses[guid].sendStatus(200);
                this.responses[guid] = null;
                return true;
            }

            return false;
        }

        if (this.playerState[guid] !== Constants.STAGE.WAITING_SEARCH_PLAYER) {
            throw new Error('Game state of the player [' + guid + '] does not match request');
        }

        // if more than two player wait for match - lets start it
        if (this.queue.length >= 2) {
            // pop myself
            const myIndex = this.queue.indexOf(guid);
            if (~myIndex) {
                this.queue.splice(myIndex, 1);
            } else {
                throw new Error('User has guid but he was not found in queue');
            }

            // pop enemy
            const enemyGuid = this.queue.shift();

            this.enemies[guid] = enemyGuid;
            this.enemies[enemyGuid] = guid;
            this.playerState[guid] = Constants.STAGE.PREPARE;
            this.playerState[enemyGuid] = Constants.STAGE.PREPARE;

            this.logGameInfo('Match found for users [' + guid + '] and [' + enemyGuid + ']', Constants.VERBOSITY_LEVEL.NORMAL);

            if (this.responses[guid] != null) {
                this.responses[guid].sendStatus(200);
                this.responses[guid] = null;
            }

            if (this.responses[enemyGuid] != null) {
                this.responses[enemyGuid].sendStatus(200);
                this.responses[enemyGuid] = null;
            }
            return true;
        }

        return false;
    }

    /**
     * Check if player and his enemy are ready to game
     * Start game if they are ready
     * @param {string} guid
     */
    processPrepare(guid) {
        const enemyGuid = this.enemies[guid];
        if (this.playerState[guid] !== Constants.STAGE.WAITING_PREPARE || (this.playerState[enemyGuid] !== Constants.STAGE.PREPARE && this.playerState[enemyGuid] !== Constants.STAGE.WAITING_PREPARE)) {
            throw new Error('Game state of the player [' + guid + '] does not match request');
        }


        if (this.playerState[enemyGuid] === Constants.STAGE.WAITING_PREPARE) {
            // Both players are ready
            if (!this.isPlayerAvailable(guid)) {
                throw new Error('Player [' + guid + '] context is not available');
            }
            if (!this.isEnemyInformationAvailable(guid)) {
                throw new Error('Player [' + enemyGuid + '] context is not available');
            }

            // start game
            this.playerState[guid] = Constants.STAGE.GAME;
            this.playerState[enemyGuid] = Constants.STAGE.GAME;
            this.playerTurn[guid] = 1;
            this.playerTurn[enemyGuid] = -1;
            this.responses[guid].json({
                position: this.playerTurn[guid],
            });
            this.responses[enemyGuid].json({
                position: this.playerTurn[enemyGuid],
            });
            this.responses[guid] = null;
            this.responses[enemyGuid] = null;
            this.logGameInfo('Start game between [' + guid + '] and [' + enemyGuid + ']', Constants.VERBOSITY_LEVEL.NORMAL);
            this.logGameMap(guid, enemyGuid, Constants.VERBOSITY_LEVEL.NORMAL);
        } else {
            // do nothing
        }
    }

    /**
     * Answer delayed response if it is possible
     * @param {string} guid
     */
    processShotAnswer(guid) {
        if (this.delayedAnswer[guid]) {
            if (this.responses[guid]) {
                this.responses[guid].json(this.delayedAnswer[guid]);
                this.responses[guid] = null;

                if (this.delayedAnswer[guid].shotResult === Constants.SHOT.GAME_FINISH) {
                    this.clearPlayer(guid, false);
                }

                this.delayedAnswer[guid] = null;
            }
        }
    }

    /**
     * Process shot
     * @param {string} guid
     * @param {object} request
     */
    processShotRequest(guid, request) {
        if (!this.isEnemyInformationAvailable(guid)) {
            throw new Error('Player [' + guid + '] context is not available');
        }

        const enemyGuid = this.enemies[guid];
        if (this.playerState[guid] !== Constants.STAGE.GAME) {
            throw new Error('Game state of the player [' + guid + '] does not match request');
        }
        if (this.playerState[enemyGuid] !== Constants.STAGE.GAME) {
            throw new Error('Game state of the player [' + enemyGuid + '] does not match request');
        }

        if (this.playerTurn[guid] === -1) {
          this.responses[guid].json({
            shotResult: -1,
          });
          this.responses[guid] = null;
          return;
        }

        this.playerTurn[guid] = -1;
        this.playerTurn[enemyGuid] = 1;

        if (request.point == null || !request.point.hasOwnProperty('X') || !request.point.hasOwnProperty('Y')) {
            throw new Error('Incorrect request: request does not contain point');
        }

        const shotPoint = request.point;

        if (shotPoint.X < 0 || shotPoint.X >= Constants.ColCount || shotPoint.Y < 0 || shotPoint.Y >= Constants.RowCount) {
            throw new Error('Incorrect request: request contains incorrect Point to shot');
        }

        const shotResult = this.gameContext[enemyGuid].makeShot(shotPoint.X, shotPoint.Y);
        this.logGameInfo('[' + guid + '] shot to (' + shotPoint.X + ' ' + shotPoint.Y + ') with result [' + shotResult + ']', Constants.VERBOSITY_LEVEL.DETAILED);
        this.logGameMap(guid, enemyGuid, Constants.VERBOSITY_LEVEL.DETAILED);

        this.responses[guid].json({
          shotResult,
        });
        this.responses[guid] = null;
        if (shotResult === Constants.SHOT.GAME_FINISH) {
          this.clearPlayer(guid, false);
        }

        this.delayedAnswer[enemyGuid] = {
          point: shotPoint,
          shotResult,
        };

        this.processShotAnswer(enemyGuid);
    }

    /**
     * Remove information about player by guid
     * @param {string} guid
     * @param {bool} clearEnemy
     * @param {bool} answerStab
     */
    clearPlayer(guid, clearEnemy = true, answerStab = false) {
        this.logGameInfo('Clear player [' + guid + ']', Constants.VERBOSITY_LEVEL.NORMAL);
        if (guid) {
            if (this.responses[guid]) {
                if (answerStab) {
                    this.responses[guid].sendStatus(204);
                } else {
                    this.responses[guid].sendStatus(500);
                }

                if (this.responses[guid].req.session) {
                    this.responses[guid].req.session.destroy();
                }
            }

            const enemyGuid = this.enemies[guid];
            delete this.enemies[guid];
            delete this.responses[guid];
            delete this.gameContext[guid];
            delete this.playerState[guid];
            delete this.playerTurn[guid];
            delete this.delayedAnswer[guid];

            const queueIndex = this.queue.indexOf(guid);
            if (~queueIndex) {
                this.queue.splice(queueIndex, 1);
            }

            if (clearEnemy && enemyGuid) {
                this.clearPlayer(enemyGuid, false, false);
            }
        }
    }

    /**
     * Check if player information is available
     * @param {string} guid
     * @return {bool}
     */
    isPlayerAvailable(guid) {
        if (this.playerState[guid]) {
            if (this.playerState[guid] === Constants.STAGE.WAITING_SEARCH_PLAYER) {
                const queueIndex = this.queue.indexOf(guid);
                return queueIndex > -1;
            } else if (this.playerState[guid] === Constants.STAGE.PREPARE) {
                return !!this.enemies[guid];
            } else if (this.playerState[guid] === Constants.STAGE.WAITING_PREPARE) {
                return !!this.enemies[guid] && !!this.gameContext[guid];
            } else if (this.playerState[guid] === Constants.STAGE.GAME) {
                return !!this.enemies[guid] && !!this.gameContext[guid] && !!this.playerTurn[guid];
            }

            return false;
        }

        return false;
    }

    /**
     * Check if enemy information is available
     * @param {string} guid
     * @return {bool}
     */
    isEnemyInformationAvailable(guid) {
        if (this.enemies[guid]) {
            return this.isPlayerAvailable(this.enemies[guid]);
        }

        return false;
    }

    /**
     * Log current state of play
     * @param {string} user1Guid
     * @param {string} user2Guid
     * @param {Constants.VERBOSITY_LEVEL} verbosityLevel
     */
    logGameMap(user1Guid, user2Guid, verbosityLevel) {
        if (currentVerbosityLevel >= verbosityLevel) {
            console.log('');
            console.log(user1Guid + ' <=> ' + user2Guid);
            for (let i = 0; i < Constants.RowCount; i++) {
                console.log(this.gameContext[user1Guid].getMapLine(i) + '    ' + this.gameContext[user2Guid].getMapLine(i));
            }
            console.log('');
        }
    }

    /**
     * Log current state of play
     * @param {string} logMessage
     * @param {Constants.VERBOSITY_LEVEL} verbosityLevel
     */
    logGameInfo(logMessage, verbosityLevel) {
        if (currentVerbosityLevel >= verbosityLevel) {
            console.log(logMessage);
        }
    }
}

module.exports = Server;
