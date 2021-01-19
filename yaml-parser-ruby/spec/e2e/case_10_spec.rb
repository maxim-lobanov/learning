require_relative '../../yaml_parser'

describe 'Test case 10' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'schedules:',
      '  - cron: 0 0 * * *',
      '    displayName: Daily',
      '    branches:',
      '      include:',
      '        - master',
      '    always: true',
      'trigger: none',
      'pr: none',
      'jobs:',
      '  - job: Run_tests',
      '    pool:',
      '      vmImage: ubuntu-18.04',
      '    timeoutInMinutes: 360',
      '    steps:',
      '      - script: >',
      '          export AZDEV_TOKEN="$(System.AccessToken)"',
      '          if [[ "${BUILD_SOURCEBRANCH}" == "refs/heads/master" ]]; then',
      '              echo "enable creating bugs"',
      '              export AZP_BUG_PAT="$(AZP_BUG_PAT)"',
      '          fi',
      '          cd test',
      '          npm install',
      '          npm run test-report -- --branch "${BUILD_SOURCEBRANCH}"',
      '        displayName: Run tests',
      '      - task: PublishTestResults@2',
      '        condition: always()',
      '        inputs:',
      '          testResultsFormat: JUnit',
      '          testResultsFiles: test/test-results.xml'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
