/**
 * Find index of item in sorted array
 * Binary search runs in logarithmic time O(log n)
 * @param {Array | number} array
 * @param {number} item
 * @return {number}
 */
function binarySearch(array, item) {
    let left = 0;
    let right = array.length - 1;
    do {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] < item) {
            left = mid + 1;
        } else if (array[mid] > item) {
            right = mid - 1;
        } else {
            return mid;
        }
    } while (left <= right);

    return -1;
}

module.exports = binarySearch;
