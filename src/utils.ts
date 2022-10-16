import os from 'os'

/**
 * Resolve placeholders `${HOME}` and `~`.
 */
export function resolveHOMEPlaceHolders(path: string): string {
  return path.replace('${HOME}', os.homedir).replace(/^~/, os.homedir)
}
