require_relative '../../yaml_parser'

describe 'Test case 4' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'name: Main workflow',
      'on:',
      '  push:',
      '    branches:',
      '      - main',
      '    paths-ignore:',
      '      - **.md',
      '  pull_request:',
      '    paths-ignore:',
      '      - **.md',
      'jobs:',
      '  run:',
      '    name: Run',
      '    runs-on: ${{ matrix.operating-system }}',
      '    strategy:',
      '      matrix:',
      '        operating-system: [ubuntu-latest, windows-latest]',
      '    steps:',
      '      - name: Checkout',
      '        uses: actions/checkout@v2',
      '      - name: Set Node.js 12.x',
      '        uses: actions/setup-node@v1',
      '        with:',
      '          node-version: 12.x',
      '      - name: npm install',
      '        run: npm install',
      '      - name: Lint',
      '        run: npm run format-check',
      '      - name: npm test',
      '        run: npm test',
      '      - name: Run with setup-python 2.7',
      '        uses: ./',
      '        with:',
      '          python-version: 2.7',
      '      - name: Verify 2.7',
      '        run: python __tests__/verify-python.py 2.7',
      '      - name: Run with setup-python 3.5',
      '        uses: ./',
      '        with:',
      '          python-version: 3.5',
      '      - name: Verify 3.5',
      '        run: python __tests__/verify-python.py 3.5',
      '      - name: Run with setup-python 3.6',
      '        uses: ./',
      '        with:',
      '          python-version: 3.6',
      '      - name: Verify 3.8',
      '        run: python __tests__/verify-python.py 3.8'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
