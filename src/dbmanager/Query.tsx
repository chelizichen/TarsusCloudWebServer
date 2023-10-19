import React, {useState} from 'react';
import {Modal, Input, Button, Breadcrumb, message, Table} from 'antd';
import {addQuery} from "../api/main.ts";
import FlexStart from "../components/FlexStart.tsx";
import Editor from "../components/Editor.tsx";
import lodash from "lodash";

const QuerySqlModal = ({visible, onCancel, source, database}) => {
    const [fileName, setFileName] = useState('');
    const [editorVal, setEditorVal] = useState("")

    const handleCancel = () => {
        onCancel();
    };

    const [columns, SetColumns] = useState([]);

    const handleQuery = async () => {
        const data = await addQuery({
            fileName,
            sql: editorVal,
            source,
            database
        })
        if (data.code) {
            message.error(data.message)
            return;
        }

        SetResultOpen(true)
        const head = lodash.head(data.data)
        const keys = lodash.keys(head)
        const columns = keys.map((item: string) => {
            return {
                title: item.charAt(0).toUpperCase()
                    + item.slice(1),  // 首字母大写
                dataIndex: item,
                key: item,
            }
        })
        SetColumns(columns)
        SetResult(data.data)
        // 在这里执行查询操作
        // 使用 fileName 和 sql 变量
    };

    const [resultOpen, SetResultOpen] = useState(false)
    const [result, SetResult] = useState([])

    return (
        <>
            <Modal
                title="Query SQL"
                open={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="query" type="primary" onClick={handleQuery}>
                        Query
                    </Button>,
                ]}
                style={{right: '25%'}}
            >
                <Breadcrumb>
                    <Breadcrumb.Item>{source}</Breadcrumb.Item>
                    <Breadcrumb.Item>{database}</Breadcrumb.Item>
                </Breadcrumb>
                <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                    style={{width: "150px"}}
                    bordered={false}
                />
                <div style={{marginTop: '16px'}}>
                    <Editor language="mysql" value={editorVal}
                            onChange={(newValue) => setEditorVal(newValue)}></Editor>
                </div>
            </Modal>
            <Modal
                style={{right: '-15%'}}
                width={'60%'}
                title="Results"
                open={resultOpen}
                onOk={() => SetResultOpen(false)}
                onCancel={() => SetResultOpen(false)}
            >
                <Table dataSource={result} columns={columns}></Table>
            </Modal>
        </>

    );
};

export default QuerySqlModal;
