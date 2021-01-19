const Game = require('./Game.js');
let game = null;

window.onload = newGame;

/**
 * Start new game
 * Read game parameters and start new game
 */
function newGame() {
    const colCount = +(document.getElementsByName('colcount')[0].value);
    const rowCount = +(document.getElementsByName('rowcount')[0].value);
    const bombCount = +(document.getElementsByName('bombcount')[0].value);
    const parentElement = document.getElementById('game-window');

    if (colCount < 10 && colCount > 30 && rowCount < 10 && rowCount > 30) {
        alert('Incorrect values. Rowcount and Colcount must be between 10 and 30');
        return;
    }

    if (bombCount < 10 && bombCount > 300 ) {
        alert('Incorrect values. Bombcount must be between 10 and 500');
        return;
    }

    if (bombCount > colCount * rowCount) {
        alert('Incorrect values. Bombcount must be less than Rowcount * Colcount');
        return;
    }

    game = new Game(parentElement, colCount, rowCount, bombCount);

    // resize window to show whole game field
    // magic constants are needed to consider size of textboxes
    window.resizeTo(game.fieldWidth + 35, game.fieldHeight + 140);
};
