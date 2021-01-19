const Constants = require('./Constants.js');

/**
 * Map
 */
class Map {
    /**
     * @param {*} baseMap
     */
    constructor(baseMap) {
        if (!this._checkBaseMap(baseMap)) {
            throw new Error('Incorrect map format');
        }

        this._map = baseMap;
    }

    /**
     * Process shot and return result of shot
     * @param {*} cellX
     * @param {*} cellY
     * @return {Constants.SHOT}
     */
    makeShot(cellX, cellY) {
        if (this._map[cellY][cellX] === Constants.SHOT.THISISSHIP) {
            this._map[cellY][cellX] = Constants.SHOT.HURT;
            if (this._isDestroyedShip(cellX, cellY)) {
                this._markAsDestroyed(cellX, cellY);
                if (this._isLose()) {
                    return Constants.SHOT.GAME_FINISH;
                }

                return Constants.SHOT.FATAL;
            }

            return Constants.SHOT.HURT;
        }

        return Constants.SHOT.EMPTY;
    }

    /**
     * Get all points that are related to the ship in given point
     * @param {number} cellX
     * @param {number} cellY
     * @return {array | number}
     */
    _getShipPoints(cellX, cellY) {
        const result = [];

        if (this._map[cellY][cellX] === Constants.SHOT.EMPTY) {
            return result;
        }

        result.push({
            X: cellX,
            Y: cellY,
        });

        for (let X = cellX; X >= 0; X--) {
            if (this._map[cellY][X] === Constants.SHOT.EMPTY) {
                break;
            } else if (this._map[cellY][X] === Constants.SHOT.THISISSHIP || this._map[cellY][X] === Constants.SHOT.HURT || this._map[cellY][X] === Constants.SHOT.FATAL) {
                result.push({
                    X,
                    Y: cellY,
                });
            }
        }

        for (let X = cellX; X < Constants.ColCount; X++) {
            if (this._map[cellY][X] === Constants.SHOT.EMPTY) {
                break;
            } else if (this._map[cellY][X] === Constants.SHOT.THISISSHIP || this._map[cellY][X] === Constants.SHOT.HURT || this._map[cellY][X] === Constants.SHOT.FATAL) {
                result.push({
                    X,
                    Y: cellY,
                });
            }
        }

        for (let Y = cellY; Y >= 0; Y--) {
            if (this._map[Y][cellX] === Constants.SHOT.EMPTY) {
                break;
            } else if (this._map[Y][cellX] === Constants.SHOT.THISISSHIP || this._map[Y][cellX] === Constants.SHOT.HURT || this._map[Y][cellX] === Constants.SHOT.FATAL) {
                result.push({
                    X: cellX,
                    Y,
                });
            }
        }

        for (let Y = cellY; Y < Constants.RowCount; Y++) {
            if (this._map[Y][cellX] === Constants.SHOT.EMPTY) {
                break;
            } else if (this._map[Y][cellX] === Constants.SHOT.THISISSHIP || this._map[Y][cellX] === Constants.SHOT.HURT || this._map[Y][cellX] === Constants.SHOT.FATAL) {
                result.push({
                    X: cellX,
                    Y,
                });
            }
        }

        return result;
    }

    /**
     * Check if the ship in given point is destroyed
     * @param {number} cellX
     * @param {number} cellY
     * @return {bool}
     */
    _isDestroyedShip(cellX, cellY) {
        const cells = this._getShipPoints(cellX, cellY);
        for (let i = 0; i < cells.length; i++) {
            if (this._map[cells[i].Y][cells[i].X] !== Constants.SHOT.HURT) {
                return false;
            }
        }

        return true;
    }

    /**
     * Mark all points that are related to ship in given point as destroyed
     * @param {number} cellX
     * @param {number} cellY
     */
    _markAsDestroyed(cellX, cellY) {
        const cells = this._getShipPoints(cellX, cellY);
        for (let i = 0; i < cells.length; i++) {
            this._map[cells[i].Y][cells[i].X] = Constants.SHOT.FATAL;
        }
    }

    /**
     * Check if all ships are destroyed
     * @return {bool}
     */
    _isLose() {
        for (let i = 0; i < Constants.RowCount; i++) {
            for (let j = 0; j < Constants.ColCount; j++) {
                if (this._map[i][j] !== Constants.SHOT.EMPTY) {
                    if (this._map[i][j] !== Constants.SHOT.FATAL) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Print line of ship map
     * Using for debug
     * @param {number} line
     * @return {string}
     */
    getMapLine(line) {
        return this._map[line].map((item) => {
          if (item === Constants.SHOT.THISISSHIP) {
              return 'S';
          } else if (item === Constants.SHOT.HURT) {
              return 'H';
          } else if (item === Constants.SHOT.FATAL) {
              return 'D';
          }
          return 'O';
        }).join(' ');
    }

    /**
     * Check if baseMap is correct
     * @param {object} baseMap
     * @return {bool}
     */
    _checkBaseMap(baseMap) {
        if (!Array.isArray(baseMap)) {
            return false;
        }

        if (baseMap.length != Constants.RowCount) {
            return false;
        }

        for (let i = 0; i < baseMap.length; i++) {
            if (!Array.isArray(baseMap[i])) {
                return false;
            }

            if (baseMap[i].length != Constants.ColCount) {
                return false;
            }

            for (let j = 0; j < baseMap[i].length; j++) {
                if (baseMap[i][j] !== Constants.SHOT.THISISSHIP && baseMap[i][j] !== Constants.SHOT.EMPTY) {
                    return false;
                }
            }
        }

        return true;
    }
}

module.exports = Map;
