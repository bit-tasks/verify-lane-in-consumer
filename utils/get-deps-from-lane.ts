import type { LaneDetails } from '../types/lane-details';

type Overrides = Record<string, string>;
type DependenciesToInstall = string;

export const getDepsFromLane = (
  laneDetails: LaneDetails
): [Overrides, DependenciesToInstall] => {
  const overrides: Record<string, string> = {};
  const listOfDepsToInstall: string[] = [];
  laneDetails.components.forEach((component) => {
    const [componentIdNoVersion, componentVersion] = component.id.split('@');
    const componentIdParts = componentIdNoVersion.split('/');
    const scope = componentIdParts!.shift()!.replace(/\./g, '/');
    const packageScope = '@'.concat(scope.replace(/\./g, '/'));
    const packageNameNoScope = componentIdParts.join('.');
    listOfDepsToInstall.push(
      `${packageScope}.${packageNameNoScope}@${componentVersion}`
    );
    overrides[`${packageScope}.${packageNameNoScope}`] = `^${componentVersion}`;
  });
  return [overrides, listOfDepsToInstall.join(' ')];
};
