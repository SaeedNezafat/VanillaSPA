import {pathToRegex} from "./regex.js";
import hashSeparator from "./hash-separator.js";

function configureRoutes(mode) {
    let childrenRoutes = [];
    const routerMode = mode;

    function setChildren(routes, parentPath) {
        const dataRoutes = routes.map(route => {
            if (route.children) {
                setChildren(route.children, `${parentPath ?? ''}${route.path}`);
            }
            return {
                route: route,
                parentPath,
            };
        });

        childrenRoutes = [
            ...childrenRoutes,
            ...dataRoutes
        ];
        return childrenRoutes;
    }

    function foundRoute(routeTarget) {
        const targetRoute = routerMode === 'hashMode' && routeTarget.includes('#') ? hashSeparator(routeTarget, 'hashMode') : routeTarget;
        const foundedRoute = childrenRoutes.find(route => targetRoute.match(pathToRegex(`${route.parentPath ?? ''}${route.route.path}`)) !== null);
        if (foundedRoute)foundedRoute.result = targetRoute.match(pathToRegex(`${foundedRoute.parentPath ?? ''}${foundedRoute.route.path}`));
        return foundedRoute;
    }

    return {
        setChildren,
        foundRoute
    }
}

export function handleTargetRoutes() {
    let targetRoutes = [];
    function setTargetRoutes(configureRoutesMethod, routeTo) {
        const foundedRoute = configureRoutesMethod.foundRoute(routeTo);
        if (foundedRoute) {
            targetRoutes.unshift(configureRoutesMethod.foundRoute(routeTo));
            if (foundedRoute.parentPath) {
                setTargetRoutes(configureRoutesMethod, foundedRoute.parentPath, targetRoutes);
            }
        } else {
            const notFoundedRoute = configureRoutesMethod.foundRoute('404');
            targetRoutes.unshift(notFoundedRoute);
        }
        return targetRoutes;
    }

    return {
        setTargetRoutes
    }
}

export default configureRoutes;