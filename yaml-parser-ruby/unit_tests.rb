base_dir = File.expand_path(__dir__)
all_test_files = Dir["#{base_dir}/spec/unit/*.rb"]
all_test_files.each do |file|
  require file
end
