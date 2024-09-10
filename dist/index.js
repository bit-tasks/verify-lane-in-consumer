"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const install_components_from_lane_1 = __importDefault(require("./scripts/install-components-from-lane"));
const validate_posix_path_1 = require("./utils/validate-posix-path");
try {
    const projectDir = core.getInput('project-dir') || process.env.PROJECT_DIR || './';
    const args = process.env.LOG ? [`--log=${process.env.LOG}`] : [];
    const packageManager = core.getInput('package-manager') || 'npm';
    const laneName = core.getInput('lane-name');
    const branchName = core.getInput('branch-name') || laneName;
    const skipPush = core.getInput('skip-push') === 'true' ? true : false;
    const skipCI = core.getInput('skip-ci') === 'false' ? false : true;
    if (!(0, validate_posix_path_1.isValidPOSIXPath)(projectDir)) {
        throw new Error('Invalid project directory path');
    }
    if (!laneName) {
        throw new Error('Lane name is not found');
    }
    if (laneName === 'main') {
        throw new Error('Specify a lane other than "main"!');
    }
    const gitUserName = process.env.GIT_USER_NAME;
    if (!gitUserName) {
        throw new Error('Git user name not found');
    }
    const gitUserEmail = process.env.GIT_USER_EMAIL;
    if (!gitUserEmail) {
        throw new Error('Git user email token not found');
    }
    const runnerTemp = process.env.RUNNER_TEMP;
    if (!runnerTemp) {
        throw new Error('Runner temp directory not found');
    }
    (0, install_components_from_lane_1.default)(runnerTemp, packageManager, skipPush, skipCI, laneName, branchName, gitUserName, gitUserEmail, projectDir, args);
}
catch (error) {
    core.setFailed(error.message);
}
