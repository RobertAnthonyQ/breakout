/**
 * The hub is mounted at breakout.lat/opportunities: the landing rewrites that path to this app.
 * Next applies basePath to <Link> and assets automatically, but NOT to fetch() or plain <img>,
 * so those go through withBasePath().
 */
export const BASE_PATH = "/opportunities";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) throw new Error(`withBasePath expects an absolute path, got "${path}"`);
  return `${BASE_PATH}${path}`;
}
