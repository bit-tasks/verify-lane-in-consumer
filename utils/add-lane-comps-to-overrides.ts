import fs from 'fs';
import { join } from 'path';

export const addLaneCompsToOverrides = (
  packageJsonPath: string,
  overrides: Record<string, string> = {}
) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const packageJsonOverrides = packageJson.overrides || {};
  packageJson.overrides = {
    ...packageJsonOverrides,
    ...overrides,
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
