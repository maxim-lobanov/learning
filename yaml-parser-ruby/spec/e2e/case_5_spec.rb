require_relative '../../yaml_parser'

describe 'Test case 5' do
  it 'parse yaml as object and convert back to yaml' do
    source_yaml = [
      'name: Linter',
      'on:',
      '  pull_request:',
      '    branches: [main]',
      'jobs:',
      '  build:',
      '    name: Lint JSON & MD files',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - name: Checkout Code',
      '        uses: actions/checkout@v2',
      '      - name: Lint Code Base',
      '        uses: github/super-linter@v3',
      '        env:',
      '          VALIDATE_ALL_CODEBASE: false',
      '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
      '          VALIDATE_JSON: true',
      '          VALIDATE_MD: true',
      '          DEFAULT_BRANCH: ${{ github.base_ref }}',
      '      - name: Checking shebang lines in MacOS and Ubuntu releases.',
      '        run: ./images.CI/shebang-linter.ps1',
      '        shell: pwsh',
      '      - uses: actions/github-script@0.4.0',
      '        with:',
      '          github-token: ${{secrets.GITHUB_TOKEN}}',
      '          script: >',
      '            const issueLabels = await github.issues.listLabelsOnIssue({',
      '              issue_number: context.issue.number,',
      '              owner: context.repo.owner,',
      '              repo: context.repo.repo',
      '            });',
      '            const isAnnouncement = issueLabels.data && issueLabels.data',
      '              .map(label => label.name)',
      '              .includes("Announcement");',
      '            if (!isAnnouncement) {',
      '              github.issues.addLabels({',
      '                issue_number: context.issue.number,',
      '                owner: context.repo.owner,',
      '                repo: context.repo.repo,',
      '                labels: ["needs triage"]',
      '              })',
      '            }'
    ]

    root_token = YAMLParser.parse(source_yaml)
    target_yaml = YAMLParser.print(root_token)
    expect(target_yaml).to match_array(source_yaml)
  end
end
