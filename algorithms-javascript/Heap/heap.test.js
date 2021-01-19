const assert = require('assert');
const Heap = require('./heap');

describe('Heap', function() {
    describe('Base operations', function() {
        it('Add elements to heap', function() {
            const heap = new Heap();
            heap.push(5);
            heap.push(10);
            heap.push(8);
            heap.push(13);
            heap.push(2);

            assert.equal(heap.size(), 5);
        });

        it('Get correct minimum element', function() {
            const heap = new Heap();
            heap.push(23);
            heap.push(71);
            heap.push(13);
            heap.push(133);
            heap.push(19);
            heap.push(21);

            assert.equal(heap.peek(), 13);
        });

        it('Pop elements from heap', function() {
            const heap = new Heap();
            heap.push(13);
            heap.push(97);
            heap.push(21);
            heap.pop();
            assert.equal(heap.peek(), 21);
        });

        it('Get sorted array', function() {
            const heap = new Heap();
            heap.push(23);
            heap.push(71);
            heap.push(13);
            heap.push(133);
            heap.push(19);
            heap.push(21);

            const sortedArr = [];
            while (heap.size() > 0) {
                sortedArr.push(heap.pop());
            }

            assert.deepEqual(sortedArr, [13, 19, 21, 23, 71, 133]);
        });

        it('Build heap from array', function() {
            const heap = new Heap();
            heap.buildHeap([13, 97, 2, 81]);
            assert.equal(heap.peek(), 2);
        });
    });

    describe('Operations with custom comparable function', function() {
        it('Get max element', function() {
            const compFunc = function(a, b) {
                return b - a;
            };
            const heap = new Heap(compFunc);
            heap.push(5);
            heap.push(3);
            heap.push(13);
            heap.push(8);
            assert.equal(heap.peek(), 13);
        });

        it('Get max by object property', function() {
            const compFunc = function(a, b) {
                return b.age - a.age;
            };
            const heap = new Heap(compFunc);
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
            heap.push(obj1);
            heap.push(obj2);
            heap.push(obj3);

            assert.deepEqual(heap.peek(), obj3);
        });
    });

    describe('Heap sort', function() {
        it('Sort custom array', function() {
            const resultArray = [17, 33, 2, 8, 24, 10050, 8000, 71];
            Heap.sortArray(resultArray);
            assert.deepEqual(resultArray, [2, 8, 17, 24, 33, 71, 8000, 10050]);
        });

        it('Sort sorted array', function() {
            const originalArray = [2, 5, 13, 81, 93, 113];
            const resultArray = originalArray.slice();
            Heap.sortArray(resultArray);
            assert.deepEqual(resultArray, originalArray);
        });

        it('Sort array by descending', function() {
            const compFunc = function(a, b) {
                return b - a;
            };
            const resultArray = [5, 3, 13, 8];
            Heap.sortArray(resultArray, compFunc);
            assert.deepEqual(resultArray, [13, 8, 5, 3]);
        });

        it('Sort array of objects', function() {
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
            const resultArray = [obj1, obj2, obj3];
            Heap.sortArray(resultArray, compFunc);
            assert.deepEqual(resultArray, [obj2, obj1, obj3]);
        });
    });
});
