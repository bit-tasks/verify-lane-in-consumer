import type { LaneDetails } from '../types/lane-details';

type DependenciesInLane = {
  [key: string]: string;
};

export const getDepsFromLane = (
  laneDetails: LaneDetails
): DependenciesInLane => {
  // const overrides: Record<string, string> = {};
  // const listOfDepsToInstall: string[] = [];
  const dependencies: DependenciesInLane = {};
  laneDetails.components.forEach((component) => {
    const [componentIdNoVersion, componentVersion] = component.id.split('@');
    const componentIdParts = componentIdNoVersion.split('/');
    const scope = componentIdParts!.shift()!.replace(/\./g, '/');
    const packageScope = '@'.concat(scope.replace(/\./g, '/'));
    const packageNameNoScope = componentIdParts.join('.');
    // listOfDepsToInstall.push(
    //   `${packageScope}.${packageNameNoScope}@${componentVersion}`
    // );
    dependencies[`${packageScope}.${packageNameNoScope}`] = `${componentVersion}`;
  });
  return dependencies;
};
