"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLaneCompsToOverrides = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const get_deps_from_lane_1 = require("./get-deps-from-lane");
const addLaneCompsToOverrides = (LaneDetails, projectDir) => {
    const packageJsonPath = (0, path_1.join)(projectDir, 'package.json');
    const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
    const depsFromLane = (0, get_deps_from_lane_1.getDepsFromLane)(LaneDetails);
    const packageJsonOverrides = packageJson.overrides || {};
    packageJson.overrides = Object.assign(Object.assign({}, packageJsonOverrides), depsFromLane);
    fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
exports.addLaneCompsToOverrides = addLaneCompsToOverrides;
