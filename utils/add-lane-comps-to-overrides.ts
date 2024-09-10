import fs from 'fs';
import { join } from 'path';
import { getDepsFromLane } from './get-deps-from-lane';
import type { LaneDetails } from '../types/lane-details';

export const addLaneCompsToOverrides = (
  laneDetails: LaneDetails,
  projectDir: string
) => {
  const packageJsonPath = join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const depsFromLane = getDepsFromLane(laneDetails);

  const packageJsonOverrides = packageJson.overrides || {};

  packageJson.overrides = {
    ...packageJsonOverrides,
    ...depsFromLane,
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
