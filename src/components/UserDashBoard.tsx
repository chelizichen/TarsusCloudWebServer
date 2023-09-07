import React, { useState } from 'react';
import { Tree, Row, Col, Table, Button, Modal, Spin, message, Upload, Select } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const UserDashboard = () => {
    const [isRestarting, setIsRestarting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const [fileList, setFileList] = useState([]);

    const columns = [
        {
            title: 'Node',
            dataIndex: 'node',
            key: 'node',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => handleRestart(record.node)} loading={isRestarting}>重启</Button>
                    <Button style={{ margin: '0 8px' }} onClick={() => handleCheckStatus(record.node)}>查看状态</Button>
                    <Button onClick={() => handleViewLog(record.node)}>日志</Button>
                </span>
            ),
        },
    ];

    const directoryData = [
        {
            type: 'file',
            name: 'ping.ts',
            path: 'ping.ts',
        },
        {
            type: 'file',
            name: 'pong.ts',
            path: 'pong.ts',
        },
        {
            type: 'folder',
            name: 'test',
            path: 'test',
            children: [
                {
                    type: 'file',
                    name: 'test.ts',
                    path: 'test/test.ts',
                },
            ],
        },
    ];

    const userData = [
        { node: 'Node1', status: 'Running', pid: '12345' },
        { node: 'Node2', status: 'Stopped', pid: '67890' },
    ];

    // Recursive directory tree
    const renderDirectoryTree = (data: any) =>
        data.map((item: any) => {
            if (item.type === 'folder') {
                return {
                    title: item.name,
                    key: item.path,
                    icon: <FolderOutlined />,
                    children: renderDirectoryTree(item.children || []),
                };
            }

            return {
                title: item.name,
                key: item.path,
                icon: <FileOutlined />,
            };
        });

    const getOption1 = () => {
        return {
            title: {
                text: 'Function Run Count (Last 30 days)'
            },
            xAxis: {
                type: 'category',
                data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] // Sample data
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130], // Sample data
                type: 'bar'
            }]
        };
    };

    const getOption2 = () => {
        return {
            title: {
                text: 'Response Time (Last 30 days)'
            },
            xAxis: {
                type: 'category',
                data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] // Sample data
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [20, 50, 30, 40, 60, 50, 80], // Sample data
                type: 'line'
            }]
        };
    };

    const handleRestart = (node) => {
        setIsRestarting(true);

        // 模拟2秒的重启时间
        setTimeout(() => {
            setIsRestarting(false);
            // await restartNode(record.node);
            message.success('重启成功');

            // 刷新PID值的逻辑（这取决于你如何存储和更新数据）
            // ...

        }, 2000);
    };

    const handleCheckStatus = (node) => {
        console.log('Checking status for node:', node);
        // ... your check status logic here ...
    };

    const handleViewLog = (node) => {
        console.log('Viewing logs for node:', node);
        // ... your view log logic here ...
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedDirectory(null);
        setFileList([]);
    };

    const handleDirectoryChange = (value) => {
        setSelectedDirectory(value);
    };

    const extractDirectories = (data, parentPath = '') => {
        let dirs = [];
        data.forEach(item => {
          const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
          if (item.type === 'folder') {
            dirs.push(currentPath);
            if (item.children) {
              dirs = dirs.concat(extractDirectories(item.children, currentPath));
            }
          }
        });
        return dirs;
    };

    const allDirectories = ['/', ...extractDirectories(directoryData)];


    return (
        <Row style={{ height: '100vh' }}>
            <Col span={6} style={{ borderRight: '1px solid #e8e8e8', padding: '20px' }}>
                <h3>Directory</h3>
                <Tree
                    showIcon
                    defaultExpandAll
                    treeData={renderDirectoryTree(directoryData)}
                />
                <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
                    Upload File
                </Button>
                <Modal title="Upload File" open={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Select
                        placeholder="Select a directory"
                        onChange={handleDirectoryChange}
                        style={{ width: '100%', marginBottom: '20px' }}
                    >
                        {allDirectories.map(dir => (
                            <Select.Option key={dir} value={dir}>{dir}</Select.Option>
                        ))}
                    </Select>
                    <Upload
                        disabled={!selectedDirectory}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                    // ... other Upload props, like action, headers, etc.
                    >
                        <Button disabled={!selectedDirectory}>Select File</Button>
                    </Upload>
                </Modal>
            </Col>
            <Col span={18} style={{ padding: '20px' }}>
                <Table columns={columns} dataSource={userData} rowKey="node" />
                <ReactECharts option={getOption1()} style={{ height: '300px', marginBottom: '20px' }} />
                <ReactECharts option={getOption2()} style={{ height: '300px' }} />
            </Col>
        </Row>
    );
};

export default UserDashboard;
