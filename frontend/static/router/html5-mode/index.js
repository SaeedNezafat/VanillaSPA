import foundMatchRoute from "../utilities/found-match-route.js";

export function handleHTML5Mode(routes, router) {
    document.addEventListener("click", (event) => {
        event.preventDefault();
        if (event.target.localName === 'a') {
            urlRoutes(event.target.pathname);
        }
    });

    function urlRoutes(path) {
        foundMatchRoute(routes,path, router, 'html5Mode');
    }

    window.onpopstate = foundMatchRoute(routes, `${window.location.pathname + window.location.search}`, router, 'html5Mode');
}