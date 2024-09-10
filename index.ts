import * as core from '@actions/core';
import run from './scripts/install-modified-components';
import { isValidPOSIXPath } from './utils/validate-posix-path';
import type { PackageManager } from './types/package-manager';

try {
  const projectDir: string =
    core.getInput('project-dir') || process.env.PROJECT_DIR || './';
  const args = process.env.LOG ? [`--log=${process.env.LOG}`] : [];
  const packageManager =
    (core.getInput('package-manager') as PackageManager) || 'npm';
  const laneName: string = core.getInput('lane-name');
  const branchName: string = core.getInput('branch-name') || laneName;
  const skipPush: boolean =
    core.getInput('skip-push') === 'true' ? true : false;
  const skipCI: boolean = core.getInput('skip-ci') === 'false' ? false : true;

  if (!isValidPOSIXPath(projectDir)) {
    throw new Error('Invalid project directory path');
  }

  if (!laneName) {
    throw new Error('Lane name is not found');
  }

  if (laneName === 'main') {
    throw new Error('Specify a lane other than "main"!');
  }

  const gitUserName = process.env.GIT_USER_NAME;
  if (!gitUserName) {
    throw new Error('Git user name not found');
  }

  const gitUserEmail = process.env.GIT_USER_EMAIL;
  if (!gitUserEmail) {
    throw new Error('Git user email token not found');
  }

  const runnerTemp = process.env.RUNNER_TEMP;
  if (!runnerTemp) {
    throw new Error('Runner temp directory not found');
  }

  run(
    runnerTemp,
    packageManager,
    skipPush,
    skipCI,
    laneName,
    branchName,
    gitUserName,
    gitUserEmail,
    projectDir,
    args
  );
} catch (error) {
  core.setFailed((error as Error).message);
}
