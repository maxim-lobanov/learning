require_relative '../../tokens/boolean_token'
require 'test/unit'

class TestBooleanToken < Test::Unit::TestCase
  def test_parse_true_value
    actual = BooleanToken.parse_token(['true'])
    assert_instance_of BooleanToken, actual
    assert_equal(true, actual.value)
  end

  def test_parse_false_value
    actual = BooleanToken.parse_token(['false'])
    assert_instance_of BooleanToken, actual
    assert_equal(false, actual.value)
  end

  def test_parse_invalid_value
    actual = BooleanToken.parse_token(['123'])
    assert_nil(actual)
  end

  def test_parse_invalid_multiline
    actual = NumberToken.parse_token(['true', 'false'])
    assert_nil(actual)
  end
end
