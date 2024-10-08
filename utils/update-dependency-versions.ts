import * as fs from 'fs';

export const updateDependencyVersions = (
  newDependencyVersions: { [key: string]: string },
  packageJsonPath: string,
  addNewDepsToOverride: boolean = false
): void => {
  try {
    // Read the existing package.json file
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // List of dependency sections to update
    const dependencySections = [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
      'bundledDependencies',
    ];

    // Iterate over each dependency section
    dependencySections.forEach((section) => {
      if (packageJson[section]) {
        // Update versions for matching dependencies
        Object.keys(packageJson[section]).forEach((dependency) => {
          if (newDependencyVersions[dependency]) {
            packageJson[section][dependency] =
              newDependencyVersions[dependency];
          }
        });
      }
    });

    if (addNewDepsToOverride) {
      // Add new dependencies to the overrides section
      const overrides = packageJson.overrides || {};
      packageJson.overrides = {
        ...overrides,
        ...newDependencyVersions,
      };
    }

    // Write the updated package.json back to the file system
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error(`Error updating dependencies: ${error}`);
  }
};
