function join(...args) {
    return args
        .filter(arg => typeof arg === 'string' && arg.length > 0)
        .join('/')
        .replace(/\/+/g, '/');
}

export default join;
