import Ship from './Ship.js';
import ShipMap from './ShipMap.js';
import ShotMap from './ShotMap.js';
import Constants from '../Common/Constants.js';
import Utility from '../Common/Utility.js';

/**
 * Player class
 * Implement logic for all players
 * MyPlayer and Enemy are inherited from it
 */
class Player {
    /**
     * Create a new player
     */
    constructor() {
        this._shipMap = new ShipMap();
        this._shotMap = new ShotMap();
        this._enemyShotMap = new ShotMap();
        this.skipFirstTurn = false;
    }

    /**
     * Get shipmap
     */
    get ShipMap() {
        return this._shipMap;
    }

    /**
     * Get shotmap
     */
    get ShotMap() {
        return this._shotMap;
    }

    /**
     * get enemyshotmap
     */
    get EnemyShotMap() {
        return this._enemyShotMap;
    }

    /**
     * Get shot from enemy
     * Check whether it hit to the ship
     * Mark and keep it in enemyShotMap
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {Constants.SHOT}
     */
    getShot(cellX, cellY) {
        if (this._shipMap.get(cellX, cellY)) {
            this._enemyShotMap.set(cellX, cellY, Constants.SHOT.HURT);
            const isShipDestroyed = this._isShipDestroyed(this._shipMap.get(cellX, cellY));

            if (isShipDestroyed) {
                this._enemyShotMap.fillDestoyedShip(cellX, cellY);
                if (this._isLose()) {
                    return Constants.SHOT.GAME_FINISH;
                }
            }
        } else {
            this._enemyShotMap.set(cellX, cellY, Constants.SHOT.EMPTY);
        }

        return this._enemyShotMap.get(cellX, cellY);
    }

    /**
     * Process enemy answer about your shot
     * Keep shot in shotMap
     * @param  {number} cellX
     * @param  {number} cellY
     * @param  {Constants.SHOT} shotResult
     */
    saveShot(cellX, cellY, shotResult) {
        if (shotResult === Constants.SHOT.EMPTY || shotResult === Constants.SHOT.HURT) {
            this._shotMap.set(cellX, cellY, shotResult);
        } else if (shotResult === Constants.SHOT.FATAL) {
            this._shotMap.fillDestoyedShip(cellX, cellY);
        }
    }

    /**
     * Arrange ships on field using a bit of randomness
     */
    _arrangeShipsOnMap() {
        this._shipMap = new ShipMap();

        const initialShips = Constants.getInitialCountOfShips();
        for (let shipLength = initialShips.length - 1; shipLength > 0; shipLength--) {
            let freeCells = this._shipMap.getListOfEmptyCells();
            let remainCount = initialShips[shipLength];
            Utility.shuffleArray(freeCells);
            for (let i = 0; i < freeCells.length && remainCount > 0; i++) {
                let directions = [Ship.DIRECTION.HORIZONTAL, Ship.DIRECTION.VERTICAL];
                Utility.shuffleArray(directions);
                for (let j = 0; j < directions.length; j++) {
                    if (this._shipMap.addFullShip(freeCells[i].X, freeCells[i].Y, shipLength, directions[j])) {
                        remainCount--;
                        break;
                    }
                }
            }

            if (remainCount > 0) {
                throw Error('Impossible to place ships on field');
            }
        }
    }

    /**
     * Check if player is lost (no one live ship exists)
     * @return {bool}
     */
    _isLose() {
        return this._shipMap._ships.every((ship) => {
            const point = ship.Points[0];
            return this._enemyShotMap.get(point) === Constants.SHOT.FATAL;
        });
    }

    /**
     * Check if ship is destroyed (all points of ship were hurt)
     * @param  {Ship} ship
     * @return {bool}
     */
    _isShipDestroyed(ship) {
        if (this._enemyShotMap.get(ship.Points[0]) === Constants.SHOT.FATAL) {
            return true;
        }

        return ship.Points.every((point) => {
            return this._enemyShotMap.get(point) === Constants.SHOT.HURT;
        });
    }
}

export default Player;
