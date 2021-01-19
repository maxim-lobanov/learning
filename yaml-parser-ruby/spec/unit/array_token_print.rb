require_relative '../../tokens/array_token'
require_relative '../../tokens/dictionary_token'
require_relative '../../tokens/string_token'
require 'test/unit'

class TestArrayToken < Test::Unit::TestCase
  def test_print_array_of_strings
    token = ArrayToken.new([
      StringToken.new('lisp'),
      StringToken.new('fortran'),
      StringToken.new('erlang')
    ])
    expected = [
      '- lisp',
      '- fortran',
      '- erlang'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_array_of_values
    token = ArrayToken.new([
      StringToken.new('lisp'),
      NumberToken.new(123),
      BooleanToken.new(true)
    ])
    expected = [
      '- lisp',
      '- 123',
      '- true'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_array_of_objects
    token = ArrayToken.new([
      DictionaryToken.new({
        'run' => StringToken.new('custom_string'),
        'age' => NumberToken.new(25),
        'status' => BooleanToken.new(true)
      }),
      DictionaryToken.new({
        'run' => StringToken.new('custom_string_2'),
        'age' => NumberToken.new(31),
        'status' => BooleanToken.new(false)
      })
    ])
    expected = [
      '- run: custom_string',
      '  age: 25',
      '  status: true',
      '- run: custom_string_2',
      '  age: 31',
      '  status: false'
    ]
    assert_equal(expected, token.print)
  end
end
