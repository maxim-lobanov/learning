require_relative 'literal_token'

class BooleanToken < LiteralToken
  attr_reader :value

  def initialize(value)
    super()
    @value = value
  end

  def self.parse_token(lines)
    return nil if lines.size != 1

    bool_line = lines.first.downcase
    return nil unless ['true', 'false'].include?(bool_line)

    BooleanToken.new(bool_line == 'true')
  end

  def print
    [@value.to_s]
  end
end
