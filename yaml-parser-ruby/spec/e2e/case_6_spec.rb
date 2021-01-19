require_relative '../../yaml_parser'

describe 'Test case 6' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'jobs:',
      '  - job: Ubuntu_1604',
      '    pool: $[ coalesce(variables.ubuntu1604, "Hosted Ubuntu 1604") ]',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 1604"))',
      '    steps:',
      '      - template: src/ant/templates/ant-test.yml',
      '  - job: Ubuntu_1804',
      '    pool: $[ coalesce(variables.ubuntu1804, "Hosted Ubuntu 1804") ]',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 1804"))',
      '    steps:',
      '      - template: src/ant/templates/ant-test.yml',
      '  - job: Ubuntu_2004',
      '    pool:',
      '      name: Azure Pipelines',
      '      vmImage: ubuntu-20.04',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 2004"))',
      '    steps:',
      '      - template: src/ant/templates/ant-test.yml',
      '  - job: VS2017',
      '    pool: $[ coalesce(variables.vs2017, "Hosted VS2017") ]',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted VS2017"))',
      '    steps:',
      '      - template: src/ant/templates/ant-test.yml',
      '  - job: VS2019',
      '    pool: $[ coalesce(variables.vs2019, "Hosted Windows 2019 with VS2019") ]',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Windows 2019 with VS2019"))',
      '    steps:',
      '      - template: src/ant/templates/ant-test.yml'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
