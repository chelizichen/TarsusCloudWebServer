import { useState } from 'react';
import { Modal, Button, Input } from 'antd';

const FileComponent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    const handleNodeClick = (item) => {
        if (item.type === 'file') {
            setSelectedFile(item.path);
            setFileContent('这是文件的模拟内容'); // 模拟文件内容
            setIsModalVisible(true);
        }
    };

    const handleOk = () => {
        if (isEditing) {
            setIsEditing(false);
            setTimeout(() => {
                alert('修改成功');
            }, 2000);
        } else {
            setIsModalVisible(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <Tree
                showIcon
                defaultExpandAll
                treeData={renderDirectoryTree(directoryData)}
                onSelect={(selectedKeys, info) => handleNodeClick(info.node)}
            />

            <Modal
                title={`文件内容 - ${selectedFile}`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="edit" onClick={handleEdit} disabled={isEditing}>
                        修改
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {isEditing ? '确定' : '关闭'}
                    </Button>,
                ]}
            >
                {isEditing ? (
                    <Input.TextArea value={fileContent} onChange={(e) => setFileContent(e.target.value)} />
                ) : (
                    <p>{fileContent}</p>
                )}
            </Modal>
        </>
    );
};

export default FileComponent