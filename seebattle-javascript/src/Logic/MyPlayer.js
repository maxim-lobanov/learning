import Player from './Player.js';
import Constants from '../Common/Constants.js';

/**
 * MyPlayer class
 */
class MyPlayer extends Player {
    /**
     * Add ship to cell if cell is empty
     * Else remove ship
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    makeShip(cellX, cellY) {
        if (this._shipMap.isCellEmpty(cellX, cellY)) {
            return this._shipMap.addShip(cellX, cellY);
        }

        return this._shipMap.removeShip(cellX, cellY);
    }

    /**
     * Check if it is possible to shot to cell
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {bool}
     */
    tryMakeShot(cellX, cellY) {
        // prevent shot to cell where player already shoot
        if (this._shotMap.get(cellX, cellY) === Constants.SHOT.NONE) {
            return true;
        }

        return false;
    }
}

export default MyPlayer;
