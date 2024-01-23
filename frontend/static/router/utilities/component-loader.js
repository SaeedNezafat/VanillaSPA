import paramsSeparator from "./params-separator.js";
import {pathToRegex} from "./regex.js";
import hashSeparator from "./hash-separator.js";
import RouterModule from "./router-module.js";

function changeRouterLinkToAnchorTag() {
    window.onload = () => {
        const routerLinks = Array.from(document.querySelectorAll('router-link'));
        routerLinks.forEach((routerLink) => {
            const anchorTag = RouterModule.createAnchorTagFromRouterLink(routerLink);
            RouterModule.replaceRouterLinkWithAnchorTag(routerLink, anchorTag);
        });
    };
}

function changeRouterViewToDiv() {
    const routerView = document.querySelectorAll('router-view');
    if (routerView.length) {
        routerView.forEach((existingRouterView) => {
            const newRouterView = RouterModule.createRouterViewElement();
            RouterModule.replaceRouterViewElement(existingRouterView, newRouterView);
        });
    }
}

class ChangeRouteSilent {
    renderComponent(renderData) {
        const routerViewElements = document.getElementsByClassName('router-view');
        routerViewElements[renderData.index].innerHTML = new renderData.foundRoutes[renderData.index].route.component(renderData.params).render();
    }
}

class ShowInMainTag {
    renderComponent(renderData) {
        renderData.mainTag.innerHTML = '';
        renderData?.foundRoutes.forEach((item, index) => {
            const template = (renderData.foundRoutes.length - 1) === index ? new item.route.component(renderData.params) : new item.route.component();
            const renderedTemplate = template.render();
            const routerViewElement = RouterModule.createRouterViewElement();
            routerViewElement.innerHTML = renderedTemplate;

            const routerView = document.querySelector('router-view');
            if (routerView) {
                RouterModule.replaceRouterViewElement(routerView, routerViewElement);
            } else {
                renderData.mainTag.appendChild(routerViewElement);
            }
        });
    }
}

class ShowComponentFactory {
    static createComponent(condition) {
        if (condition) return new ChangeRouteSilent();
        return new ShowInMainTag();
    }
}

function componentLoader(foundRoutes) {
    const currentRoute = foundRoutes[foundRoutes.length - 1];
    const currentPath = window.location.hash ? hashSeparator(window.location.hash, 'historyMode') : window.history.state.from;
    const matchRoute = currentPath.match(pathToRegex(`${currentRoute.route.path}`));
    RouterModule.applyRouteHook(currentRoute.route, window.history.state.from, window.history.state.to, matchRoute);

    const params = paramsSeparator(currentRoute.result, currentRoute.route.path);
    const mainTag = document.getElementById('app');
    const changeRoute = RouterModule.findChangedChild(window.history.state.from, window.history.state.to);
    const routeIndex = changeRoute.equal ? changeRoute.equal - 1 : changeRoute - 1;
    const condition = RouterModule.handleShowRouteCondition(changeRoute, foundRoutes, routeIndex, matchRoute)
    const componentRenderHandler = ShowComponentFactory.createComponent(condition);
    const renderData = {index: routeIndex, foundRoutes, params, mainTag}

    componentRenderHandler.renderComponent(renderData)
    changeRouterViewToDiv();
    changeRouterLinkToAnchorTag();
    document.title = currentRoute.route.title;
}

export default componentLoader;


