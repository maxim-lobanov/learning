import Player from './Player.js';
import Utility from '../Common/Utility.js';
import Constants from '../Common/Constants.js';

/**
 * Enemy class
 * Implement logic of bot AI
 */
class Enemy extends Player {
    /**
     * Send request to play
     * (Not required for AI bot)
     * @return {Promise}
     */
    searchEnemy() {
        return Promise.resolve();
    }

    /**
     * Waiting for enemy player place all ships
     * (Just force AI bot to place ships)
     * @return {Promise}
     */
    waitForPrepare() {
        return new Promise((resolve, reject) => {
            this._arrangeShipsOnMap();
            resolve();
        });
    }

    /**
     * Make shot and waiting for answer from enemy about result of shot
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {Promise}
     */
    getShot(cellX, cellY) {
        return new Promise((resolve, reject) => {
            const shotResult = super.getShot(cellX, cellY);
            resolve(shotResult);
        });
    }

    /**
     * Waiting while enemy makes shot
     * Force AI bot to choose cell to shot
     * @return {Promise}
     */
    makeShot() {
        return new Promise((resolve, reject) => {
            const point = this._choosePointToShot();
            resolve(point);
        });
    }

    /**
     * Choose cell where AI bot will shot
     * Terrible function :)
     * @return {Point}
     */
    _choosePointToShot() {
        const hurtShips = this._getHurtShips();
        let pointsToShot = [];

        if (hurtShips.length === 0) {
            // random shot
            pointsToShot = this._getFreePointsToShot();
        } else {
            // finish hurt ships
            Utility.shuffleArray(hurtShips);
            const basePoint = hurtShips[0];
            const isHorizontal = (basePoint.X > 0 && this._shotMap.get(basePoint.X - 1, basePoint.Y) === Constants.SHOT.HURT) || (basePoint.X + 1 < Constants.ColCount && this._shotMap.get(basePoint.X + 1, basePoint.Y) === Constants.SHOT.HURT);
            const isVertical = (basePoint.Y > 0 && this._shotMap.get(basePoint.X, basePoint.Y - 1) === Constants.SHOT.HURT) || (basePoint.Y + 1 < Constants.RowCount && this._shotMap.get(basePoint.X, basePoint.Y + 1) === Constants.SHOT.HURT);
            if (isHorizontal) {
                // if ship is located by horizontal
                for (let X = basePoint.X - 1; X >= 0; X--) {
                    if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.NONE) {
                        pointsToShot.push({
                            X,
                            Y: basePoint.Y,
                        });
                        break;
                    } else if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.EMPTY) {
                        break;
                    } else if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.HURT) {
                        continue;
                    }
                }

                for (let X = basePoint.X + 1; X < Constants.ColCount; X++) {
                    if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.NONE) {
                        pointsToShot.push({
                            X,
                            Y: basePoint.Y,
                        });
                        break;
                    } else if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.EMPTY) {
                        break;
                    } else if (this._shotMap.get(X, basePoint.Y) === Constants.SHOT.HURT) {
                        continue;
                    }
                }
            } else if (isVertical) {
                // if ship is located by vertical
                for (let Y = basePoint.Y - 1; Y >= 0; Y--) {
                    if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.NONE) {
                        pointsToShot.push({
                            X: basePoint.X,
                            Y,
                        });
                        break;
                    } else if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.EMPTY) {
                        break;
                    } else if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.HURT) {
                        continue;
                    }
                }

                for (let Y = basePoint.Y + 1; Y < Constants.RowCount; Y++) {
                    if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.NONE) {
                        pointsToShot.push({
                            X: basePoint.X,
                            Y,
                        });
                        break;
                    } else if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.EMPTY) {
                        break;
                    } else if (this._shotMap.get(basePoint.X, Y) === Constants.SHOT.HURT) {
                        continue;
                    }
                }
            } else {
                // if direction of ship is unknown
                if (basePoint.X + 1 < Constants.ColCount && this._shotMap.get(basePoint.X + 1, basePoint.Y) === Constants.SHOT.NONE) {
                    pointsToShot.push({
                        X: basePoint.X + 1,
                        Y: basePoint.Y,
                    });
                }

                if (basePoint.X - 1 >= 0 && this._shotMap.get(basePoint.X - 1, basePoint.Y) === Constants.SHOT.NONE) {
                    pointsToShot.push({
                        X: basePoint.X - 1,
                        Y: basePoint.Y,
                    });
                }

                if (basePoint.Y - 1 >= 0 && this._shotMap.get(basePoint.X, basePoint.Y - 1) === Constants.SHOT.NONE) {
                    pointsToShot.push({
                        X: basePoint.X,
                        Y: basePoint.Y - 1,
                    });
                }

                if (basePoint.Y + 1 < Constants.RowCount && this._shotMap.get(basePoint.X, basePoint.Y + 1) === Constants.SHOT.NONE) {
                    pointsToShot.push({
                        X: basePoint.X,
                        Y: basePoint.Y + 1,
                    });
                }
            }
        }

        // filter points where enemy ship can not be located
        pointsToShot = pointsToShot.filter((point) => !this._shotMap.isDestroyedShipAround(point.X, point.Y));
        if (pointsToShot.length === 0) {
            throw new Error('Something went wrong :)');
        }

        // choose random point from remain
        Utility.shuffleArray(pointsToShot);

        return pointsToShot[0];
    }

    /**
     * Get list of points where bot did not shot
     * @return {array | Point}
     */
    _getFreePointsToShot() {
        let result = [];
        for (let Y = 0; Y < Constants.RowCount; Y++) {
            for (let X = 0; X < Constants.ColCount; X++) {
                if (this._shotMap.get(X, Y) === Constants.SHOT.NONE) {
                    result.push({
                        X,
                        Y,
                    });
                }
            }
        }

        return result;
    }

    /**
     * Get points of ships that were hurt but were not destroyed
     * @return {array | Point}
     */
    _getHurtShips() {
        let result = [];
        for (let Y = 0; Y < Constants.RowCount; Y++) {
            for (let X = 0; X < Constants.ColCount; X++) {
                if (this._shotMap.get(X, Y) === Constants.SHOT.HURT) {
                    result.push({
                        X,
                        Y,
                    });
                }
            }
        }

        return result;
    }
}

export default Enemy;
