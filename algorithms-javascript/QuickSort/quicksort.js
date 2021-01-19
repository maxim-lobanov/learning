/**
 * QuickSort
 * On average quicksort takes O(n * log n)
 * @param {Array} array
 * @param {Function} compFunc
 * @param {number} left
 * @param {number} right
 */
const quickSort = function quicksort(array, compFunc, left = 0, right = array.length - 1) {
    if (!compFunc) {
        compFunc = function(a, b) {
            return a - b;
        };
    }

    let i = left;
    let j = right;
    const pivot = Math.floor((left + right) / 2);
    while (i <= j) {
        while (compFunc(array[i], array[pivot]) < 0) {
            i++;
        }
        while (compFunc(array[j], array[pivot]) > 0) {
            j--;
        }
        if (i <= j) {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            i++;
            j--;
        }
    }

    if (left < j) {
        quicksort(array, compFunc, left, j);
    }

    if (i < right) {
        quicksort(array, compFunc, i, right);
    }
};

module.exports = quickSort;
