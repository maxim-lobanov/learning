require_relative '../../tokens/dictionary_token'
require 'test/unit'

class TestDictionaryToken < Test::Unit::TestCase
  def test_parse_simple_dict
    input = [
      'run: custom_string',
      'age: 25',
      'status: true'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(3, actual.value.size)
    assert_instance_of(StringToken, actual.value['run'])
    assert_equal('custom_string', actual.value['run'].value)
    assert_instance_of(NumberToken, actual.value['age'])
    assert_equal(25, actual.value['age'].value)
    assert_instance_of(BooleanToken, actual.value['status'])
    assert_equal(true, actual.value['status'].value)
  end

  def test_parse_simple_dict_multistring
    input = [
      'age: 25',
      'run: |',
      '  hello world',
      '  it is test line',
      '  and third line',
      'status: true',
      'run2: >',
      '  one more example',
      '  the second example',
      'test: true'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(5, actual.value.size)
    assert_instance_of(NumberToken, actual.value['age'])
    assert_equal(25, actual.value['age'].value)
    assert_instance_of(StringToken, actual.value['run'])
    assert_equal("hello world\nit is test line\nand third line", actual.value['run'].value)
    assert_instance_of(BooleanToken, actual.value['status'])
    assert_equal(true, actual.value['status'].value)
    assert_instance_of(StringToken, actual.value['run2'])
    assert_equal("one more example\nthe second example", actual.value['run2'].value)
    assert_instance_of(BooleanToken, actual.value['test'])
    assert_equal(true, actual.value['test'].value)
  end

  def test_parse_simple_dict_single_value
    input = [
      'age: 25'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(1, actual.value.size)
    assert_instance_of(NumberToken, actual.value['age'])
    assert_equal(25, actual.value['age'].value)
  end

  def test_parse_simple_dict_nil_value
    input = [
      'age:'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(1, actual.value.size)
    assert_instance_of(NilToken, actual.value['age'])
  end

  def test_parse_nested_dict
    input = [
      'jobs:',
      '  build:',
      '    runs-on: macos-latest'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(1, actual.value.size)
    jobs = actual.value['jobs']
    assert_instance_of(DictionaryToken, jobs)
    assert_equal(1, jobs.value.size)
    build = jobs.value['build']
    assert_instance_of(DictionaryToken, build)
    assert_equal(1, build.value.size)
    runs_on = build.value['runs-on']
    assert_instance_of(StringToken, runs_on)
    assert_equal('macos-latest', runs_on.value)
  end

  def test_parse_nested_dict2
    input = [
      'jobs:',
      '  build:',
      '    runs-on: macos-latest',
      'age: 25',
      'status: true'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(3, actual.value.size)
    jobs = actual.value['jobs']
    assert_instance_of(DictionaryToken, jobs)
    assert_equal(1, jobs.value.size)
    build = jobs.value['build']
    assert_instance_of(DictionaryToken, build)
    assert_equal(1, build.value.size)
    runs_on = build.value['runs-on']
    assert_instance_of(StringToken, runs_on)
    assert_equal('macos-latest', runs_on.value)
    assert_instance_of(NumberToken, actual.value['age'])
    assert_equal(25, actual.value['age'].value)
    assert_instance_of(BooleanToken, actual.value['status'])
    assert_equal(true, actual.value['status'].value)
  end

  def test_parse_nested_dict_nil_value
    input = [
      "name: 'test'",
      'on:',
      '  push:',
      '  workflow_dispatch:',
      'trigger: none'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(3, actual.value.size)
    name = actual.value['name']
    assert_instance_of(StringToken, name)
    assert_equal('test', name.value)
    on = actual.value['on']
    assert_instance_of(DictionaryToken, on)
    assert_equal(2, on.value.size)
    assert_instance_of(NilToken, on.value['push'])
    assert_instance_of(NilToken, on.value['workflow_dispatch'])
    trigger = actual.value['trigger']
    assert_instance_of(StringToken, trigger)
    assert_equal('none', trigger.value)
  end

  def test_parse_dict_array
    input = [
      'skills:',
      '  - python',
      '  - perl',
      '  - pascal',
      'age:',
      '  - 15',
      '  - 23'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(2, actual.value.size)
    skills = actual.value['skills']
    assert_instance_of(ArrayToken, skills)
    assert_equal(3, skills.value.size)
    assert_instance_of(StringToken, skills.value[0])
    assert_equal('python', skills.value[0].value)
    assert_instance_of(StringToken, skills.value[1])
    assert_equal('perl', skills.value[1].value)
    assert_instance_of(StringToken, skills.value[2])
    assert_equal('pascal', skills.value[2].value)
    age = actual.value['age']
    assert_instance_of(ArrayToken, age)
    assert_equal(2, age.value.size)
    assert_instance_of(NumberToken, age.value[0])
    assert_equal(15, age.value[0].value)
    assert_instance_of(NumberToken, age.value[1])
    assert_equal(23, age.value[1].value)
  end

  def test_parse_dict_nested_array
    input = [
      'skills:',
      '  - run: my_string',
      '    age: 25',
      '    status: false',
      '  - run: my_string2',
      '    age: 31',
      '    status: true'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_equal(1, actual.value.size)
    skills = actual.value['skills']
    assert_instance_of(ArrayToken, skills)
    assert_equal(2, skills.value.size)
    assert_instance_of(DictionaryToken, skills.value[0])
    assert_instance_of(StringToken, skills.value[0].value['run'])
    assert_equal('my_string', skills.value[0].value['run'].value)
    assert_instance_of(NumberToken, skills.value[0].value['age'])
    assert_equal(25, skills.value[0].value['age'].value)
    assert_instance_of(BooleanToken, skills.value[0].value['status'])
    assert_equal(false, skills.value[0].value['status'].value)
    assert_instance_of(DictionaryToken, skills.value[1])
    assert_instance_of(StringToken, skills.value[1].value['run'])
    assert_equal('my_string2', skills.value[1].value['run'].value)
    assert_instance_of(NumberToken, skills.value[1].value['age'])
    assert_equal(31, skills.value[1].value['age'].value)
    assert_instance_of(BooleanToken, skills.value[1].value['status'])
    assert_equal(true, skills.value[1].value['status'].value)
  end

  def test_parse_tabs_yaml
    input = [
      'jobs:',
      "\tbuild:",
      "\t\truns-on: macos-latest",
      'age: 25',
      'status: true'
    ]
    actual = DictionaryToken.parse_token(input)
    assert_instance_of(DictionaryToken, actual)
    assert_equal(3, actual.value.size)
    jobs = actual.value['jobs']
    assert_instance_of(DictionaryToken, jobs)
    assert_equal(1, jobs.value.size)
    build = jobs.value['build']
    assert_instance_of(DictionaryToken, build)
    assert_equal(1, build.value.size)
    runs_on = build.value['runs-on']
    assert_instance_of(StringToken, runs_on)
    assert_equal('macos-latest', runs_on.value)
    assert_instance_of(NumberToken, actual.value['age'])
    assert_equal(25, actual.value['age'].value)
    assert_instance_of(BooleanToken, actual.value['status'])
    assert_equal(true, actual.value['status'].value)
  end
end
