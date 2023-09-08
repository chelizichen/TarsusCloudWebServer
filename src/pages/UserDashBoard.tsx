import React, { useEffect, useState } from 'react';
import { Tree, Row, Col, Table, Button, Modal, Spin, message, Upload, Select, Input } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import CodeBlock from '../components/HighLightCode';

const UserDashboard = () => {
    // 主逻辑
    const [isRestarting, setIsRestarting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [dirs,setDirs] = useState([
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
    ])

    // 文件逻辑
    const [isFileVisible, setFileVisible] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');


    const handleNodeClick = (item, selectedKeys) => {
        console.log('11', item);
        console.log('22', selectedKeys);


        if (item.type === 'file') {
            setSelectedFile(selectedKeys);
            setFileContent(`
import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {RouteHandlerMethod} from "fastify/types/route";
import path from "path";
import fs from "fs";
import {Reply, ReplyBody} from "../../../main_control/define";

const routes = process.env.routes_path;

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                    code: {
                        type: "number"
                    },
                    data: {
                        type: "object"
                    }
                }
            }
        },
        body: {
            userId: {
                type: "string"
            }
        }
    }
}

type CustomRequest = FastifyRequest<{
    Body: { userId: string };
}>

const handleFunc = async (request: CustomRequest, reply: FastifyReply) => {
    const {userId} = request.body

    return Reply(ReplyBody.success, ReplyBody.success_message, {userId})
}
export default [opts, handleFunc]


            `); // 模拟文件内容
            setFileVisible(true);
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



    const columns = [
        {
            title: 'Node',
            dataIndex: 'node',
            key: 'node',
            render: (text, record) => (
                <span>
                    <div onClick={() => handleViewLog(record.node)} style={{ color: "#1890ff" }}>{record.node}</div>
                </span>
            ),
            align:"center",
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align:"center",
        },
        {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
            align:"center",
        },
        {
            title: '操作',
            key: 'action',
            align:"center",
            render: (text, record) => (
                <span>
                    <Button style={{ margin: '0 8px' }} onClick={() => getDirs(record)}>check</Button>
                    <Button type="primary" onClick={() => handleRestart(record.node)} loading={isRestarting}>restart</Button>
                    <Button style={{ margin: '0 8px' }} onClick={() => handleCheckStatus(record.node)}>stats</Button>
                </span>
            ),
        },
    ];

    const getDirs = (record) => {
        // console.log(record);
        
        const new_directory = [  {
            type: 'file',
            name: 'add.ts',
            path: 'add.ts',
        },...dirs]
        setDirs(new_directory)
    }

    useEffect(()=>{
        // 关于目录结构的改变 代表端口的改变，会重新对整个界面进行重新渲染
    },[dirs])


    const userData = [
        { node: '127.0.0.1:3411', status: 'Running', pid: '12345' },
        { node: '127.0.0.1:3412', status: 'Stopped', pid: '67890' },
    ];

    // Recursive directory tree
    const renderDirectoryTree = (data: any) =>
        data.map((item: any) => {
            if (item.type === 'folder') {
                return {
                    title: item.name,
                    key: item.path,
                    type: item.type,
                    icon: <FolderOutlined className="ant-tree-icon-folder" />,
                    children: renderDirectoryTree(item.children || []),
                };
            }

            return {
                title: item.name,
                key: item.path,
                type: item.type,
                icon: <FileOutlined className="ant-tree-icon-file" />,
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

    const handleEdit = () => {
        setIsEditing(true);
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

    const allDirectories = ['/', ...extractDirectories(dirs)];


    return (
        <Row style={{ height: '100vh' }}>
            <Col span={6} style={{ borderRight: '1px solid #e8e8e8', padding: '20px' }}>
                <h3>Directory</h3>
                <Tree
                    showIcon
                    defaultExpandAll
                    treeData={renderDirectoryTree(dirs)}
                    onSelect={(selectedKeys, info) => handleNodeClick(info.node, selectedKeys)}
                />
                <Modal
                    title={`文件内容 - ${selectedFile}`}
                    open={isFileVisible}
                    onOk={handleOk}
                    width={'50%'}
                    onCancel={() => setFileVisible(false)}
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
                        <Input.TextArea value={fileContent} onChange={(e) => setFileContent(e.target.value)} rows={30}/>
                    ) : (
                        <CodeBlock code={fileContent} />
                    )}
                </Modal>

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
