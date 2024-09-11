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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("@actions/exec");
const core = __importStar(require("@actions/core"));
const add_lane_comps_to_overrides_1 = require("../utils/add-lane-comps-to-overrides");
const installCommand = {
    npm: 'npm install',
    yarn: 'yarn add',
    pnpm: 'pnpm install',
};
const run = (wsDir, packageManager, skipPush, skipCI, laneName, branchName, gitUserName, gitUserEmail, projectDir, args) => __awaiter(void 0, void 0, void 0, function* () {
    // const WS_NAME = 'bit-ws';
    // const WS_DIR = join(runnerTemp, WS_NAME);
    // // create a temporary workspace
    // await exec('bit', ['init', WS_NAME, ...args], { cwd: runnerTemp });
    // retrieve the list of components in a lane
    let compsInLaneJson = '';
    let compsInLaneObj = {};
    const laneShowOptions = {
        cwd: wsDir,
        listeners: {
            stdout: (data) => {
                compsInLaneJson = data.toString();
                compsInLaneObj = JSON.parse(compsInLaneJson);
            },
        },
    };
    yield (0, exec_1.exec)('bit', ['lane', 'show', `"${laneName}"`, '--remote', '--json'], laneShowOptions);
    // remove temporary workspace
    // await exec('rm', ['-rf', WS_DIR]);
    // add lane components as overrides in the project's package.json
    (0, add_lane_comps_to_overrides_1.addLaneCompsToOverrides)(compsInLaneObj, projectDir);
    yield (0, exec_1.exec)(`${installCommand[packageManager]}`, [], { cwd: projectDir });
    // Git operations
    yield (0, exec_1.exec)(`git config --global user.name "${gitUserName}"`, [], {
        cwd: projectDir,
    });
    yield (0, exec_1.exec)(`git config --global user.email "${gitUserEmail}"`, [], {
        cwd: projectDir,
    });
    yield (0, exec_1.exec)(`git checkout -b ${branchName}`, [], {
        cwd: projectDir,
    });
    yield (0, exec_1.exec)('git add .', [], { cwd: projectDir });
    try {
        yield (0, exec_1.exec)(`git commit -m "Commiting the latest updates from lane: ${laneName} to the Git branch (automated)${skipCI ? ` [skip-ci]` : ''}"`, [], { cwd: projectDir });
    }
    catch (error) {
        core.error(`Error while committing changes!`);
    }
    if (!skipPush) {
        yield (0, exec_1.exec)(`git push origin "${branchName}" -f`, [], { cwd: projectDir });
    }
    else {
        core.warning('WARNING - Skipped pushing to GitHub');
    }
});
exports.default = run;
