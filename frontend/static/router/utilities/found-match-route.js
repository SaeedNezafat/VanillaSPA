import componentLoader from "./component-loader.js";
import configureRoutes, {handleTargetRoutes} from "./configure-subroutes.js";
import pushStateRoute from "./push-state.js";
import {pathToRegex} from "./regex.js";
import hashSeparator from "./hash-separator.js";

function handleRedirect(routes, route, currentRoute, routerMode, router) {
    if (route.route.redirect && currentRoute !== route.route.redirect) {
        const redirectRoute = routeModules.handleChangePath(routerMode, route.route.redirect);
        foundMatchRoute(routes, redirectRoute, router, routerMode);
        return true;
    }
    return false;
}

function handleRouterBeforeEach(routes, router, routerMode, targetRoutes) {
    const state = window.history.state;

    router.beforeEach(hashSeparator(state?.from, routerMode), hashSeparator(state?.to, routerMode), next);

    function next(route) {
        if (route) {
            const path = routeModules.handleChangePath(routerMode, route);
            foundMatchRoute(routes, path, router, routerMode);
        } else {
            componentLoader(targetRoutes);
        }
    }
}

const routeModules = (function () {
    function handleChangePath(routerMode, path) {
        return routerMode === 'historyMode' ? `#${path}` : path;
    }

    function getCurrentRoute(routerMode) {
        return routerMode === 'historyMode' ? window.location.hash : `${window.location.pathname + window.location.search}`;
    }

    function handleBeforeRouteLeave(route, matchRoute) {
        if (route.route?.beforeRouteLeave && !matchRoute) {
            route.route.beforeRouteLeave(window.history.state.from, window.history.state.to);
        }
    }

    return {
        handleChangePath,
        getCurrentRoute,
        handleBeforeRouteLeave
    }
})()

export function foundMatchRoute(routes, routeTo, router, routerMode) {
    let currentRoute = routeModules.getCurrentRoute(routerMode);
    let configRoutes = configureRoutes(routerMode);
    const childrenRoutes = configRoutes.setChildren(routes);
    let handleSetTargetRoute = handleTargetRoutes();
    const targetRoutes = [...handleSetTargetRoute.setTargetRoutes(configRoutes, routeTo)];

    handleSetTargetRoute = null;
    configRoutes = null;

    let match = targetRoutes[targetRoutes.length - 1];

    if (currentRoute !== routeTo) {
        let routesBuilder = configureRoutes(routerMode);
        routesBuilder.setChildren(routes);
        const foundRoute = routesBuilder.foundRoute(hashSeparator(currentRoute), routerMode, childrenRoutes);
        routesBuilder = null;

        if (foundRoute?.route) {
            const matchRoute = routerMode === 'historyMode' ?
                hashSeparator(routeTo, 'historyMode').match(pathToRegex(`${foundRoute.route.path}`))
                : routeTo.match(pathToRegex(`${foundRoute.route.path}`));
            routeModules.handleBeforeRouteLeave(foundRoute, matchRoute);
        }
    }

    pushStateRoute(currentRoute, routeTo, match);
    currentRoute = routeModules.getCurrentRoute(routerMode);

    if (handleRedirect(routes, match, currentRoute, routerMode, router)) {
        return;
    }

    handleRouterBeforeEach(routes, router, routerMode, targetRoutes);
}

export default foundMatchRoute;
