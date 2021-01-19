require_relative '../../yaml_parser'

describe 'Test case 2' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'name: test',
      'on:',
      '  push:',
      '  workflow_dispatch:',
      'jobs:',
      '  build:',
      '    runs-on: macos-latest',
      '    steps:',
      '      - run: printenv | sort',
      '      - run: >',
      '          sudo ${ANDROID_HOME}/tools/bin/sdkmanager --list',
      '          & execute_command "hello world"',
      '      - run: java --version'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
