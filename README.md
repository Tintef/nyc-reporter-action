# nyc-reporter-action

## Usage example:

```yml
name: 'Run tests'

on:
  pull_request:
    branches:
      - '*'

jobs:
  run-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v1
      with:
        node-version: '12'
        check-latest: true
    - run: npm install

    - name: Run tests
      run: npm run test

    - uses: tintef/nyc-reporter-action
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        REPORTER: 'text' # defaults to 'text-summary'
```
