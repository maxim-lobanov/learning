import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import BattleField from './Views/BattleField.jsx';
import BattleLog from './Views/BattleLog.jsx';
import MyPlayer from './Logic/MyPlayer.js';
import Enemy from './Logic/Enemy.js';
import EnemyServer from './Logic/EnemyServer.js';
import Constants from './Common/Constants.js';
import GameResult from './Views/GameResult.jsx';
import WaitingForGame from './Views/WaitingForGame.jsx';

axios.defaults.timeout = Constants.HTTPTimeout;

/**
 * Game class
 * This class contains main logic of game
 */
class Game extends React.Component {
    /*
    *   @enum STAGE
    */
    static STAGE = {
        WAITING_SEARCH_PLAYER: 1,
        PREPARE: 2,
        WAITING_PREPARE: 3,
        GAME: 4,
        FINISH: 5,
    };

    /*
    *   @enum GAMEMODE
    */
    static GAMEMODE = {
        SINGLEPLAYER: 1,
        MULTIPLAYER: 2,
    };

    /**
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this._getTextGameType = this._getTextGameType.bind(this);
        this.prepareFieldClick = this.prepareFieldClick.bind(this);
        this.gameFieldClick = this.gameFieldClick.bind(this);
        this.startGame = this.startGame.bind(this);
        this.helpMeIamLazy = this.helpMeIamLazy.bind(this);
        this.returnToMenu = this.returnToMenu.bind(this);
        this.shotAssist = true;
        this.numWinner = Constants.PLAYER.UNKNOWN;

        const me = new MyPlayer();
        const enemy = (this.props.type === Game.GAMEMODE.SINGLEPLAYER) ? (
            new Enemy()
        ) : (this.props.type === Game.GAMEMODE.MULTIPLAYER) ? (
            new EnemyServer()
        ) : (
                    null
                );

        this.state = {
            me,
            enemy,
            stage: Game.STAGE.WAITING_SEARCH_PLAYER,
        };

        enemy.searchEnemy()
            .then(() => {
                this.setState({
                    stage: Game.STAGE.PREPARE,
                });
            },
            (error) => {
                this.props.onConnectionLost(error);
            });
    }

    /**
     * handler for click on field during PREPARE stage
     * @param {number} cellX
     * @param {number} cellY
     */
    prepareFieldClick(cellX, cellY) {
        if (cellX < 0 || cellX >= Constants.ColCount ||
            cellY < 0 || cellY >= Constants.RowCount) {
            return;
        }

        const me = this.state.me;
        if (me.makeShip(cellX, cellY)) {
            this.setState({
                me,
            });
        }
    }

    /**
     * handler for click on field during game
     * @param {number} cellX
     * @param {number} cellY
     */
    gameFieldClick(cellX, cellY) {
        if (cellX < 0 || cellX >= Constants.ColCount ||
            cellY < 0 || cellY >= Constants.RowCount) {
            return;
        }

        if (this.state.stage !== Game.STAGE.GAME) {
            return;
        }

        if (!this.state.isMyTurn) {
            // alert('It is move of your opponent now');
            return;
        }

        if (this.state.me.tryMakeShot(cellX, cellY)) {
            this.processMyTurn(cellX, cellY).then(() => {
                this.processEnemyTurn();
            });
        }
    }

    /**
     * process my turn
     * @param {number} cellX
     * @param {number} cellY
     * @return {Promise}
     */
    processMyTurn(cellX, cellY) {
        this.setState({
            isMyTurn: false,
        });

        const me = this.state.me;
        const enemy = this.state.enemy;

        return new Promise((resolve, reject) => {
            enemy.getShot(cellX, cellY).then((shotResult) => {
                if (shotResult === -1) {
                    alert('Please wait for your turn');
                } else if (shotResult === Constants.SHOT.GAME_FINISH) {
                    me.saveShot(cellX, cellY, Constants.SHOT.FATAL);
                    this.gameFinish(Constants.PLAYER.ME);
                    return;
                } else {
                    me.saveShot(cellX, cellY, shotResult);
                }

                this.setState({
                    me,
                    enemy,
                });

                resolve();
            },
                (error) => {
                    this.props.onConnectionLost(error);
                });
        });
    }

    /**
     * Process enemy turn
     */
    processEnemyTurn() {
        const me = this.state.me;
        const enemy = this.state.enemy;

        enemy.makeShot().then((pShot) => {
            if (!pShot) {
                return;
            }

            const enemyShotResult = me.getShot(pShot.X, pShot.Y);
            if (enemyShotResult === Constants.SHOT.GAME_FINISH) {
                me.saveShot(pShot.X, pShot.Y, Constants.SHOT.FATAL);
                this.gameFinish(Constants.PLAYER.ENEMY);
                return;
            } else {
                enemy.saveShot(pShot.X, pShot.Y, enemyShotResult);
            }
            this.setState({
                me,
                enemy,
                isMyTurn: true,
            });
        },
            (error) => {
                this.props.onConnectionLost(error);
            });
    }

