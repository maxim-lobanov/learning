require_relative 'abstract_token'
require_relative 'array_token'
require_relative 'token_helpers'

class DictionaryToken < AbstractToken
  attr_reader :value

  def initialize(value)
    super()
    @value = value
  end

  def self.parse_token(lines)
    blocks = split_lines_to_blocks(lines)

    token_dict = {}
    blocks.each do |block|
      key, value = block.first.split(':', 2).map(&:strip)
      remain_lines = block.drop(1)
      if value.empty? && !remain_lines.empty?
        token_dict[key] = parse_complex_token(remain_lines)
      else
        token_dict[key] = parse_literal_token([value, *remain_lines])
      end
    end

    DictionaryToken.new(token_dict)
  end

  def print
    @value.map do |key, value|
      if value.is_a?(LiteralToken)
        print_literal_token(key, value)
      else
        print_complex_token(key, value)
      end
    end.flatten
  end

  def self.split_lines_to_blocks(lines)
    blocks = []
    lines.each do |line|
      if find_first_symbol_index(line).zero?
        blocks << [line]
      else
        blocks.last << line
      end
    end

    blocks
  end

  def self.parse_complex_token(remain_lines)
    first_inner_line = remain_lines.first
    first_symbol_index = find_first_symbol_index(first_inner_line)

    sublines = remain_lines.map { |line| line[first_symbol_index..] }
    if first_inner_line[first_symbol_index] == '-'
      ArrayToken.parse_token(sublines)
    else
      DictionaryToken.parse_token(sublines)
    end
  end

  def print_literal_token(key, token)
    subitems = token.print.map { |line| "  #{line}" }
    first_line_value = subitems.first.lstrip
    [
      "#{key}: #{first_line_value}".rstrip,
      *subitems.drop(1)
    ]
  end

  def print_complex_token(key, token)
    subitems = token.print.map { |line| "  #{line}" }
    [
      "#{key}:",
      *subitems
    ]
  end

  private_class_method :split_lines_to_blocks, :parse_complex_token
  private :print_literal_token, :print_complex_token
end
