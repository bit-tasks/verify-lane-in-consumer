"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepsFromLane = void 0;
const getDepsFromLane = (laneDetails) => {
    const dependenciesFromLane = {};
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
exports.getDepsFromLane = getDepsFromLane;
