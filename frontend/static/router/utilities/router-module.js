import hashSeparator from "./hash-separator.js";

const RouterModule = (function () {
    function findChangedChild(currentRoute, targetRoute) {
        const currentParts = window.location.hash ? hashSeparator(currentRoute, 'historyMode').split('/') : currentRoute.split('/');
        const targetParts = window.location.hash ? hashSeparator(targetRoute, 'historyMode').split('/') : targetRoute.split('/');

        let equal = 0;
        for (let i = 0; i < targetParts.length; i++) {
            if (currentParts[i] !== targetParts[i]) {
                return i;
            }
            if (currentParts[i] === targetParts[i] && !!currentParts[i]) equal += 1;
        }
        return {
            equal: equal,
            isChanged: currentParts.length - 1 === equal
        };
    }

    function createRouterViewElement() {
        const routerViewElement = document.createElement("div");
        routerViewElement.classList = 'router-view';
        return routerViewElement;
    }

    function replaceRouterViewElement(existingRouterView, newRouterView) {
        existingRouterView.parentNode.replaceChild(newRouterView, existingRouterView);
    }

    function createAnchorTagFromRouterLink(routerLink) {
        const anchorTag = document.createElement('a');
        anchorTag.href = routerLink.getAttribute('path');
        anchorTag.textContent = routerLink.textContent;
        return anchorTag;
    }

    function replaceRouterLinkWithAnchorTag(routerLink, anchorTag) {
        routerLink.parentNode.replaceChild(anchorTag, routerLink);
    }

    function applyRouteHook(route, from, to, matchRoute) {
        if (route?.beforeRouteEnter && !matchRoute)
            route?.beforeRouteEnter(from, to)

        if (route?.beforeRouteUpdate && matchRoute && from !== to)
            route?.beforeRouteUpdate(from, to)
    }

    function handleShowRouteCondition (changeRoute, foundRoutes, routeIndex, matchRoute) {
        if (changeRoute.equal) return changeRoute.equal && !changeRoute.isChanged && !(foundRoutes?.[0].route.path === '404') && !!foundRoutes[routeIndex]
        return changeRoute > 1 && !matchRoute && !(foundRoutes?.[0].route.path === '404') && !!foundRoutes[routeIndex]
    }

    return {
        findChangedChild,
        createRouterViewElement,
        replaceRouterViewElement,
        createAnchorTagFromRouterLink,
        replaceRouterLinkWithAnchorTag,
        applyRouteHook,
        handleShowRouteCondition
    };


})();

export default RouterModule;