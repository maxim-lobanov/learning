require_relative 'tokens/dictionary_token'
require_relative 'tokens/token_helpers'

class YAMLParser
  def self.parse(lines)
    cleaned_lines = lines.filter do |line|
      first_symbol_index = find_first_symbol_index(line.rstrip)
      !first_symbol_index.nil? && line[first_symbol_index] != '#'
    end.map(&:rstrip)
    DictionaryToken.parse_token(cleaned_lines)
  end

  def self.parse_from_file(filepath)
    lines = File.readlines(filepath)
    parse(lines)
  end

  def self.print(root_token)
    root_token.print
  end

  def self.print_to_file(filepath, root_token)
    lines = root_token.print
    File.open(filepath, 'w+') do |f|
      lines.each { |line| f.puts(line) }
    end
  end
end
