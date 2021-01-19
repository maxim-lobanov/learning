require_relative '../../tokens/token_helpers'
require 'test/unit'

class TokenHelpersParseLiteralToken < Test::Unit::TestCase
  def test_parse_boolean_value
    actual = parse_literal_token(['true'])
    assert_instance_of BooleanToken, actual
    assert_equal(true, actual.value)
  end

  def test_parse_integer_value
    actual = parse_literal_token(['1234'])
    assert_instance_of NumberToken, actual
    assert_equal(1234, actual.value)
  end

  def test_parse_float_value
    actual = parse_literal_token(['1234.5'])
    assert_instance_of NumberToken, actual
    assert_equal(1234.5, actual.value)
  end

  def test_parse_nil_value
    actual = parse_literal_token([''])
    assert_instance_of NilToken, actual
  end

  def test_parse_string_value
    actual = parse_literal_token(['hello world'])
    assert_instance_of StringToken, actual
    assert_equal('hello world', actual.value)
  end
end

class TokenHelpersFindFirstSymbolIndex < Test::Unit::TestCase
  def test_zero_indent
    actual = find_first_symbol_index('build')
    assert_equal(0, actual)
  end

  def test_zero_array
    actual = find_first_symbol_index('- build')
    assert_equal(0, actual)
  end

  def test_nested_indent
    actual = find_first_symbol_index('  build')
    assert_equal(2, actual)
  end

  def test_nested_array
    actual = find_first_symbol_index('  - build')
    assert_equal(2, actual)
  end

  def test_empty_line
    actual = find_first_symbol_index('    ')
    assert_equal(nil, actual)
  end

  def test_treat_tabs_as_spaces
    actual = find_first_symbol_index("\t\thello")
    assert_equal(2, actual)
  end
end
