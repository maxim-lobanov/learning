const assert = require('assert');
const BinaryTree = require('./binarytree');

describe('Binary tree', function() {
    it('Add elements to the tree', function() {
        const tree = new BinaryTree();
        tree.add(5);
        tree.add(7);
        tree.add(13);
        tree.add(9);
        assert.equal(tree.size(), 4);
    });

    it('Contains function', function() {
        const tree = new BinaryTree();
        tree.add(5);
        tree.add(3);
        tree.add(7);
        tree.add(4);
        assert.equal(tree.contains(4), true);
        assert.equal(tree.contains(8), false);
        assert.equal(tree.contains(3), true);
        assert.equal(tree.contains(1), false);
    });

    it('Remove elements', function() {
        const tree = new BinaryTree();
        tree.add(3);
        tree.add(7);
        tree.add(13);
        tree.add(10);
        tree.add(15);
        tree.add(5);
        tree.add(1);
        tree.add(2);
        assert.equal(tree.size(), 8);
        tree.remove(2);
        tree.remove(10);
        tree.remove(15);
        assert.equal(tree.size(), 5);
        assert.equal(tree.contains(2), false);
        assert.equal(tree.contains(10), false);
        assert.equal(tree.contains(15), false);
        assert.deepEqual(tree.show(), [1, 3, 5, 7, 13]);
    });

    it('Sort array', function() {
        const tree = new BinaryTree();
        tree.add(5);
        tree.add(2);
        tree.add(8);
        tree.add(7);
        tree.add(9);
        tree.add(4);
        assert.deepEqual(tree.show(), [2, 4, 5, 7, 8, 9]);
    });
});
