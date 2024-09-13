import { exec } from '@actions/exec';
import * as core from '@actions/core';
import { join } from 'path';
import { WS_NAME } from '../index';
import { getDepsFromLane } from '../utils/get-deps-from-lane';
import { updateDependencyVersions } from '../utils/update-dependency-versions';
import { laneShowOptions } from '../utils/lane-show-options';
import {
  packageManagerCommands,
  type PackageManager,
} from '../utils/package-manager-commands';
import { LaneDetails } from '../types/lane-details';

const run = async (
  testCommand: string,
  runnerTemp: string,
  packageManager: PackageManager,
  skipPush: boolean,
  laneId: string,
  branchName: string,
  gitUserName: string,
  gitUserEmail: string,
  projectDir: string,
  args: string[]
) => {
  const wsDir = join(runnerTemp, WS_NAME);
  const packageJsonPath = join(projectDir, 'package.json');

  // Create a temporary workspace
  await exec('bit', ['init', WS_NAME, ...args], { cwd: runnerTemp });

  core.info(`Fetching information about: ${laneId}`);

  const componentsInLane = {} as LaneDetails;

  await exec(
    'bit',
    ['lane', 'show', `"${laneId}"`, '--remote', '--json'],
    laneShowOptions(wsDir, componentsInLane)
  );

  // Extract component IDs from the lane and transform them into dependencies
  const dependenciesInLane = getDepsFromLane(componentsInLane);

  // Update the package.json with the new dependencies
  updateDependencyVersions(dependenciesInLane, packageJsonPath);

  core.info(`Installing dependencies`);

  await exec(`${packageManagerCommands[packageManager].install}`, [], {
    cwd: projectDir,
  });

  core.info(
    `Running the test command to verify changes in lane: ${testCommand}`
  );

  // Run the test command
  await exec(testCommand, [], {
    cwd: projectDir,
  });

  // Git operations
  await exec(`git config --global user.name "${gitUserName}"`, [], {
    cwd: projectDir,
  });

  await exec(`git config --global user.email "${gitUserEmail}"`, [], {
    cwd: projectDir,
  });

  await exec(`git checkout -b ${branchName}`, [], {
    cwd: projectDir,
  });

  await exec('git add .', [], { cwd: projectDir });

  try {
    await exec(
      `git commit -m "Committing the latest updates from lane: ${laneId} to the Git branch (automated)`,
      [],
      { cwd: projectDir }
    );
  } catch (error) {
    core.error(`Error while committing changes!`);
  }

  if (!skipPush) {
    await exec(`git push origin "${branchName}" -f`, [], { cwd: projectDir });
  } else {
    core.warning('WARNING - Skipped pushing to GitHub');
  }
};

export default run;
