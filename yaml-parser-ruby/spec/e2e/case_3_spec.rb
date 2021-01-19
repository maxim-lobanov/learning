require_relative '../../yaml_parser'

describe 'Test case 3' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'name: Fake definition',
      'on:',
      '  push:',
      '    branches:',
      '      - main',
      '  pull_request:',
      '    branches:',
      '      - main',
      'jobs:',
      '  test:',
      '    runs-on: ubuntu-latest',
      '    name: Check licenses',
      '    steps:',
      '      - uses: actions/checkout@v2',
      '      - run: npm ci',
      '      - name: Install',
      '        run: >',
      '          cd $RUNNER_TEMP',
      '          curl -Lfs -o fake_file.tar.gz https://github.com/fake_org/fake_repo/releases/download/2.12.2/fake_file-2.12.2-linux-x64.tar.gz',
      '          sudo tar -xzf fake_file.tar.gz',
      '          sudo mv fake_file /usr/local/bin/fake_file',
      '      - run: status'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
