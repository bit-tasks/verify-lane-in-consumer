import { exec } from '@actions/exec';
import * as core from '@actions/core';
import { join } from 'path';
import { fetchLaneComponents } from '../utils/fetch-lane-components';
import { laneComponentsToDeps } from '../utils/lane-components-to-deps';
import { updateDependencyVersions } from '../utils/update-dependency-versions';
import {
  packageManagerCommands,
  type PackageManager,
} from '../utils/package-manager-commands';

const run = async (
  useOverrides: boolean,
  testCommand: string,
  packageManager: PackageManager,
  skipPush: boolean,
  laneId: string,
  branchName: string,
  gitUserName: string,
  gitUserEmail: string,
  projectDir: string,
  args: string[]
) => {
  const packageJsonPath = join(projectDir, 'package.json');

  core.info(`Fetching list of components in lane: ${laneId}`);
  const laneData = await fetchLaneComponents(laneId);

  if (laneData?.data.lanes.listComponents.length) {
    const dependenciesInLane = laneComponentsToDeps(laneData);
    core.info(
      `Updating package.json with the following dependencies:\n ${JSON.stringify(
        dependenciesInLane
      )}`
    );
    updateDependencyVersions(dependenciesInLane, packageJsonPath, useOverrides);
  } else {
    core.error(`No components found in lane: ${laneId}`);
  }

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
