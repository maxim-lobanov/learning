require_relative '../../yaml_parser'

describe 'Test case 1' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'people:',
      '  - martin:',
      '      name: Martin Developer',
      '      surname: hello My',
      '      job: World my',
      '      age: 25',
      '      skills:',
      '        - python',
      '        - perl',
      '        - pascal',
      '      status: true',
      '  - tabitha:',
      '      name: Tabitha Bitumen',
      '      job: Developer',
      '      age: 31.2',
      '      skills:',
      '        - lisp',
      '        - fortran',
      '        - erlang',
      '      status: false'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to eql(source_yaml)
  end
end
