require_relative 'literal_token'

class NilToken < LiteralToken
  def self.parse_token(lines)
    return nil unless lines.size == 1
    return nil unless lines.first.empty?

    NilToken.new
  end

  def print
    ['']
  end
end
