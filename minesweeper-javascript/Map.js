/**
 * Map of game
 * @param {number} colCount
 * @param {number} rowCount
 * @param {number} baseBombCount
 */
function Map(colCount, rowCount, baseBombCount) {
    let map = null;
    let mapBomb = null;
    let isDisabled = false;

    /**
     * Constants to reflect state of cell
     */
    const VIEW_STATUS = {
        NONE: 1,
        OPEN: 2,
        FLAG: 3,
    };

    /**
     * Check if cell (x, y) contains bomb
     * @param {number} x
     * @param {number} y
     * @return {bool}
     */
    this.isBomb = function(x, y) {
        return map[y][x].bomb;
    };

    /**
     * Check if user is already open cell (x, y)
     * @param {number} x
     * @param {number} y
     * @return {bool}
     */
    this.isOpen = function(x, y) {
        return map[y][x].view === VIEW_STATUS.OPEN;
    };

    /**
     * Check if user set flag in cell (x, y)
     * @param {number} x
     * @param {number} y
     * @return {bool}
     */
    this.isFlag = function(x, y) {
        return map[y][x].view === VIEW_STATUS.FLAG;
    };

    /**
     * Set flag to given cell (x, y)
     * @param {number} x
     * @param {number} y
     */
    this.setFlag = function(x, y) {
        map[y][x].view = VIEW_STATUS.FLAG;
    };

    /**
     * Unset flag in given cell (x, y)
     * @param {number} x
     * @param {number} y
     */
    this.unsetFlag = function(x, y) {
        map[y][x].view = VIEW_STATUS.NONE;
    };

    /**
     * Open given cell (x, y)
     * @param {number} x
     * @param {number} y
     */
    this.setOpen = function(x, y) {
        if (map[y][x].bomb) {
            isDisabled = true;
            alert('You lose!');
            return;
        }

        // open nearest empty cells too
        markNeighbors(x, y);

        if (isGameOver()) {
            isDisabled = true;
            alert('You win!');
            return;
        }
    };

    /**
     * Check if map is disabled
     * @return {bool}
     */
    this.isDisabled = function() {
        return isDisabled;
    };

    /**
     * Get count of bomb in square 3x3 around cell (x, y)
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    this.getCountOfBombsAround = function(x, y) {
        if (map[y][x].bomb) {
            throw new Error('Cell [' + x + ', ' + y + '] contains bomb');
        }

        return +mapBomb[y][x];
    };

    /**
     * Create new map, add bombs to it
     */
    function generateMap() {
        map = new Array(rowCount);
        mapBomb = new Array(rowCount);
        for (let i = 0; i < rowCount; i++) {
            map[i] = new Array(colCount);
            mapBomb[i] = new Array(colCount);
            for (let j = 0; j < colCount; j++) {
                map[i][j] = {
                    bomb: false,
                    view: VIEW_STATUS.NONE,
                };
                mapBomb[i][j] = 0;
            }
        }

        const cellList = getCellList();
        shuffleArray(cellList);

        if (cellList.length < baseBombCount) {
            throw new Error('Not enought cells to place bombs');
        }

        for (let i = 0; i < baseBombCount; i++) {
            const x = cellList[i].X;
            const y = cellList[i].Y;
            map[y][x].bomb = true;
        }

        calculateBombMap();
    }

    /**
     * Calculate a count of bombs around each cell
     */
    function calculateBombMap() {
        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                for (let cellY = Math.max(y - 1, 0); cellY < Math.min(y + 2, rowCount); cellY++) {
                    for (let cellX = Math.max(x - 1, 0); cellX < Math.min(x + 2, colCount); cellX++) {
                        if (cellX === x && cellY === y) {
                            continue;
                        }

                        if (map[cellY][cellX].bomb) {
                            mapBomb[y][x]++;
                        }
                    }
                }
            }
        }
    }

    /**
     * Check if player is already open all free cells
     * @return {bool}
     */
    function isGameOver() {
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (map[i][j].bomb === false && map[i][j].view !== VIEW_STATUS.OPEN) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Mark full area without bomb as open
     * @param {number} X
     * @param {number} Y
     */
    function markNeighbors(X, Y) {
        if (map[Y][X].bomb || map[Y][X].view === VIEW_STATUS.OPEN) {
            return;
        }

        map[Y][X].view = VIEW_STATUS.OPEN;

        if (mapBomb[Y][X] > 0) {
            return;
        }

        if (X > 0) {
            if (Y > 0) {
                markNeighbors(X - 1, Y - 1);
            }

            markNeighbors(X - 1, Y);

            if (Y + 1 < rowCount) {
                markNeighbors(X - 1, Y + 1);
            }
        }

        if (Y > 0) {
            markNeighbors(X, Y - 1);
        }

        if (Y + 1 < rowCount) {
            markNeighbors(X, Y + 1);
        }

        if (X + 1 < colCount) {
            if (Y > 0) {
                markNeighbors(X + 1, Y - 1);
            }

            markNeighbors(X + 1, Y);

            if (Y + 1 < rowCount) {
                markNeighbors(X + 1, Y + 1);
            }
        }
    }


    /**
     * Get a list of all cells on field
     * @return {Array}
     */
    function getCellList() {
        const result = [];

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                result.push({
                    X: j,
                    Y: i,
                });
            }
        }

        return result;
    };

    /**
     * Shuffle array
     * @param {Array} array
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    generateMap();
};


module.exports = Map;
