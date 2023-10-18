import React, {useState} from 'react';
import {Modal, Input, Button, Breadcrumb} from 'antd';
import {addQuery} from "../api/main.ts";
import FlexStart from "../components/FlexStart.tsx";
const QuerySqlModal = ({visible, onCancel, onQuery, source, database}) => {
    const [fileName, setFileName] = useState('');
    const [sql, setSql] = useState('');

    const handleCancel = () => {
        onCancel();
    };

    const handleQuery = async () => {
        const data = await addQuery({
            fileName,
            sql,
            source,
            database
        })
        // 在这里执行查询操作
        // 使用 fileName 和 sql 变量
        onQuery(data);
    };

    return (
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
        >
            <Breadcrumb>
                <Breadcrumb.Item>{source}</Breadcrumb.Item>
                <Breadcrumb.Item>{database}</Breadcrumb.Item>
            </Breadcrumb>
            <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                style={{width:"150px"}}
                bordered={false}
            />
            <div style={{marginTop: '16px'}}>
                <label>SQL:</label>
                <Input.TextArea
                    value={sql}
                    onChange={(e) => setSql(e.target.value)}
                    placeholder="Enter SQL query"
                    autosize={{minRows: 20}}
                    style={{height:"100px"}}
                />
            </div>
        </Modal>
    );
};

export default QuerySqlModal;
