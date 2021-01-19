/**
 * Binary tree
 * @param {Function} compFunc
 */
function BinaryTree(compFunc) {
    this.compFunc = compFunc;
    if (!this.compFunc) {
        this.compFunc = function(a, b) {
            return a - b;
        };
    }

    this.root = null;
    this.count = 0;
}

/**
 * Add value to tree
 * Complexety O(log n)
 * @param {*} value
 */
BinaryTree.prototype.add = function(value) {
    if (this.root === null) {
        this.root = new BinaryTreeNode(value);
    } else {
        this._addTo(this.root, value);
    }

    this.count++;
};

/**
 * Get a count of elements in tree
 * @return {number}
 */
BinaryTree.prototype.size = function() {
    return this.count;
};

/**
 * Check if tree constains node with value
 * Complexety O(log n)
 * @param {*} value
 * @return {bool}
 */
BinaryTree.prototype.contains = function(value) {
    return !!this._findElement(value);
};

/**
 * Remove element from tree
 * Complexety O(log n)
 * @param {*} value
 */
BinaryTree.prototype.remove = function(value) {
    let [current, parent] = this._findElementWithParent(value);

    if (current === null) {
        return;
    }

    this.count--;

    if (current.left && current.right) {
        const temp = current;
        parent = current;
        current = current.left;
        while (current.right) {
            parent = current;
            current = current.right;
        }
        temp.value = current.value;
    }

    const temp = (current.left) ? current.left : current.right;
    if (parent == null) {
        this.root = temp;
    } else if (this.compFunc(current.value, parent.value) > 0) {
        parent.right = temp;
    } else {
        parent.left = temp;
    }
};

/**
 * Get sorted elements of tree
 * Complexety O(n)
 * @return {Array}
 */
BinaryTree.prototype.show = function() {
    const result = [];
    this._show(this.root, result);
    return result;
};

BinaryTree.prototype._show = function(node, array) {
    if (node.left !== null) {
        this._show(node.left, array);
    }

    array.push(node.value);

    if (node.right !== null) {
        this._show(node.right, array);
    }
};

/**
 * Clear binary tree
 */
BinaryTree.prototype.clear = function() {
    this.root = null;
    this.count = 0;
};

/**
 * Utility func to find place for value and insert it
 * @param {BinaryTreeNode} node
 * @param {*} value
 */
BinaryTree.prototype._addTo = function(node, value) {
    if (this.compFunc(node.value, value) > 0) {
        if (node.left === null) {
            node.left = new BinaryTreeNode(value);
        } else {
            this._addTo(node.left, value);
        }
    } else {
        if (node.right === null) {
            node.right = new BinaryTreeNode(value);
        } else {
            this._addTo(node.right, value);
        }
    }
};

BinaryTree.prototype._findElement = function(value) {
    let current = this.root;
    while (current !== null) {
        const compResult = this.compFunc(current.value, value);
        if (compResult > 0) {
            current = current.left;
        } else if (compResult < 0) {
            current = current.right;
        } else {
            break;
        }
    }

    return current;
};

BinaryTree.prototype._findElementWithParent = function(value) {
    let current = this.root;
    let parent = null;
    while (current !== null) {
        const compResult = this.compFunc(current.value, value);
        if (compResult > 0) {
            parent = current;
            current = current.left;
        } else if (compResult < 0) {
            parent = current;
            current = current.right;
        } else {
            break;
        }
    }

    return [current, parent];
};

/**
 * Binary tree node
 * @param {*} value
 */
function BinaryTreeNode(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}

module.exports = BinaryTree;
