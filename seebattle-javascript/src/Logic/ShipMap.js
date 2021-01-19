import Ship from './Ship.js';
import Constants from '../Common/Constants.js';
import Utility from '../Common/Utility.js';

/**
 * ShipMap class
 */
class ShipMap {
    /**
     * Create the empty ship map
     */
    constructor() {
        this._map = Utility.fillMultiArray(null, Constants.RowCount, Constants.ColCount);
        this._ships = [];
    }

    /**
     * Get value of cell
     * @param {Point} two arguments X, Y or object {X, Y}
     * @return {Ship}
     */
    get(...args) {
        if (args.length === 1) {
            if (args[0].hasOwnProperty('X') && args[0].hasOwnProperty('Y')) {
                return this._map[args[0].Y][args[0].X];
            } else {
                throw new Error('Mailformed object was passed in parameters');
            }
        } else if (arguments.length === 2) {
            return this._map[args[1]][args[0]];
        }

        throw new Error('Call with incorrect arguments');
    }

    /**
     * Check if cell (cellX, cellY) is empty
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    isCellEmpty(cellX, cellY) {
        return !this._map[cellY][cellX];
    }

    /**
     * Try to add ship to given cell
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    addShip(cellX, cellY) {
        if (this._map[cellY][cellX]) {
            return false;
        }

        const shipAround = this._getShipsToJoin(cellX, cellY);
        if (shipAround === null) {
            return false;
        } else if (shipAround instanceof Ship) {
            if (shipAround.addPoint(cellX, cellY)) {
                this._map[cellY][cellX] = shipAround;
                return true;
            }

            return false;
        } else if (shipAround === 0) {
            const ship = new Ship();
            if (ship.addPoint(cellX, cellY)) {
                this._map[cellY][cellX]= ship;
                this._ships.push(ship);
                return true;
            }

            return false;
        } else {
            throw new Error('Incorrect result of function Ship._getShipsToJoin');
        }
    }

    /**
     * Try to remove ship in given cell
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    removeShip(cellX, cellY) {
        const ship = this._map[cellY][cellX];
        if (ship.removePoint(cellX, cellY)) {
            this._map[cellY][cellX] = null;
            if (ship.Length === 0) {
                let shipIndex = this._ships.findIndex((item) => item.Id === ship.Id);
                if (~shipIndex) {
                    this._ships.splice(shipIndex, 1);
                }
            }
            return true;
        }

        return false;
    }

    /**
     * Get list of placed ships and count of them
     * @return {Array | integer}
     */
    getShipPlacingStats() {
        const shipCounter = Constants.getInitialCountOfShips();
        for (let i = 0; i < this._ships.length; i++) {
            const shipLength = this._ships[i].Length;
            shipCounter[shipLength]--;
        }

        return shipCounter;
    }

    /**
     * Get list of points of ship map that where ships are not located
     * @return {array | Point}
     */
    getListOfEmptyCells() {
        const cellArray = [];
        for (let Y = 0; Y < Constants.RowCount; Y++) {
            for (let X = 0; X < Constants.ColCount; X++) {
                if (this._map[Y][X] === null) {
                    cellArray.push({
                        X,
                        Y,
                    });
                }
            }
        }

        return cellArray;
    }

    /**
     * Check if it is possible to place ship with left-top point @(cellX, cellY) with length @shipLength and direction @direction
     * @param  {number} cellX
     * @param  {number} cellY
     * @param  {number} shipLength
     * @param  {Ship.DIRECTION} direction
     * @return {bool}
     */
    checkIfMayPlace(cellX, cellY, shipLength, direction) {
        let isPossibleToPlace = true;
        if (direction === Ship.DIRECTION.HORIZONTAL) {
            for (let i = 0; i < shipLength && isPossibleToPlace; i++) {
                isPossibleToPlace = cellX + i < Constants.ColCount && this._getShipsToJoin(cellX + i, cellY) === 0;
            }
        } else if (direction === Ship.DIRECTION.VERTICAL) {
            for (let i = 0; i < shipLength && isPossibleToPlace; i++) {
                isPossibleToPlace = cellY + i < Constants.RowCount && this._getShipsToJoin(cellX, cellY + i) === 0;
            }
        }

        return isPossibleToPlace;
    }

    /**
     * Try to place ship with left-top point @(cellX, cellY) with length @shipLength and direction @direction
     * @param  {number} cellX
     * @param  {number} cellY
     * @param  {number} shipLength
     * @param  {Ship.DIRECTION} direction
     * @return {bool}
     */
    addFullShip(cellX, cellY, shipLength, direction) {
        let isPossibleToPlace = true;
        const ship = new Ship();

        if (direction === Ship.DIRECTION.HORIZONTAL) {
            for (let i = 0; i < shipLength && isPossibleToPlace; i++) {
                isPossibleToPlace = cellX + i < Constants.ColCount && this._getShipsToJoin(cellX + i, cellY) === 0;
            }

            if (isPossibleToPlace) {
                for (let i = 0; i < shipLength; i++) {
                    ship.addPoint(cellX + i, cellY);
                    this._map[cellY][cellX + i] = ship;
                }
            }
        } else if (direction === Ship.DIRECTION.VERTICAL) {
            for (let i = 0; i < shipLength && isPossibleToPlace; i++) {
                isPossibleToPlace = cellY + i < Constants.RowCount && this._getShipsToJoin(cellX, cellY + i) === 0;
            }

            if (isPossibleToPlace) {
                for (let i = 0; i < shipLength; i++) {
                    ship.addPoint(cellX, cellY + i);
                    this._map[cellY + i][cellX] = ship;
                }
            }
        }

        if (isPossibleToPlace) {
            this._ships.push(ship);
            return true;
        }

        return false;
    }

    /**
     * Convert to base map (map contains only SHOT.EMPTY and SHOT.THISISSHIP)
     * @return {array | array | Constants.SHOT}
     */
    convertToBaseMap() {
        const baseMap = Utility.fillMultiArray(Constants.SHOT.EMPTY, Constants.RowCount, Constants.ColCount);
        for (let i = 0; i < Constants.RowCount; i++) {
            for (let j = 0; j < Constants.ColCount; j++) {
                if (this._map[i][j]) {
                    baseMap[i][j] = Constants.SHOT.THISISSHIP;
                }
            }
        }

        return baseMap;
    }

    /**
     * Get ship to which point (cellX, cellY) can be added
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {object | number | null}
     */
    _getShipsToJoin(cellX, cellY) {
        const shipArray = [];
        for (let Y = Math.max(cellY - 1, 0); Y <= cellY + 1 && Y < Constants.ColCount; Y++) {
            for (let X = Math.max(cellX - 1, 0); X <= cellX + 1 && X < Constants.RowCount; X++) {
                if (this._map[Y][X]) {
                    const dist = Math.abs(cellX - X) + Math.abs(cellY - Y);
                    if (dist > 1) {
                        return null;
                    }

                    if (dist === 0) {
                        continue;
                    }

                    shipArray.push(this._map[Y][X]);
                }
            }
        }

        if (shipArray.length > 1) {
            return null;
        }

        if (shipArray.length === 0) {
            return 0;
        }

        return shipArray[0];
    }
}

export default ShipMap;
