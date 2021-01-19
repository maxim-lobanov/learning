/**
 * Binary heap
 * By default it is mininum Heap
 * function can be overrided using [compFunc]
 * @param {Function} compFunc
 */
function Heap(compFunc) {
    this._array = [];

    const minFunc = function(a, b) {
        return a - b;
    };
    this._compFunc = compFunc || minFunc;
}

/**
 * Add object to heap sort
 * Complexity O(log n)
 * @param {*} value
 */
Heap.prototype.push = function(value) {
    this._array.push(value);
    let currentItem = this._array.length - 1;
    let parent = Math.floor((currentItem - 1) / 2);

    while (currentItem > 0 && this._compFunc(this._array[parent], this._array[currentItem]) > 0) {
        const temp = this._array[currentItem];
        this._array[currentItem] = this._array[parent];
        this._array[parent] = temp;
        currentItem = parent;
        parent = Math.floor((currentItem - 1) / 2);
    }
};

/**
 * Get count of elements in the heap
 * @return {number}
 */
Heap.prototype.size = function() {
    return this._array.length;
};

/**
 * Get the first element in the heap
 * Complexity O(1)
 * @return {*}
 */
Heap.prototype.peek = function() {
    return this._array[0] || undefined;
};

/**
 * Get the first element in the heap and remove it
 * Complexity O(log n)
 * @return {*}
 */
Heap.prototype.pop = function() {
    const result = this._array[0] || undefined;
    if (this._array.length === 1) {
        this._array.pop();
        return result;
    }

    if (this._array.length > 1) {
        this._array[0] = this._array.pop();
        this.heapify(0);
    }

    return result;
};

/**
 * Restore ordering
 * @param {number} node
 */
Heap.prototype.heapify = function(node) {
    let leftChild;
    let rightChild;
    let largestChild;
    while (true) {
        leftChild = node * 2 + 1;
        rightChild = node * 2 + 2;
        largestChild = node;

        if (leftChild < this._array.length && this._compFunc(this._array[largestChild], this._array[leftChild]) > 0) {
            largestChild = leftChild;
        }

        if (rightChild < this._array.length && this._compFunc(this._array[largestChild], this._array[rightChild]) > 0) {
            largestChild = rightChild;
        }

        if (largestChild === node) {
            break;
        }

        const temp = this._array[node];
        this._array[node] = this._array[largestChild];
        this._array[largestChild] = temp;

        node = largestChild;
    }
};

/**
 * Create heap based on elements of array
 * Old content of heap is overrided
 * Complexety O(n)
 * @param {Array | *} array
 */
Heap.prototype.buildHeap = function(array) {
    this._array = array.slice();
    for (let i = Math.floor(this._array.length / 2); i >= 0; i--) {
        this.heapify(i);
    }
};

/**
 * Sort array of object using [compFunc]
 * Complexety O(n * log n)
 * @param {Array | *} array
 * @param {Function} compFunc
 */
Heap.sortArray = function(array, compFunc) {
    const heap = new Heap(compFunc);
    heap.buildHeap(array);
    for (let i = 0; i < array.length; i++) {
        array[i] = heap.pop();
    }
};

module.exports = Heap;
