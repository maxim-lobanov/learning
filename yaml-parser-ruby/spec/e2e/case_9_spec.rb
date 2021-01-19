require_relative '../../yaml_parser'

describe 'Test case 9' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'parameters:',
      '  BOOST_VERSION:',
      'steps:',
      '  - pwsh: >',
      '      $boostVersion = "${{ parameters.BOOST_VERSION }}".Replace(".", "_")',
      '      if ([string]::IsNullOrEmpty($boostVersion)) {',
      '        $envVariableName = "BOOST_ROOT"',
      '      } else {',
      '        $envVariableName = "BOOST_ROOT_${boostVersion}"',
      '      }',
      '      Write-Host "ENVIRONMENT_VARIABLE_NAME = ${envVariableName}"',
      '      $boostDirectory = (Get-Item env:$envVariableName).Value',
      '      Write-Host "BOOST_DIR = ${boostDirectory}"',
      '      Write-Host "##vso[task.setvariable variable=BOOST_DIR]${boostDirectory}"',
      '    displayName: Set BOOST_DIR environment variable',
      '  - bash: >',
      '      g++ -w -I ${BOOST_DIR}/include algorithms.cpp -o BoostApp',
      '      ./BoostApp',
      '    workingDirectory: src/boost/sources',
      '    displayName: Build with headers',
      '  - bash: >',
      '      g++ -w -I ${BOOST_DIR}/include -std=c++14 algorithms.cpp -o BoostApp2',
      '      ./BoostApp2',
      '    workingDirectory: src/boost/sources',
      '    displayName: Build with headers (c++14)',
      '  - bash: >',
      '      export PATH="${BOOST_DIR}/lib":$PATH',
      '      export LD_LIBRARY_PATH="${BOOST_DIR}/lib":$LD_LIBRARY_PATH',
      '      echo $PATH',
      '      echo $LD_LIBRARY_PATH',
      '      echo "##vso[task.setvariable variable=PATH]$PATH"',
      '      echo "##vso[task.setvariable variable=LD_LIBRARY_PATH]$LD_LIBRARY_PATH"',
      '    displayName: Configure PATH for dynamic build',
      '  - bash: >',
      '      g++ -w -DBOOST_LOG_DYN_LINK -I ${BOOST_DIR}/include',
      '      -std=c++14',
      '      -L ${BOOST_DIR}/lib graph_search.cpp',
      '      -o BoostSharedDebug',
      '      ./BoostSharedDebug',
      '    workingDirectory: src/boost/sources',
      '    displayName: Build with shared libs (Debug)',
      '  - bash: >',
      '      g++ -w -DBOOST_LOG_DYN_LINK -I ${BOOST_DIR}/include',
      '      -std=c++14',
      '      -L $BOOST_DIR/lib graph_search.cpp',
      '      -o BoostSharedRelease',
      '      ./BoostSharedRelease',
      '    workingDirectory: src/boost/sources',
      '    displayName: Build with shared libs (Release)'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
