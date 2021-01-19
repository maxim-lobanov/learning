require_relative '../../tokens/boolean_token'
require 'test/unit'

class TestBooleanToken < Test::Unit::TestCase
  def test_print_true_value
    token = BooleanToken.new(true)
    expected = ['true']
    assert_equal(expected, token.print)
  end

  def test_print_false_value
    token = BooleanToken.new(false)
    expected = ['false']
    assert_equal(expected, token.print)
  end
end
