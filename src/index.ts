import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import * as fs from 'fs';

async function run () {
  try {
    // Report coverage with given reporter
    const reporter = core.getInput('REPORTER') || 'text-summary'
    await exec.exec('npx', [
      'nyc',
      'report',
      '--reporter',
      reporter,
      '-t',
      'coverage',
      '>>',
      'nyc.output.txt',
    ]);
    
    // Get repo and payload from context
    const { repo, payload } = github.context;

    // If running on a PR, submit a comment with the coverage
    if (payload.pull_request?.number) {
      const token : string = core.getInput('GITHUB_TOKEN');
      const octokit = github.getOctokit(token);
      const coverageSummary = fs.readFileSync('./nyc.output.txt', 'utf-8');

      octokit.issues.createComment({
        repo: repo.repo,
        owner: repo.owner,
        issue_number: payload.pull_request.number,
        body: coverageSummary,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