    /**
     * Process game finish
     * Show FINISHGAME popup
     * @param {Game.PLAYER} numWinner
     */
    gameFinish(numWinner) {
        this.numWinner = numWinner;
        this.setState({
            stage: Game.STAGE.FINISH,
            isMyTurn: false,
        });
    }

    /**
     * Start game
     */
    startGame() {
        const me = this.state.me;
        const enemy = this.state.enemy;

        this.setState({
            me,
            enemy,
            isMyTurn: false,
            stage: Game.STAGE.WAITING_PREPARE,
        });


        enemy.waitForPrepare(me._shipMap.convertToBaseMap()).then(() => {
            this.setState({
                me,
                enemy,
                stage: Game.STAGE.GAME,
            });

            if (enemy.skipFirstTurn) {
                this.processEnemyTurn();
            } else {
                this.setState({
                    isMyTurn: true,
                });
            }
        },
            (error) => {
                this.props.onConnectionLost(error);
            });
    }

    /**
     * Call random ship placing for me
     * Function for lazy people
     */
    helpMeIamLazy() {
        const me = this.state.me;
        me._arrangeShipsOnMap();

        this.setState({
            me,
        });
    }

    /**
     * Get title of game type
     * @return {string}
     */
    _getTextGameType() {
        if (this.props.type === Game.GAMEMODE.SINGLEPLAYER) {
            return 'SINGLEPLAYER';
        } else if (this.props.type === Game.GAMEMODE.MULTIPLAYER) {
            return 'MULTIPLAYER';
        }

        return null;
    }

    /**
     * Return back to menu and finish active game
     */
    returnToMenu() {
        if (this.props.type === Game.GAMEMODE.MULTIPLAYER) {
            axios.get('/api/stop');
        }

        this.props.onGameFinish();
    }

    /**
     * Render
     * @return {JSX}
     */
    render() {
        const winnerArea = (this.state.stage === Game.STAGE.FINISH) ? (
            <GameResult
                winner={this.numWinner}
            />
        ) : null;

        const turnMessage = (this.state.stage === Game.STAGE.GAME) ? (
            (this.state.isMyTurn) ? 'Your turn' : 'Enemy turn'
        ) : null;

        const turnLabelColor = (this.state.isMyTurn) ? 'gameLabel button-green' : 'gameLabel button-orange';
        const turnLabelLayout = (this.state.stage === Game.STAGE.GAME) ? (
            <label className={turnLabelColor}> {turnMessage}</label>
        ) : null;

        const workSpace = (this.state.stage === Game.STAGE.PREPARE) ? (

            <div>
                <div className={'game-prepare'}>
                    <BattleField
                        shipMap={this.state.me.ShipMap}
                        shotMap={null}
                        onMapClick={this.prepareFieldClick}
                    />
                </div>
                <div>
                    <BattleLog
                        stage={Game.STAGE.PREPARE}
                        map={this.state.me.ShipMap}
                        onCompletePrepare={this.startGame}
                        onClickLazyButton={this.helpMeIamLazy}
                    />
                </div>
            </div>
        ) : (this.state.stage === Game.STAGE.GAME || this.state.stage === Game.STAGE.FINISH) ? (
            <div>
                {turnLabelLayout}
                <div>
                    <div className={'game-field'} align="right">
                        <div className={'inline-field'} >
                            <BattleField
                                shipMap={this.state.me.ShipMap}
                                shotMap={this.state.me.EnemyShotMap}
                                shotAssist={this.shotAssist}
                            />
                            <div align="left">
                                <BattleLog
                                    shotMap={this.state.me.EnemyShotMap}
                                    stage={Game.STAGE.GAME}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={'game-field'} align="left">
                        <div className={'inline-field'}>
                            <BattleField
                                shotMap={this.state.me.ShotMap}
                                onMapClick={this.gameFieldClick}
                                shotAssist={this.shotAssist}
                            />
                            <div align="right">
                                <BattleLog
                                    shotMap={this.state.me.ShotMap}
                                    stage={Game.STAGE.GAME}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (this.state.stage === Game.STAGE.WAITING_SEARCH_PLAYER || this.state.stage === Game.STAGE.WAITING_PREPARE) ? (
            <div>
                <WaitingForGame
                    type={this.state.stage}
                />
            </div>
        ) : null;

        const gameMode = this._getTextGameType();

        const finishPopupLayout = (this.state.stage === Game.STAGE.FINISH) ? (
            <div>
                <div className='popup-overlay'>
                </div>
                <div className={'popup-form'}>
                        <span className={'base-font information-message'} >{winnerArea}</span>
                        <div className={'br'}>
                            <button className={'gameLabel button-primary'} onClick={this.returnToMenu}>Menu</button>
                        </div>
                </div>
            </div>
        ) : null;

        return (
            <div>
                <div>
                    <label className={'gameLabel'}>{gameMode}</label>
                    <button className={'gameLabel right-floating button-primary'} onClick={this.returnToMenu}>Menu</button>
                </div>
                {workSpace}
                {finishPopupLayout}
            </div>
        );
    }
}

Game.propTypes = {
    type: PropTypes.number,
    onConnectionLost: PropTypes.func,
    onGameFinish: PropTypes.func,
};

export default Game;
