require_relative 'literal_token'

class NumberToken < LiteralToken
  attr_reader :value

  def initialize(value)
    super()
    @value = value
  end

  def self.parse_token(lines)
    return nil if lines.size != 1

    number_line = lines.first

    parse_integer(number_line) || parse_float(number_line)
  end

  def print
    [@value.to_s]
  end

  def self.parse_integer(line)
    value_int = Integer(line)
    NumberToken.new(value_int)
  rescue ArgumentError
    nil
  end

  def self.parse_float(line)
    value_float = Float(line)
    NumberToken.new(value_float)
  rescue ArgumentError
    nil
  end

  private_class_method :parse_integer, :parse_float
end
