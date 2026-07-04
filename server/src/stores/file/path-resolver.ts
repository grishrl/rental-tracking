import path from 'path';

const DEFAULT_STORE_ROOT = path.resolve(__dirname, '../../../../store');

export const resolveStoreRoot = (overrideRootPath?: string): string => {
  return overrideRootPath ? path.resolve(overrideRootPath) : DEFAULT_STORE_ROOT;
};

export const resolveStoreFile = (
  modelFolder: string,
  fileName: string,
  overrideRootPath?: string
): string => {
  return path.join(resolveStoreRoot(overrideRootPath), modelFolder, fileName);
};
