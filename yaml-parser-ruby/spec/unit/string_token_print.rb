require_relative '../../tokens/string_token'
require 'test/unit'

class TestStringToken < Test::Unit::TestCase
  def test_print_string
    token = StringToken.new('hello')
    expected = ['hello']
    assert_equal(expected, token.print)
  end

  def test_print_string_with_spaces
    token = StringToken.new('hello world')
    expected = ['hello world']
    assert_equal(expected, token.print)
  end

  def test_print_string_multiline
    token = StringToken.new("hello\nworld\nmore lines\nfinish")
    expected = [
      '>',
      'hello',
      'world',
      'more lines',
      'finish'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_empty_string
    token = StringToken.new('')
    expected = ['']
    assert_equal(expected, token.print)
  end
end
