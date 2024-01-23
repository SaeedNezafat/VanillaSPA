import {handleHistoryMode} from "./history-mode/index.js";
import {handleHTML5Mode} from "./html5-mode/index.js";
import replacePlaceholderInUrl from './utilities/query-separator.js';
import paramsSeparator from "./utilities/params-separator.js";
import foundMatchRoute from './utilities/found-match-route.js';

function createRoute(routes, routerMode, beforeEach) {
    Router.getInstance(routes, routerMode, beforeEach);
}

class RouteHandlerStrategy {
    handleRoute(routes, targetRoute, router, mode) {
        foundMatchRoute(routes, targetRoute, router, mode);
    }
}

class HistoryModeHandler extends RouteHandlerStrategy {
    handleRoute(routes, modifiedRoute, queryString, router) {
        super.handleRoute(routes, `#${modifiedRoute}${queryString}`, router, 'historyMode');
    }
}

class HTML5ModeHandler extends RouteHandlerStrategy {
    handleRoute(routes, modifiedRoute, queryString, router) {
        super.handleRoute(routes, `${modifiedRoute}${queryString}`, router, 'html5Mode');
    }
}

class RouteHandlerFactory {
    createHandler(routerMode) {
        switch (routerMode) {
            case 'historyMode':
                return new HistoryModeHandler();
            case 'html5Mode':
                return new HTML5ModeHandler();
            default:
                throw new Error('Invalid router Mode');
        }
    }
}

class Router {
    constructor(routes, routerMode, beforeEach) {
        if (!Router.instance) {
            this.setupRouter(routerMode, beforeEach, routes);
            this.routeModeHandler(routerMode);
            Router.instance = this;
        }
        return Router.instance;
    }

    static getInstance(routes, routerMode, beforeEach) {
        if (!this.instance) {
            this.instance = new Router(routes, routerMode, beforeEach);
        }
        return this.instance;
    }

    setupRouter (routerMode, beforeEach, routes) {
        this.routeMode = routerMode;
        this.router = {
            beforeEach: beforeEach
        };
        this.localRoutes = routes;

        if (this.routeMode === 'historyMode' && !window.location.hash) {
            window.location.hash = '/';
            window.location.pathname = '/';
        } else if (this.routeMode === 'html5Mode' && window.location.hash) {
            window.location.hash = '';
        }
    }

     routeModeHandler (routerMode) {
        if (routerMode === 'historyMode') handleHistoryMode(this.localRoutes, this.router);
        else if (routerMode === 'html5Mode')  handleHTML5Mode(this.localRoutes, this.router);
    }

    push(path, data) {
        const routerInstance = Router.instance;
        let modifiedRoute = path;
        if (data?.params) modifiedRoute = replacePlaceholderInUrl(path, data.params);
        const queryString = data.query ? `?${new URLSearchParams(data.query).toString()}` : '';
        this.routeHandlerOriginal = new RouteHandlerFactory().createHandler(routerInstance.routeMode);
        this.routeHandlerOriginal.handleRoute(routerInstance.localRoutes, modifiedRoute, queryString, routerInstance.router);
    }

    replace(path, state = null) {
        history.replaceState(state, '', path);
    }

    go(count) {
        history.go(count);
    }

    back(count) {
        history.back(count);
    }

    forward(count) {
        history.forward(count);
    }

    routeData() {
        const routerInstance = Router.instance;
        const state = window.history.state;
        const {result, path, meta} = state?.route ?? {};
        const params = paramsSeparator(result, path);
        const currentRoute = routerInstance.routeMode === 'historyMode' ? window.location.hash.slice(1) : window.location.href;
        const queryString = currentRoute.split('?')?.[1];

        const queryParams = new URLSearchParams(queryString);

        return {
            from: state?.from,
            to: state?.to,
            params,
            query: Object.fromEntries(queryParams),
            meta: meta
        };
    }
}

export function useRouter() {
    const routerInstance = Router.getInstance();

    return {
        push: routerInstance.push,
        replace: routerInstance.replace,
        go: routerInstance.go,
        back: routerInstance.back,
        forward: routerInstance.forward
    };
}

export function useRoute() {
    const routerInstance = Router.getInstance();
    return {
        routeData: routerInstance.routeData
    };
}

export default createRoute;