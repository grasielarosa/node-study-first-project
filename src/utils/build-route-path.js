export function buildRoutePath(path) {
  const routeParamsRegex = /:([a-zA-Z]+)/g;
  const paramsWithparams = path.replaceAll(
    routeParamsRegex,
    "(?<$1>[a-z0-9-_]+)"
  );
  const pathRegex = new RegExp(`^${paramsWithparams}(?<query>\\?(.*))?$`);
  return pathRegex;
}
