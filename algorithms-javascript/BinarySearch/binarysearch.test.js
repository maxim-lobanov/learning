const assert = require('assert');
const binarySearch = require('./binarysearch');

describe('Binary search', function() {
    describe('Set of cases where element exists in array', function() {
        it('Element exists in array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 5), 2);
        });

        it('Element exists in array 2', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 13), 4);
        });

        it('First element of array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 1), 0);
        });

        it('Last element of array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 81), 6);
        });
    });

    describe('Set of cases where element does not exist in array', function() {
        it('Element does not exist in array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 15), -1);
        });

        it('Element does not exist in array 2', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 39), -1);
        });

        it('Element is less than minimal element in array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], -13), -1);
        });

        it('Element is greater than maximal element in array', function() {
            assert.equal(binarySearch([1, 3, 5, 7, 13, 28, 81], 166), -1);
        });

        it('Empty array', function() {
            assert.equal(binarySearch([], 5), -1);
        });
    });
});
