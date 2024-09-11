import * as core from '@actions/core';
import run from './scripts/install-components-from-lane';
import { isValidPOSIXPath } from './utils/validate-posix-path';
import type { PackageManager } from './types/package-manager';

try {
  const wsDir: string = core.getInput('ws-dir') || process.env.WSDIR || './';
  const projectDir: string =
    core.getInput('project-dir') || process.env.PROJECT_DIR || './';
  const args = process.env.LOG ? [`--log=${process.env.LOG}`] : [];
  const packageManager =
    (core.getInput('package-manager') as PackageManager) ||
    process.env.PACKAGE_MANAGER ||
    'npm';
  const laneId: string = core.getInput('lane-id') || process.env.LANE_ID || '';
  const branchName: string = core.getInput('branch-name') || laneId;
  const skipPush: boolean =
    core.getInput('skip-push') === 'true' ? true : false;
  const skipCI: boolean = core.getInput('skip-ci') === 'false' ? false : true;

  if (!isValidPOSIXPath(projectDir)) {
    throw new Error('Invalid project directory path');
  }

  if (!laneId) {
    throw new Error('Lane ID is not found');
  }

  if (laneId === 'main') {
    throw new Error('Specify a lane other than "main"!');
  }

  const gitUserName =
    core.getInput('git-user-name') || process.env.GIT_USER_NAME;
  if (!gitUserName) {
    throw new Error('Git user name not found');
  }

  const gitUserEmail =
    core.getInput('git-user-email') || process.env.GIT_USER_EMAIL;
  if (!gitUserEmail) {
    throw new Error('Git user email token not found');
  }

  const runnerTemp = core.getInput('runner-temp') || process.env.RUNNER_TEMP;
  if (!runnerTemp) {
    throw new Error('Runner temp directory not found');
  }

  run(
    wsDir,
    packageManager,
    skipPush,
    skipCI,
    laneId,
    branchName,
    gitUserName,
    gitUserEmail,
    projectDir,
    args
  );
} catch (error) {
  core.setFailed((error as Error).message);
}
