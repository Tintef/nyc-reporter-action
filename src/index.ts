import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';

async function run () {
  try {
    let coverageSummary = '';

    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          coverageSummary += data.toString();
        },
      },
    };

    // Report coverage with given reporter
    const reporter = core.getInput('REPORTER') || 'text-summary'
    await exec.exec('npx', [
      'nyc',
      'report',
      `--reporter=${reporter}`,
      '-t',
      'coverage',
    ], options);
    
    // Get repo and payload from context
    const { repo, payload } = github.context;

    // If running on a PR, submit a comment with the coverage
    if (payload.pull_request?.number) {
      const token = core.getInput('GITHUB_TOKEN');
      const octokit = github.getOctokit(token);

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
