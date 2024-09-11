import { exec } from '@actions/exec';
import * as core from '@actions/core';
import { join } from 'path';
import { WS_NAME } from '../index';
import { addLaneCompsToOverrides } from '../utils/add-lane-comps-to-overrides';
import { getDepsFromLane } from '../utils/get-deps-from-lane';
import type { LaneDetails } from '../types/lane-details';
import type { PackageManager } from '../types/package-manager';

const installCommand: Record<PackageManager, string> = {
  npm: 'npm install',
  yarn: 'yarn add',
  pnpm: 'pnpm install',
};

const run = async (
  runnerTemp: string,
  packageManager: PackageManager,
  skipPush: boolean,
  skipCI: boolean,
  laneId: string,
  branchName: string,
  gitUserName: string,
  gitUserEmail: string,
  projectDir: string,
  args: string[]
) => {
  const WS_DIR = join(runnerTemp, WS_NAME);

  // // create a temporary workspace
  await exec('bit', ['init', WS_NAME, ...args], { cwd: runnerTemp });

  // retrieve the list of components in a lane
  let compsInLaneJson = '';
  let compsInLaneObj = {} as LaneDetails;

  const laneShowOptions = {
    cwd: WS_DIR,
    listeners: {
      stdout: (data: Buffer) => {
        compsInLaneJson = data.toString();
        compsInLaneObj = JSON.parse(compsInLaneJson);
      },
    },
  };

  await exec(
    'bit',
    ['lane', 'show', `"${laneId}"`, '--remote', '--json'],
    laneShowOptions
  );

  // remove temporary workspace
  // await exec('rm', ['-rf', WS_DIR]);

  // add lane components as overrides in the project's package.json

  const [overrides, depsToInstall] = getDepsFromLane(compsInLaneObj);

  addLaneCompsToOverrides(projectDir, overrides);

  await exec(`${installCommand[packageManager]} ${depsToInstall}`, [], {
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
      `git commit -m "Commiting the latest updates from lane: ${laneId} to the Git branch (automated)${
        skipCI ? ` [skip-ci]` : ''
      }"`,
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
