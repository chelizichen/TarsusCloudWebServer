const ExtractFilePaths = (data) => {
    let result = [];

    const traverse = (node) => {
        if (node.type === 'file') {
            result.push(node.path);
        } else if (node.children && node.children.length > 0) {
            node.children.forEach(traverse);
        }
    };

    data.forEach(traverse);

    return result;
};

export default ExtractFilePaths;