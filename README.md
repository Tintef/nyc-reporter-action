# Nyc reporter action

This action comments a pull request with a test coverage report genreated using [nyc](https://github.com/istanbuljs/nyc).

**Note:** this action does not run any tests, but instead expects the tests to have been run by another action already.

## Inputs

#### `GITHUB_TOKEN` (**Required**)

Github token used for posting the comment. Add your token as a secret to repo in order to use: `${{ secrets.GITHUB_TOKEN }}`.

#### `REPORTER` (**Optional**)

The reporter to use, by default it will use `text-summary` reporter.

#### `COVERAGE_FOLDER` (**Optional**)

Folder where the `coverage` folder is located.

## Output example:

#### `text-summary`

```
=============================== Coverage summary ===============================
Statements   : 100% ( 9/9 )
Branches     : 100% ( 0/0 )
Functions    : 100% ( 4/4 )
Lines        : 100% ( 8/8 )
================================================================================
```

#### `text`

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 index.ts |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
```


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

## Roadmap:

- Add ability to delete previous comment and create a new one or update the old comment when a new a PR is updated.
