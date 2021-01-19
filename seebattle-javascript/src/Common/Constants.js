/**
 * Utility class
 * Contains constants that are used by other classes
 */
class Constants {
    /**
     * Timeout for axios requests
     * 1 hour = 1000ms * 60s * 60m;
     */
    static HTTPTimeout = 1000 * 60 * 60;

    /**
     * Count of rows in field
     */
    static RowCount = 10;

    /**
     * Counts of columns in field
     */
    static ColCount = 10;

    /**
     * enum PLAYER
     */
    static PLAYER = {
        UNKNOWN: 0,
        ME: 1,
        ENEMY: 2,
    }

    /**
     * enum SHOT
     */
    static SHOT = {
        NONE: 0,
        EMPTY: 1,
        HURT: 2,
        FATAL: 3,
        GAME_FINISH: 4,
        THISISSHIP: 5,
    }

    /**
     * Max length of the ship
     */
    static MAX_SHIP_LENGTH = 4;

    /**
     * Get array that contains count of ship each length
     * index of array = length of ship
     * value = count of ships with such length
     * @return {array | number}
     */
    static getInitialCountOfShips() {
        let initialShips = [];
        initialShips[1] = 4;
        initialShips[2] = 3;
        initialShips[3] = 2;
        initialShips[4] = 1;

        return initialShips;
    }
}

module.exports = Constants;
