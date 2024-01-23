function pushStateRoute(from, to, match = null) {
    const state = {
        from,
        to,
        route: {
            result: match.result,
            path: match.route.path,
            meta: match.route?.meta
        }
    };
    window.history.pushState(state, "", to);
}

export default pushStateRoute;