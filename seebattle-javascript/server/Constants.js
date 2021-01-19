/**
 * Utility class
 * Contains constants that are used by other classes
 */
class Constants {
    /**
     * Count of rows in field
     */
    static get RowCount() {
        return 10;
    }

    /**
     * Counts of columns in field
     */
    static get ColCount() {
        return 10;
    }

    /**
     * enum SHOT
     * @return {object}
     */
    static get SHOT() {
        return {
            NONE: 0,
            EMPTY: 1,
            HURT: 2,
            FATAL: 3,
            GAME_FINISH: 4,
            THISISSHIP: 5,
        };
    }

    /**
     * enum STAGE
     */
    static get STAGE() {
        return {
            WAITING_SEARCH_PLAYER: 1,
            PREPARE: 2,
            WAITING_PREPARE: 3,
            GAME: 4,
            FINISH: 5,
        };
      };

    /**
     * enum VERBOSITY_LEVEL
     */
    static get VERBOSITY_LEVEL() {
        return {
            NONE: 0,
            NORMAL: 1,
            DETAILED: 2,
        };
    };

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
