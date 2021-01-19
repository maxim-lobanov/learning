require_relative 'abstract_token'
require_relative 'dictionary_token'
require_relative 'literal_token'
require_relative 'token_helpers'

class ArrayToken < AbstractToken
  attr_reader :value

  def initialize(value)
    super()
    @value = value
  end

  def self.parse_token(lines)
    blocks = split_lines_to_blocks(lines)
    token_array = []
    blocks.each do |block|
      if block.reject(&:empty?).size > 1
        token_array << DictionaryToken.parse_token(block)
      else
        token_array << parse_literal_token(block)
      end
    end

    ArrayToken.new(token_array)
  end

  def print
    groups = @value.map(&:print)
    groups.map do |group|
      [
        "- #{group.first}",
        *group.drop(1).map { |line| "  #{line}" }
      ]
    end.flatten
  end

  def self.split_lines_to_blocks(lines)
    blocks = []
    lines.each do |line|
      line_without_prefix = line[2..]
      if line.start_with?('- ')
        blocks << [line_without_prefix]
      else
        blocks.last << line_without_prefix
      end
    end

    blocks
  end

  private_class_method :split_lines_to_blocks
end
