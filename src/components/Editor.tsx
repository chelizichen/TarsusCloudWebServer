import React, {useRef, useEffect} from 'react';
import * as monaco from 'monaco-editor';

interface Props {
    language: string;
    value: string;
    onChange?: (value: string) => void;
}

const MonacoEditor: React.FC<Props> = ({language, value, onChange}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    // 创建和销毁编辑器
    useEffect(() => {
        if (containerRef.current) {
            editorRef.current = monaco.editor.create(containerRef.current, {
                value,
                language,
                theme: 'vs-light',
            });

            return () => editorRef.current?.dispose();
        }
    }, [language]);

    // 监听编辑器内容的变化
    useEffect(() => {
        if (editorRef.current && onChange) {
            const disposable = editorRef.current!.onDidChangeModelContent(() => {
                onChange(editorRef.current!.getValue());
            });

            return () => disposable.dispose();
        }
    }, [onChange]);

    // 更新编辑器的值


    return (
        <div>
            <div ref={containerRef} style={{height: '700px', width: '100%'}}></div>
        </div>
    )
}

export default MonacoEditor;
