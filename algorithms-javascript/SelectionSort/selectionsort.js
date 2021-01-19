/**
 * Selection sort
 * Complexety O(n^2)
 * @param {Array} array
 * @param {Function} compFunc
 */
function selectionSort(array, compFunc) {
    if (!compFunc) {
        compFunc = function(a, b) {
            return a - b;
        };
    }

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (compFunc(array[minIndex], array[j]) > 0) {
                minIndex = j;
            }
        }

        const temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;
    }
}

module.exports = selectionSort;
