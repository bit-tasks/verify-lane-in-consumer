import fs from 'fs';
import { join } from 'path';

export const addLaneCompsToOverrides = (
  projectDir: string,
  overrides: Record<string, string> = {}
) => {
  const packageJsonPath = join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const packageJsonOverrides = packageJson.overrides || {};
  packageJson.overrides = {
    ...packageJsonOverrides,
    ...overrides,
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
