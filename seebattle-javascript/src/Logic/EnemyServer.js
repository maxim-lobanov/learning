import axios from 'axios';
import Constants from '../Common/Constants.js';

axios.defaults.timeout = Constants.HTTPTimeout;

/**
 * Enemy class
 * Implement logic of working with server for multiplayer
 */
class EnemyServer {
    /**
     * Send request to play,
     * @return {Promise}
     */
    searchEnemy() {
        return new Promise((resolve, reject) => {
            axios.get('/api/search')
                .then(() => {
                    axios.get('/api/search')
                        .then(() => {
                            resolve();
                        },
                        () => {
                            reject(new Error('Enemy was not found. Try later...'));
                        });
                },
                (error) => {
                    reject(new Error('Enemy was not found. Try later...'));
                });
        });
    }

    /**
     * Waiting for enemy player place all ships
     * @param {ShipMap} baseMap
     * @return {Promise}
     */
    waitForPrepare(baseMap) {
        return new Promise((resolve, reject) => {
            axios.post('/api/prepare', {
                map: baseMap,
            }).then(() => {
                axios.get('/api/prepare')
                    .then((response) => {
                        this.skipFirstTurn = response.data.position === -1;
                        resolve();
                    },
                    (error) => {
                        reject(new Error('Connection was lost'));
                    });
                },
                (error) => {
                    reject(new Error('Failed to send data to server'));
                });
        });
    }

    /**
     * Waiting while enemy makes shot
     * @return {Promise}
     */
    makeShot() {
        return new Promise((resolve, reject) => {
                axios.get('/api/shot')
                    .then((response) => {
                        resolve(response.data.point);
                    },
                    (error) => {
                        reject(new Error('Connection was lost'));
                    });
        });
    }

    /**
     * Process enemy answer about your shot
     * (Not required for multiplayer)
     */
    saveShot() {
        return;
    }

    /**
     * Make shot and waiting for answer from server about result of shot
     * @param  {number} cellX
     * @param  {number} cellY
     * @return {Promise}
     */
    getShot(cellX, cellY) {
        return new Promise((resolve, reject) => {
            axios.post('/api/shot', {
                point: {
                    X: cellX,
                    Y: cellY,
                },
            }).then((response) => {
                    resolve(response.data.shotResult);
                },
                (error) => {
                    reject(new Error('Connection was lost'));
                });
        });
    }
}

export default EnemyServer;
