/**
 * Insert sort
 * Complexety O(n^2)
 * @param {Array} array
 * @param {Function} compFunc
 */
function insertSort(array, compFunc) {
    if (!compFunc) {
        compFunc = function(a, b) {
            return a - b;
        };
    }

    for (let i = 1; i < array.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (compFunc(array[j], array[j + 1]) > 0) {
                const temp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = temp;
            } else {
                break;
            }
        }
    }
}

module.exports = insertSort;
