import foundMatchRoute from "../utilities/found-match-route.js";

export function handleHashMode(routes, router) {

    document.addEventListener("click", (event) => {
        event.preventDefault();
        if (event.target.localName === 'a') {
            navigateTo(event.target.pathname);
        }
    });

    function navigateTo(path) {
        foundMatchRoute(routes, `#${path}`, router, 'hashMode')
    }

    foundMatchRoute(routes, window.location.hash, router, 'hashMode')
}
