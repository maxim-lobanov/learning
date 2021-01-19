require_relative '../../tokens/number_token'
require 'test/unit'

class TestNumberToken < Test::Unit::TestCase
  def test_print_integer
    token = NumberToken.new(123)
    expected = ['123']
    assert_equal(expected, token.print)
  end

  def test_print_negative_integer
    token = NumberToken.new(-123)
    expected = ['-123']
    assert_equal(expected, token.print)
  end

  def test_print_float
    token = NumberToken.new(25.2)
    expected = ['25.2']
    assert_equal(expected, token.print)
  end
end
