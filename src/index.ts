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
    const coverageFolder = core.getInput('COVERAGE_FOLDER') || 'coverage'
    const skipCoverageFolder = core.getInput('SKIP_COVERAGE_FOLDER') || false
    const workingDirectory = core.getInput('WORKING_DIRECTORY') || '';
    const exclude = core.getInput('EXCLUDE') || '';

    let args = ['nyc', 'report', `--reporter=${reporter}`];
    if (!skipCoverageFolder) {
      args = [...args, '-t', coverageFolder];
    }

    if (workingDirectory) {
      args = [...args, '--cwd', workingDirectory];
    }

    if (exclude) {
      args = [...args, '--exclude', exclude];
    }

    await exec.exec('npx', args, options);

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
        body: `\`\`\`\n${coverageSummary}\n\`\`\``,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
