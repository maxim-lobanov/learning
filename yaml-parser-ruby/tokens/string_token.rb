require_relative 'literal_token'
require_relative 'token_helpers'

class StringToken < LiteralToken
  attr_reader :value

  def initialize(value)
    super()
    @value = value
  end

  def self.parse_token(lines)
    if lines.size == 1
      parse_single_line(lines.first)
    else
      parse_multiple_lines(lines)
    end
  end

  def print
    return [''] if @value.empty?

    lines = @value.split("\n")
    lines.unshift('>') if lines.size > 1
    lines
  end

  def self.parse_single_line(line)
    if line[0] == line[-1] && ['"', "'"].include?(line[0])
      StringToken.new(line[1...-1])
    else
      StringToken.new(line)
    end
  end

  def self.parse_multiple_lines(lines)
    return nil unless ['>', '|'].include?(lines.first.strip)

    remain_lines = lines.drop(1)
    indent = find_first_symbol_index(remain_lines.first)
    multiline = remain_lines.map { |line| line[indent..] }.join("\n")
    StringToken.new(multiline)
  end

  private_class_method :parse_single_line, :parse_multiple_lines
end
