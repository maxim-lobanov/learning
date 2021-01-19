import Constants from '../Common/Constants.js';
import Utility from '../Common/Utility.js';

/**
 * ShotMap class
 */
class ShotMap {
    /**
     * Create the empty shot map
     */
    constructor() {
        this._shotMap = Utility.fillMultiArray(Constants.SHOT.NONE, Constants.RowCount, Constants.ColCount);
        this._shipsCounter = Constants.getInitialCountOfShips();
    }

    /**
     * Get value of cell
     * @param {Point} two arguments X, Y or object {X, Y}
     * @return {Constants.SHOT}
     */
    get(...args) {
        if (args.length === 1) {
            if (args[0].hasOwnProperty('X') && args[0].hasOwnProperty('Y')) {
                return this._shotMap[args[0].Y][args[0].X];
            }
        } else if (args.length === 2) {
            return this._shotMap[args[1]][args[0]];
        }

        throw new Error('Call with incorrect arguments');
    }

    /**
     * Set value of cell
     * @param {Point} two arguments X, Y or object {X, Y}
     * @param {Constants.SHOT} value
     */
    set(...args) {
        if (args.length === 2) {
            if (args[0].X && args[0].Y) {
                this._shotMap[args[0].Y][args[0].X] = args[1];
                return;
            }
        } else if (args.length === 3) {
            this._shotMap[args[1]][args[0]] = args[2];
            return;
        }

        throw new Error('Call with incorrect arguments');
    }

    /**
     * Find all points of the ship and mark all points as Constants.SHOT.FATAL
     * @param  {number} cellX
     * @param  {number} cellY
     */
    fillDestoyedShip(cellX, cellY) {
        let shipLength = 1;
        this._shotMap[cellY][cellX] = Constants.SHOT.FATAL;

        for (let X = cellX - 1; X >= 0; X--) {
            if (this._shotMap[cellY][X] !== Constants.SHOT.HURT) {
                break;
            }

            this._shotMap[cellY][X] = Constants.SHOT.FATAL;
            shipLength++;
        }

        for (let X = cellX + 1; X < Constants.ColCount; X++) {
            if (this._shotMap[cellY][X] !== Constants.SHOT.HURT) {
                break;
            }

            this._shotMap[cellY][X] = Constants.SHOT.FATAL;
            shipLength++;
        }

        for (let Y = cellY - 1; Y >= 0; Y--) {
            if (this._shotMap[Y][cellX] !== Constants.SHOT.HURT) {
                break;
            }

            this._shotMap[Y][cellX] = Constants.SHOT.FATAL;
            shipLength++;
        }

        for (let Y = cellY + 1; Y < Constants.RowCount; Y++) {
            if (this._shotMap[Y][cellX] !== Constants.SHOT.HURT) {
                break;
            }

            this._shotMap[Y][cellX] = Constants.SHOT.FATAL;
            shipLength++;
        }

        this._shipsCounter[shipLength]--;
    }

    /**
     * Check whether destroyed ships exist around the given cell
     * Check square 3x3 with center at point (cellX, cellY)
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    isDestroyedShipAround(cellX, cellY) {
        for (let Y = Math.max(cellY - 1, 0); Y <= cellY + 1 && Y < Constants.RowCount; Y++) {
            for (let X = Math.max(cellX - 1, 0); X <= cellX + 1 && X < Constants.ColCount; X++) {
                if (X !== cellX || Y !== cellY) {
                    if (this._shotMap[Y][X] === Constants.SHOT.FATAL) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Get list of live ships and count of them
     * @return {Array | integer}
     */
    getLiveShips() {
        return this._shipsCounter.slice();
    }
}

export default ShotMap;
