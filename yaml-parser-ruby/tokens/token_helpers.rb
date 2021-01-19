require_relative 'boolean_token'
require_relative 'number_token'
require_relative 'nil_token'
require_relative 'string_token'

def parse_literal_token(lines)
  BooleanToken.parse_token(lines) ||
    NumberToken.parse_token(lines) ||
    NilToken.parse_token(lines) ||
    StringToken.parse_token(lines)
end

def find_first_symbol_index(line)
  index = 0
  index += 1 while index < line.size && [' ', "\t"].include?(line[index])
  index < line.size ? index : nil
end
