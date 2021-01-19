require_relative '../../tokens/nil_token'
require 'test/unit'

class TestNilToken < Test::Unit::TestCase
  def test_parse_nil
    actual = NilToken.parse_token([''])
    assert_instance_of NilToken, actual
  end
end
