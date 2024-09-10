export function isValidPOSIXPath(path: string): boolean {
  const posixPathPattern = /^(\/|\.\/|\.\.\/)?([^\/\0]+(\/)?)+$/;
  return posixPathPattern.test(path);
}
