import type { LaneDetails } from '../types/lane-details';

export const getDepsFromLane = (
  laneDetails: LaneDetails
): Record<string, string> => {
  const dependenciesFromLane: Record<string, string> = {};
  laneDetails.components.forEach((component) => {
    const [componentIdNoVersion, componentVersion] = component.id.split('@');
    const componentIdParts = componentIdNoVersion.split('/');
    const scope = componentIdParts!.shift()!.replace(/\./g, '/');
    const packageScope = '@'.concat(scope.replace(/\./g, '/'));
    const packageNameNoScope = componentIdParts.join('.');
    dependenciesFromLane[`${packageScope}.${packageNameNoScope}`] =
      componentVersion;
  });
  return dependenciesFromLane;
};
