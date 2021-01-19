require_relative '../../tokens/nil_token'
require 'test/unit'

class TestNilToken < Test::Unit::TestCase
  def test_print_true_value
    token = NilToken.new
    expected = ['']
    assert_equal(expected, token.print)
  end
end
