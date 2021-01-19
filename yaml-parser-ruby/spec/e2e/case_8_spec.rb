require_relative '../../yaml_parser'

describe 'Test case 8' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'steps:',
      '  - task: Bash@3',
      '    displayName: Set Xamarin & Mono',
      '    inputs:',
      '      targetType: filePath',
      '      filePath: src/xamarin-ios/select-xamarin.sh',
      '      arguments: ${{ parameters.XAMARIN_SYMLINK }}',
      '  - task: Bash@3',
      '    displayName: Set Xcode',
      '    inputs:',
      '      targetType: filePath',
      '      filePath: src/xamarin-ios/select-xcode.sh',
      '      arguments: ${{ parameters.XCODE_VERSION }}',
      '  - task: UseDotNet@2',
      '    displayName: Switch .NET Core version',
      '    inputs:',
      '      version: ${{ parameters.NETCORE_VERSION }}',
      '  - task: CmdLine@2',
      '    displayName: Restore Nuget',
      '    inputs:',
      '      script: nuget restore $(build.sourcesdirectory)/src/xamarin-ios/ToDoList.Forms/Todo.sln',
      '  - task: XamariniOS@1',
      '    displayName: Build Xamarin.iOS solution',
      '    inputs:',
      '      solutionFile: $(build.sourcesdirectory)/src/xamarin-ios/ToDoList.Forms/Todo.iOS/Todo.iOS.csproj',
      '      configuration: Release',
      '      packageApp: false',
      '      buildForSimulator: true',
      '      runNugetRestore: false',
      '      args: /t:Rebuild',
      '      buildToolOption: msbuild'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
