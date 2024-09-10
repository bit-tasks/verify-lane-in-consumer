import type { LaneDetails } from '../types/lane-details';

export const getDepsFromLane = (
  laneDetails: LaneDetails
): Record<string, string> => {
  const dependenciesFromLane: Record<string, string> = {};
  laneDetails.components.forEach((component) => {
    const [componentIdNoVersion, componentVersion] = component.id.split('@');
    const [scope, componentName] = componentIdNoVersion.split('/');
    const packageNameNoScope = componentName.replace(/\//g, '.');
    const packageScope = scope.replace(/\./g, '/');
    dependenciesFromLane[`${packageScope}/${packageNameNoScope}`] =
      componentVersion;
  });
  return dependenciesFromLane;
};
