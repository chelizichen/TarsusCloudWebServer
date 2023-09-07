import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 这是一个样式，你可以选择其他的

const CodeBlock = ({ code }:any) => {
    useEffect(() => {
        hljs.highlightAll();
    }, [code]);

    return (
        <pre>
            <code className="javascript">
                {code}
            </code>
        </pre>
    );
};

export default CodeBlock;
