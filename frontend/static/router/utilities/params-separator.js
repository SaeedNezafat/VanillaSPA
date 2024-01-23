const paramsSeparator = (matchRouteResult, pathRoute) => {
    const values = matchRouteResult.slice(1);
    const keys = [...pathRoute.matchAll(/:(\w+)/g)].map(([, key]) => key);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]])) || {};
  };
  
export default paramsSeparator;