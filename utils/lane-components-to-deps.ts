import type { LaneData } from './fetch-lane-components';

type DependenciesInLane = {
  [key: string]: string;
};

export const laneComponentsToDeps = (
  laneData: LaneData
): DependenciesInLane => {
  const dependencies: DependenciesInLane = {};
  laneData.data.lanes.listComponents.forEach((component) => {
    const [componentIdNoVersion, componentVersion] = component.id.split('@');
    const componentIdParts = componentIdNoVersion.split('/');
    const scope = componentIdParts!.shift()!.replace(/\./g, '/');
    const packageScope = '@'.concat(scope.replace(/\./g, '/'));
    const packageNameNoScope = componentIdParts.join('.');
    dependencies[
      `${packageScope}.${packageNameNoScope}`
    ] = `${componentVersion}`;
  });
  return dependencies;
};
