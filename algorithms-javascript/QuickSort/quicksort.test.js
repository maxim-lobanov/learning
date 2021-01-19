const assert = require('assert');
const quickSort = require('./quicksort');

describe('QuickSort', function() {
    it('Sort array', function() {
        const resultArray = [2, 3, 7, 8, 1, 4, 97, 15];
        quickSort(resultArray);
        assert.deepEqual(resultArray, [1, 2, 3, 4, 7, 8, 15, 97]);
    });

    it('Sort array 2', function() {
        const resultArray = [37, 29, 21, 13, 8, 5, 4, 1];
        quickSort(resultArray);
        assert.deepEqual(resultArray, [1, 4, 5, 8, 13, 21, 29, 37]);
    });

    it('Sort sorted array', function() {
        const originalArray = [3, 5, 6, 7, 25, 81];
        const resultArray = originalArray.slice();
        quickSort(resultArray);
        assert.deepEqual(resultArray, originalArray);
    });

    it('Empty array', function() {
        const resultArray = [];
        quickSort(resultArray);
        assert.deepEqual(resultArray, []);
    });

    it('Sort by descending', function() {
        const compFunc = function(a, b) {
            return b - a;
        };
        const resultArray = [73, 13, 18, 44];
        quickSort(resultArray, compFunc);
        assert.deepEqual(resultArray, [73, 44, 18, 13]);
    });

    it('Sort objects', function() {
        const compFunc = function(a, b) {
            return a.age - b.age;
        };
        const obj1 = {
            name: 'vasya',
            age: 23,
        };
        const obj2 = {
            name: 'tanya',
            age: 21,
        };
        const obj3 = {
            name: 'ded mazay',
            age: 73,
        };
        const obj4 = {
            name: 'Bo Lund',
            age: 38,
        };
        const resultArray = [obj1, obj2, obj3, obj4];
        quickSort(resultArray, compFunc);
        assert.deepEqual(resultArray, [obj2, obj1, obj4, obj3]);
    });
});
