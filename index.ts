import * as core from '@actions/core';
import run from './scripts/install-components-from-lane';
import { isValidPOSIXPath } from './utils/validate-posix-path';
import type { PackageManager } from './utils/package-manager-commands';

export const WS_NAME = 'bit-ws';

try {
  const testCommand: string = core.getInput('test-command') || 'npm test';
  const projectDir: string = core.getInput('project-dir') || './';
  const args = process.env.LOG ? [`--log=${process.env.LOG}`] : [];
  const packageManager =
    (core.getInput('package-manager') as PackageManager) || 'npm';
  const laneId: string = core.getInput('lane-id') || '';
  const branchName: string = core.getInput('branch-name') || laneId;
  const skipPush: boolean =
    core.getInput('skip-push') === 'true' ? true : false;

  if (!isValidPOSIXPath(projectDir)) {
    throw new Error('Invalid project directory path');
  }

  if (!laneId) {
    throw new Error('Lane ID is not found');
  }

  if (laneId === 'main') {
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
    testCommand,
    runnerTemp,
    packageManager,
    skipPush,
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
