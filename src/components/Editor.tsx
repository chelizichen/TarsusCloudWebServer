// MonacoEditor.tsx
import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface Props {
    language: string;
    value: string;
}

const MonacoEditor: React.FC<Props> = ({ language, value }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const editor = monaco.editor.create(containerRef.current, {
                value,
                language,
                theme: 'vs-light', // 你可以选择其他的主题
            });

            return () => editor.dispose();
        }
    }, [language, value]);

    return <div ref={containerRef} style={{ height: '700px', width: '100%' }}></div>;
}

export default MonacoEditor;
