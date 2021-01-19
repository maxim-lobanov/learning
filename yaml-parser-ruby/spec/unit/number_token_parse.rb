require_relative '../../tokens/number_token'
require 'test/unit'

class TestNumberToken < Test::Unit::TestCase
  def test_parse_integer
    actual = NumberToken.parse_token(['123'])
    assert_instance_of NumberToken, actual
    assert_equal(123, actual.value)
  end

  def test_parse_negative_integer
    actual = NumberToken.parse_token(['-123'])
    assert_instance_of NumberToken, actual
    assert_equal(-123, actual.value)
  end

  def test_parse_float
    actual = NumberToken.parse_token(['25.2'])
    assert_instance_of NumberToken, actual
    assert_equal(25.2, actual.value)
  end

  def test_parse_invalid_number
    actual = NumberToken.parse_token(['hello'])
    assert_nil(actual)
  end

  def test_parse_invalid_multiline
    actual = NumberToken.parse_token(['123', '234'])
    assert_nil(actual)
  end
end
