export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export type PackageManagerCommands = {
  [key in PackageManager]: {
    install: string;
    uninstall: string;
  };
};

export const packageManagerCommands: PackageManagerCommands = {
  npm: {
    install: 'npm install',
    uninstall: 'npm uninstall',
  },
  yarn: {
    install: 'yarn install',
    uninstall: 'yarn remove',
  },
  pnpm: {
    install: 'pnpm install',
    uninstall: 'pnpm remove',
  },
};
