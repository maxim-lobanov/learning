const assert = require('assert');
const isPalindrome = require('./palindrome');

describe('Palindrome', function() {
    it('String with palindrome', function() {
        assert.equal(isPalindrome('abba'), true);
        assert.equal(isPalindrome('ayadaradaya'), true);
    });

    it('String without palindrome', function() {
        assert.equal(isPalindrome('agv'), false);
        assert.equal(isPalindrome('hello'), false);
    });

    it('Empty string', function() {
        assert.equal(isPalindrome(''), false);
    });
});
