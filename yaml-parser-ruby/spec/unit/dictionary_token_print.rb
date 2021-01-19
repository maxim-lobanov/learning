require_relative '../../tokens/dictionary_token'
require 'test/unit'

class TestDictionaryToken < Test::Unit::TestCase
  def test_print_dict_simple
    token = DictionaryToken.new({
      'run' => StringToken.new('custom_string'),
      'age' => NumberToken.new(25),
      'status' => BooleanToken.new(true)
    })
    expected = [
      'run: custom_string',
      'age: 25',
      'status: true'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_nested_dict
    token = DictionaryToken.new({
      'jobs' => DictionaryToken.new({
        'build' => DictionaryToken.new({
          'runs-on' => StringToken.new('macos-latest')
        })
      })
    })
    expected = [
      'jobs:',
      '  build:',
      '    runs-on: macos-latest'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_single_value
    token = DictionaryToken.new({
      'age' => NumberToken.new(25)
    })
    expected = [
      'age: 25'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_single_nil_value
    token = DictionaryToken.new({
      'age' => NilToken.new
    })
    expected = [
      'age:'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_dict_multistring
    token = DictionaryToken.new({
      'age' => NumberToken.new(25),
      'run' => StringToken.new("hello world\nit is test line\nand third line"),
      'status' => BooleanToken.new(true),
      'run2' => StringToken.new("one more example\nthe second example"),
      'test' => BooleanToken.new(true)
    })
    expected = [
      'age: 25',
      'run: >',
      '  hello world',
      '  it is test line',
      '  and third line',
      'status: true',
      'run2: >',
      '  one more example',
      '  the second example',
      'test: true'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_nested_dict_nil_value
    token = DictionaryToken.new({
      'name' => StringToken.new('test'),
      'on' => DictionaryToken.new({
        'push' => NilToken.new,
        'workflow_dispatch' => NilToken.new
      })
    })
    expected = [
      'name: test',
      'on:',
      '  push:',
      '  workflow_dispatch:'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_dict_array
    token = DictionaryToken.new({
      'skills' => ArrayToken.new([
        StringToken.new('python'),
        StringToken.new('perl'),
        StringToken.new('pascal')
      ]),
      'age' => ArrayToken.new([
        NumberToken.new(15),
        NumberToken.new(23)
      ])
    })
    expected = [
      'skills:',
      '  - python',
      '  - perl',
      '  - pascal',
      'age:',
      '  - 15',
      '  - 23'
    ]
    assert_equal(expected, token.print)
  end

  def test_print_dict_nested_array
    token = DictionaryToken.new({
      'skills' => ArrayToken.new([
        DictionaryToken.new({
          'run' => StringToken.new('my_string'),
          'age' => NumberToken.new(25),
          'status' => BooleanToken.new(false)
        }),
        DictionaryToken.new({
          'run' => StringToken.new('my_string2'),
          'age' => NumberToken.new(31),
          'status' => BooleanToken.new(true)
        })
      ])
    })
    expected = [
      'skills:',
      '  - run: my_string',
      '    age: 25',
      '    status: false',
      '  - run: my_string2',
      '    age: 31',
      '    status: true'
    ]
    assert_equal(expected, token.print)
  end
end
