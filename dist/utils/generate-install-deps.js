"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInstallCommand = void 0;
const installCommandPrefix = {
    npm: 'npm install',
    yarn: 'yarn add',
    pnpm: 'pnpm install',
};
function generateInstallCommand(dependencies, packageManager) {
    const depArray = Object.entries(dependencies).map(([name, version]) => `${name}@${version}`);
    return `${installCommandPrefix[packageManager || 'npm']} ${depArray.join(' ')}`;
}
exports.generateInstallCommand = generateInstallCommand;
