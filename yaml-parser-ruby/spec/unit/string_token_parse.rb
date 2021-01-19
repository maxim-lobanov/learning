require_relative '../../tokens/string_token'
require 'test/unit'

class TestStringToken < Test::Unit::TestCase
  def test_parse_simple_string
    actual = StringToken.parse_token(['hello'])
    assert_instance_of StringToken, actual
    assert_equal('hello', actual.value)
  end

  def test_parse_single_quoted_string
    actual = StringToken.parse_token(["'hello'"])
    assert_instance_of StringToken, actual
    assert_equal('hello', actual.value)
  end

  def test_parse_double_quoted_string
    actual = StringToken.parse_token(['"hello"'])
    assert_instance_of StringToken, actual
    assert_equal('hello', actual.value)
  end

  def test_parse_simple_multiword
    actual = StringToken.parse_token(['hello world'])
    assert_instance_of StringToken, actual
    assert_equal('hello world', actual.value)
  end

  def test_parse_multiline_string1
    actual = StringToken.parse_token(['|', '  hello', '  world'])
    assert_instance_of StringToken, actual
    assert_equal("hello\nworld", actual.value)
  end

  def test_parse_multiline_string2
    actual = StringToken.parse_token(['>', '  hello', '  world'])
    assert_instance_of StringToken, actual
    assert_equal("hello\nworld", actual.value)
  end

  def test_parse_incorrect_multiline_string
    actual = StringToken.parse_token(['hello', 'world'])
    assert_nil(actual)
  end
end
