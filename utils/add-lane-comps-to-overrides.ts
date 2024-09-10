import fs from 'fs';
import { join } from 'path';
import { getDepsFromLane } from './get-deps-from-lane';
import type { LaneDetails } from '../types/lane-details';

export const addLaneCompsToOverrides = (
  LaneDetails: LaneDetails,
  projectDir: string
) => {
  const packageJson = JSON.parse(
    fs.readFileSync(join(projectDir, 'package.json'), 'utf-8')
  );
  const depsFromLane = getDepsFromLane(LaneDetails);

  const packageJsonOverrides = packageJson.overrides || {};

  packageJson.overrides = {
    ...packageJsonOverrides,
    ...depsFromLane,
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
};
