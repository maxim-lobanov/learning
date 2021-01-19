require_relative '../../tokens/array_token'
require_relative '../../tokens/dictionary_token'
require_relative '../../tokens/string_token'
require 'test/unit'

class TestArrayToken < Test::Unit::TestCase
  def test_parse_array_of_strings
    input = [
      '- lisp',
      '- fortran',
      '- erlang'
    ]
    actual = ArrayToken.parse_token(input)
    assert_equal(3, actual.value.size)
    assert_instance_of StringToken, actual.value[0]
    assert_instance_of StringToken, actual.value[1]
    assert_instance_of StringToken, actual.value[2]
    assert_equal('lisp', actual.value[0].value)
    assert_equal('fortran', actual.value[1].value)
    assert_equal('erlang', actual.value[2].value)
  end

  def test_parse_array_of_integers
    input = [
      '- 123',
      '- 234',
      '- 345',
      '- 456'
    ]
    actual = ArrayToken.parse_token(input)
    assert_equal(4, actual.value.size)
    assert_instance_of NumberToken, actual.value[0]
    assert_instance_of NumberToken, actual.value[1]
    assert_instance_of NumberToken, actual.value[2]
    assert_instance_of NumberToken, actual.value[3]
    assert_equal(123, actual.value[0].value)
    assert_equal(234, actual.value[1].value)
    assert_equal(345, actual.value[2].value)
    assert_equal(456, actual.value[3].value)
  end

  def test_parse_array_of_booleans
    input = [
      '- true',
      '- false'
    ]
    actual = ArrayToken.parse_token(input)
    assert_equal(2, actual.value.size)
    assert_instance_of BooleanToken, actual.value[0]
    assert_instance_of BooleanToken, actual.value[1]
    assert_equal(true, actual.value[0].value)
    assert_equal(false, actual.value[1].value)
  end

  def test_parse_array_of_dicts
    input = [
      '- run: custom_string',
      '  age: 25',
      '  status: true',
      '- run: custom_string_2',
      '  age: 31',
      '  status: false'
    ]
    actual = ArrayToken.parse_token(input)
    assert_equal(2, actual.value.size)
    assert_instance_of(DictionaryToken, actual.value[0])
    assert_instance_of(DictionaryToken, actual.value[1])
    assert_instance_of(StringToken, actual.value[0].value['run'])
    assert_instance_of(NumberToken, actual.value[0].value['age'])
    assert_instance_of(BooleanToken, actual.value[0].value['status'])
    assert_equal('custom_string', actual.value[0].value['run'].value)
    assert_equal(25, actual.value[0].value['age'].value)
    assert_equal(true, actual.value[0].value['status'].value)
    assert_instance_of(StringToken, actual.value[1].value['run'])
    assert_instance_of(NumberToken, actual.value[1].value['age'])
    assert_instance_of(BooleanToken, actual.value[1].value['status'])
    assert_equal('custom_string_2', actual.value[1].value['run'].value)
    assert_equal(31, actual.value[1].value['age'].value)
    assert_equal(false, actual.value[1].value['status'].value)
  end
end
