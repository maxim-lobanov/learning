/**
 * Utility class that constaints a banch of routins operations
 */
class Utility {
    /**
     * Mix elements in array to shuffle it
     * @param  {array | object} array
     */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Create two-dimensional array with @value
     * @param  {*} value
     * @param  {number} sizeN
     * @param  {number} sizeM
     * @return {array | object}
     */
    static fillMultiArray(value, sizeN, sizeM) {
        const resultArray = new Array(sizeN);
        for (let i = 0; i < sizeN; i++) {
            resultArray[i] = new Array(sizeM);
            for (let j = 0; j < sizeM; j++) {
                resultArray[i][j] = value;
            }
        }

        return resultArray;
    }
}

export default Utility;
