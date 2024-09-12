export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export type PackageManagerInstallCommands = {
  [key in PackageManager]: {
    install: string;
    uninstall: string;
  };
};
