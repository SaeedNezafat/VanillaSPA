function hashSeparator(path, routerMode) {
    return routerMode === 'historyMode' ? path.split('#')[1] : path;
}

export default hashSeparator;