function hashSeparator(path, routerMode) {
    return routerMode === 'hashMode' ? path.split('#')[1] : path;
}

export default hashSeparator;