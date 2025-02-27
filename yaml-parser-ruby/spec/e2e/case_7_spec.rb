require_relative '../../yaml_parser'

describe 'Test case 7' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'stages:',
      '  - stage: Hosted_Ubuntu_1604',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 1604"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool: $[ coalesce(variables.ubuntu1604, "Hosted Ubuntu 1604") ]',
      '        strategy:',
      '          matrix:',
      '            PHP_7_1:',
      '              php.version: 7.1',
      '            PHP_7_2:',
      '              php.version: 7.2',
      '            PHP_7_3:',
      '              php.version: 7.3',
      '            PHP_7_4:',
      '              php.version: 7.4',
      '            PHP_8_0:',
      '              php.version: 8.0',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '            parameters:',
      '              phpVersion: $(php.version)',
      '      - job: HHVM_Linux',
      '        pool: $[ coalesce(variables.ubuntu1604, "Hosted Ubuntu 1604") ]',
      '        steps:',
      '          - template: src/php/templates/hhvm-linux.yml',
      '  - stage: Hosted_Ubuntu_1804',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 1804"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool: $[ coalesce(variables.ubuntu1804, "Hosted Ubuntu 1804") ]',
      '        strategy:',
      '          matrix:',
      '            PHP_7_1:',
      '              php.version: 7.1',
      '            PHP_7_2:',
      '              php.version: 7.2',
      '            PHP_7_3:',
      '              php.version: 7.3',
      '            PHP_7_4:',
      '              php.version: 7.4',
      '            PHP_8_0:',
      '              php.version: 8.0',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '            parameters:',
      '              phpVersion: $(php.version)',
      '      - job: HHVM_Linux',
      '        pool: $[ coalesce(variables.ubuntu1804, "Hosted Ubuntu 1804") ]',
      '        steps:',
      '          - template: src/php/templates/hhvm-linux.yml',
      '  - stage: Hosted_Ubuntu_2004',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Ubuntu 2004"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool:',
      '          name: Azure Pipelines',
      '          vmImage: ubuntu-20.04',
      '        strategy:',
      '          matrix:',
      '            PHP_7_4:',
      '              php.version: 7.4',
      '            PHP_8_0:',
      '              php.version: 8.0',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '            parameters:',
      '              phpVersion: $(php.version)',
      '      - job: HHVM_Linux',
      '        pool:',
      '          name: Azure Pipelines',
      '          vmImage: ubuntu-20.04',
      '        steps:',
      '          - template: src/php/templates/hhvm-linux.yml',
      '  - stage: VS2019',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted Windows 2019 with VS2019"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool: $[ coalesce(variables.vs2019, "Hosted Windows 2019 with VS2019") ]',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '  - stage: VS2017',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted VS2017"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool: $[ coalesce(variables.vs2017, "Hosted VS2017") ]',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '  - stage: MacOS_Public_Catalina',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted macOS Catalina"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool:',
      '          name: LimitedPublicCatalina',
      '          vmImage: macos-10.15',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml',
      '  - stage: MacOS_Public_BigSur',
      '    condition: and(succeeded(),  contains(variables.targetPools, "Hosted macOS BigSur"))',
      '    dependsOn: []',
      '    jobs:',
      '      - job: PHP_Composer',
      '        pool:',
      '          name: LimitedPublicBigSur',
      '          vmImage: macos-11.0',
      '        steps:',
      '          - template: src/php/templates/php-composer.yml'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
