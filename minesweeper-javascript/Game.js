const Map = require('./Map.js');

const hintBombs = false;

/**
 * MineSweeper main class
 * Create a game field into element @parentElement
 * With given size @colCount and @rowCount and given count of bomb @baseBombCount
 * @param {Element} parentElement
 * @param {number} colCount
 * @param {number} rowCount
 * @param {number} baseBombCount
 */
function Game(parentElement, colCount, rowCount, baseBombCount) {
    const self = this;

    // bunch of constants
    const cellSize = 50;
    const fieldIndent = 3;
    const cornerRadius = 4;
    const numberColors = [
        'black', // 0
        '#070799', // 1
        '#006600', // 2
        '#555500', // 3
        '#880088', // 4
        '#990000', // 5
        '#555555', // 6
        '#557a7a', // 7
        '#000000', // 8
    ];

    this.fieldWidth = fieldIndent * 2 + cellSize * colCount;
    this.fieldHeight = fieldIndent * 2 + cellSize * rowCount;

    const map = new Map(colCount, rowCount, baseBombCount);

    // create canvas element
    const $canvas = document.createElement('canvas');
    $canvas.width = this.fieldWidth;
    $canvas.height = this.fieldHeight;
    $canvas.addEventListener('mousedown', function(event) {
        const [X, Y] = convertCoordinatesToCell(event);
        if (X < 0 || X >= colCount || Y < 0 || Y >= rowCount) {
            // click outside game field
            return;
        }

        cellClick(X, Y, event.button);
    });

    // clear parent element and add canvas
    parentElement.innerHTML = '';
    parentElement.appendChild($canvas);

    // load images
    let images = {};
    Promise.all([
        loadImage('images/bomb.png'),
        loadImage('images/flag.png'),
    ]).then((values) => {
        [images.bomb, images.flag] = values;
        // force game redraw when images are loaded
        this.draw();
    });

    /**
     * Draw game field on canvas
     */
    this.draw = function() {
        const ctx = $canvas.getContext('2d');

        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);

        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                const cellX = fieldIndent + x * cellSize;
                const cellY = fieldIndent + y * cellSize;

                ctx.fillStyle = '#999999';
                drawRoundedRect(ctx, cellX, cellY, cellSize, cornerRadius);

                if (map.isOpen(x, y)) {
                    if (map.isBomb(x, y)) {
                        throw new Error('Something went wrong. You must already lose');
                    } else {
                        drawEmptyCell(ctx, cellX, cellY);
                        const bombCountAround = map.getCountOfBombsAround(x, y);
                        if (bombCountAround > 0) {
                            drawCountOfBombs(ctx, cellX, cellY, bombCountAround);
                        }
                    }
                } else if (map.isFlag(x, y)) {
                    if (map.isBomb(x, y)) {
                        if (hintBombs || map.isDisabled()) {
                            drawBomb(ctx, cellX, cellY);
                        }
                    }

                    drawFlag(ctx, cellX, cellY);
                } else {
                    if (map.isBomb(x, y)) {
                        if (hintBombs || map.isDisabled()) {
                            drawBomb(ctx, cellX, cellY);
                        }
                    }
                }
            }
        }
    };

    /**
     * Draw image with bomb
     * @param {Canvas} ctx
     * @param {number} cellX
     * @param {number} cellY
     */
    function drawBomb(ctx, cellX, cellY) {
        const imageIndent = 7;
        ctx.drawImage(images.bomb, cellX + imageIndent, cellY + imageIndent, cellSize - 2 * imageIndent, cellSize - 2 * imageIndent);
    }

    /**
     * Draw image with flag
     * @param {Canvas} ctx
     * @param {number} cellX
     * @param {number} cellY
     */
    function drawFlag(ctx, cellX, cellY) {
        const imageIndent = 7;
        ctx.drawImage(images.flag, cellX + imageIndent, cellY + imageIndent, cellSize - 2 * imageIndent, cellSize - 2 * imageIndent);
    }

    /**
     * Draw empty cell
     * @param {Canvas} ctx
     * @param {number} cellX
     * @param {number} cellY
     */
    function drawEmptyCell(ctx, cellX, cellY) {
        ctx.fillStyle = '#bfbfbf';
        drawRoundedRect(ctx, cellX, cellY, cellSize, cornerRadius);
    }

    /**
     * Draw a rounded rectangle
     * @param {Canvas} ctx
     * @param {number} rectX
     * @param {number} rectY
     * @param {number} rectSize
     * @param {number} cornerRadius
     */
    function drawRoundedRect(ctx, rectX, rectY, rectSize, cornerRadius) {
        ctx.beginPath();
        ctx.moveTo(rectX + cornerRadius, rectY);
        ctx.lineTo(rectX + rectSize - cornerRadius, rectY);
        ctx.quadraticCurveTo(rectX + rectSize, rectY, rectX + rectSize, rectY + cornerRadius);
        ctx.lineTo(rectX + rectSize, rectY + rectSize - cornerRadius);
        ctx.quadraticCurveTo(rectX + rectSize, rectY + rectSize, rectX + rectSize - cornerRadius, rectY + rectSize);
        ctx.lineTo(rectX + cornerRadius, rectY + rectSize);
        ctx.quadraticCurveTo(rectX, rectY + rectSize, rectX, rectY + rectSize - cornerRadius);
        ctx.lineTo(rectX, rectY + cornerRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draw text with count of bomb
     * Set color based on number
     * @param {Canvas} ctx
     * @param {number} cellX
     * @param {number} cellY
     * @param {number} countValue
     */
    function drawCountOfBombs(ctx, cellX, cellY, countValue) {
        ctx.font = '30px Comic Sans MS';
        ctx.fillStyle = numberColors[countValue];
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(countValue, cellX + cellSize / 2, cellY + cellSize / 2);
    }

    /**
     * Load image on given url
     * @param {string} url
     * @return {Promise}
     */
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.onload = function() {
                resolve(image);
            };
        });
    }

    /**
     * Process click on cell of field
     * @param {number} X
     * @param {number} Y
     * @param {number} button
     */
    function cellClick(X, Y, button) {
        // constants to reflect mouse buttons
        const BUTTON = {
            LEFT: 0,
            RIGHT: 2,
        };

        if (map.isDisabled()) {
            return;
        }

        if (map.isOpen(X, Y)) {
            // prevent click to opened cells
            return;
        }

        if (button === BUTTON.LEFT) {
            if (map.isFlag(X, Y)) {
                // prevent click to cell with flag
                return;
            }

            map.setOpen(X, Y);
            self.draw();
        } else if (button === BUTTON.RIGHT) {
            if (map.isFlag(X, Y)) {
                map.unsetFlag(X, Y);
            } else {
                if (!map.isOpen(X, Y)) {
                    map.setFlag(X, Y);
                }
            }
        }

        self.draw();
    };

    /**
     * Utility function to help convert click coordinates to cell on field
     * @param {event} event
     * @return {Point}
     */
    function convertCoordinatesToCell(event) {
        const clickX = event.pageX - $canvas.offsetLeft;
        const clickY = event.pageY - $canvas.offsetTop;
        return [
            Math.floor((clickX - fieldIndent) / cellSize),
            Math.floor((clickY - fieldIndent) / cellSize),
        ];
    };
};

module.exports = Game;
