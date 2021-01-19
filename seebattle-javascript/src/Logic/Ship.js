import Constants from '../Common/Constants.js';

/**
 * Ship class
 */
class Ship {
    // static variable to set unique Id for each ship
    static _freeID = 1;

    /**
     *  @enum DIRECTION
     */
    static DIRECTION = {
        UNKNOWN: 0,
        HORIZONTAL: 1,
        VERTICAL: 2,
    };

    /*
    *   @enum DRAW_DIRECTION
    */
    static DRAW_DIRECTION = {
        SINGLE_SHIP: 0,
        HORIZONTAL_LEFT: 1,
        HORIZONTAL_RIGHT: 2,
        HORIZONTAL_MIDDLE: 3,
        VERTICAL_TOP: 4,
        VERTICAL_BOT: 5,
        VERTICAL_MIDDLE: 6,
    };

    /**
     * Create the empty ship
     */
    constructor() {
        this.Id = this._getFreeId();
        this._points = [];
    }

    /**
     * Get the lenght of ship
     */
    get Length() {
        return this._points.length;
    }

    /**
     * Get points of the ship
     */
    get Points() {
        return this._points;
    }

    /**
     * Add new point to the ship if it is possible
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    addPoint(cellX, cellY) {
        if (this._isMayAddPoint(cellX, cellY)) {
            this._points.push({
                X: cellX,
                Y: cellY,
            });

            return true;
        }

        return false;
    }

    /**
     * Remove point from the ship
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    removePoint(cellX, cellY) {
        if (this._isMayRemovePoint(cellX, cellY)) {
            const pointIndex = this._points.findIndex((point) => point.X === cellX && point.Y === cellY);
            if (~pointIndex) {
                this._points.splice(pointIndex, 1);
                return true;
            } else {
                throw Error('Impossible to remove point. Ship does not contain it');
            }
        }

        return false;
    }

    /**
     * Get the direction of ship for drawing
     * @param {number} cellX
     * @param {number} cellY
     * @return {Ship.DRAW_DIRECTION}
     */
    getDirectionStatusForDrawing(cellX, cellY) {
        const direction = this._getDirection();
        if (direction === Ship.DIRECTION.UNKNOWN) {
            return Ship.DRAW_DIRECTION.SINGLE_SHIP;
        }

        if (direction === Ship.DIRECTION.HORIZONTAL) {
            const [minX, maxX] = this._getMinMaxFromArray(this._points.map((point) => point.X));
            if (cellX === minX) {
                return Ship.DRAW_DIRECTION.HORIZONTAL_LEFT;
            }

            if (cellX === maxX) {
                return Ship.DRAW_DIRECTION.HORIZONTAL_RIGHT;
            }

            return Ship.DRAW_DIRECTION.HORIZONTAL_MIDDLE;
        }

        if (direction === Ship.DIRECTION.VERTICAL) {
            const [minY, maxY] = this._getMinMaxFromArray(this._points.map((point) => point.Y));
            if (cellY === minY) {
                return Ship.DRAW_DIRECTION.VERTICAL_TOP;
            }

            if (cellY === maxY) {
                return Ship.DRAW_DIRECTION.VERTICAL_BOT;
            }

            return Ship.DRAW_DIRECTION.VERTICAL_MIDDLE;
        }
    }

    /**
     * Check if point can be added to the ship
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    _isMayAddPoint(cellX, cellY) {
        if (this._points.length >= Constants.MAX_SHIP_LENGTH) {
            return false;
        }

        if (this._points.findIndex((point) => point.X === cellX && point.Y === cellY) > -1) {
            return false;
        }

        const direction = this._getDirection();
        if (direction === Ship.DIRECTION.UNKNOWN) {
            return true;
        }

        if (direction === Ship.DIRECTION.HORIZONTAL) {
            return this._points[0].Y === cellY;
        }

        if (direction === Ship.DIRECTION.VERTICAL) {
            return this._points[0].X === cellX;
        }

        return false;
    }

    /**
     * Get minimum value and maximum value from array
     * @param  {array | integer} array
     * @return {array | integer} [minValue, maxValue]
     */
    _getMinMaxFromArray(array) {
        return array.reduce(
            (accumulator, currentValue) => {
                return [
                    Math.min(currentValue, accumulator[0]),
                    Math.max(currentValue, accumulator[1]),
                ];
            }, [Number.MAX_VALUE, Number.MIN_VALUE]
        );
    }

    /**
     * Check if point can be removed from the Ship
     * (only border points can be removed)
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    _isMayRemovePoint(cellX, cellY) {
        // point can be removed only if it is border point
        const direction = this._getDirection();
        if (direction === Ship.DIRECTION.UNKNOWN) {
            return true;
        }

        if (direction === Ship.DIRECTION.HORIZONTAL) {
            const [minX, maxX] = this._getMinMaxFromArray(this._points.map((point) => point.X));
            return cellX === minX || cellX === maxX;
        }

        if (direction === Ship.DIRECTION.VERTICAL) {
            const [minY, maxY] = this._getMinMaxFromArray(this._points.map((point) => point.Y));
            return cellY === minY || cellY === maxY;
        }

        return false;
    }

    /**
     * Get the next free id to mark new ship
     * @return {number}
     */
    _getFreeId() {
        return Ship._freeID++;
    }

    /**
     * Get the direction of ship
     * @return {Ship.DIRECTION}
     */
    _getDirection() {
        if (this._points.length < 2) {
            return Ship.DIRECTION.UNKNOWN;
        }

        // Identify the direction by any two points
        const point1 = this._points[0];
        const point2 = this._points[1];

        if (point1.X === point2.X) {
            return Ship.DIRECTION.VERTICAL;
        }

        if (point1.Y === point2.Y) {
            return Ship.DIRECTION.HORIZONTAL;
        }

        throw new Error('Impossible to identify the ship direction');
    }
}

export default Ship;
