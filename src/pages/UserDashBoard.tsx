import React, {useEffect, useRef, useState} from 'react';
import {Tree, Row, Col, Table, Button, Modal, Spin, message, Upload, Select, Input, InputRef} from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import CodeBlock from '../components/HighLightCode';
import { getUserContent } from "../api/user.ts";
import join from "../utils/join.ts";
import {Reload, UserDirs, Touch as UpLoadFile, UploadCode} from "../api/main.ts";
import RequestComponent from "../components/RequestComponent.tsx";
import useStore from "../store";
import { useNavigate } from 'react-router-dom';
import Logger from "../components/APIPerformance.tsx";
import Editor from "../components/Editor.tsx";

const UserDashboard = ({ userInfo }: any) => {
    const navigate = useNavigate();
    // 主逻辑
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [dirs, setDirs] = useState([])
    const [userTargetDir, setUserTargetDir] = useState("")
    const [userDirs, setUserDirs] = useState([])
    const [index, setIndex] = useState(0);

    const setPort = useStore((state) => state.setInvokePort);
    const port = useStore((state) => state.invokePort);
    const setCurrDir = useStore((state) => state.setCurrDir);
    useEffect(() => {
        UserDirs(userInfo.id).then(res => {
            setUserDirs((res.data))
        })
    }, [])

    useEffect(() => {
        // 设置左侧文件栏目
        if (!userDirs.length) {
            return
        }
        getUserContent(userDirs[index].dir).then(res => {
            const dir = userDirs[index].dir
            setUserTargetDir(dir);
            setPort(userDirs[index].port)
            setCurrDir(dir)
            const dirArray = [{
                "type": "folder",
                "name": dir || "admin",
                "path": dir,
                "children": res.data.dirs
            },]
            setDirs(dirArray)
        })
    }, [userDirs, index])


    // 文件逻辑
    const [isFileVisible, setFileVisible] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');


    const handleNodeClick = (item) => {
        if (item.type === 'file') {
            const targetPath = join(userTargetDir, item.key)
            getUserContent(targetPath).then(res => {
                setSelectedFile(item.key);
                setFileContent(res.data.content); // 模拟文件内容
                setFileVisible(true);
            })
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

    const handleDirCheck = (index, record) => {
        setIndex(index)
        setPort(record.port)
        setCurrDir(record.dir)
    }

    const [restartingPorts, setRestartingPorts] = useState({});

    const showDatabase = () =>{
        navigate("/database")
    }

    const columns = [
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            render: (text, record) => (
                <span>
                    <div onClick={() => handleViewLog(record.port)}
                        style={{ color: "#1890ff", cursor: "pointer" }}>{record.port}</div>
                </span>
            ),
        },
        {
            title: 'Dir',
            dataIndex: 'dir',
            key: 'dir',
            render: (text, record, index) => (
                <span>
                    <div onClick={() => handleDirCheck(index, record)}
                        style={{ color: "#1890ff", cursor: "pointer" }}>{record.dir}</div>
                </span>
            ),
        },
        {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
            align: "center",
        },
        {
            title: 'DataBase',
            dataIndex: 'database',
            key: 'database',
            render: (text, record, index) => (
                <span>
                    <div onClick={() => showDatabase(index, record)}  style={{ color: "#1890ff", cursor: "pointer" }}>database
                    </div>
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => handleRestart(record)}
                        loading={restartingPorts[record.port]}>restart</Button>
                    <Button style={{ margin: '0 8px' }} onClick={() => handleCheckStatus(record.node)}>stats</Button>
                </span>
            ),
        },
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


    const handleRestart = async (record) => {
        setRestartingPorts(prev => ({ ...prev, [record.port]: true }));
        const data = await Reload(record.port);
        console.log(data);

        setTimeout(() => {
            setRestartingPorts(prev => ({ ...prev, [record.port]: false }));
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
        navigate("/logger")
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

    const allDirectories = [...extractDirectories(dirs)];

    const handleUpload = () => {
        if (fileList.length > 0) {
            customUpload({ file: fileList[0].originFileObj, onSuccess: onUploadSuccess, onError: onUploadError });
        }
    };

    const onUploadSuccess = (response) => {
        message.success("上传成功！" + response.data.write_file_path)
    };

    const onUploadError = (error) => {
        message.error("上传失败！" + error)
        // Handle error logic here
    };


    const customUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file); // 'file' 是服务器期望的字段名

        try {
            const response = await UpLoadFile(formData,selectedDirectory);
            onSuccess(response);
        } catch (error) {
            onError(error);
        }
    };

    const [isWriteFileOpen,setWriteOpen] = useState(false)
    const fileNameRef = useRef<InputRef>();
    const uploadCode = ()=>{
        UploadCode()
    }

    return (
        <Row style={{ height: '100vh' }}>
            <Col span={6} style={{ borderRight: '1px solid #e8e8e8', padding: '20px' }}>
                <h3>Directory</h3>
                <Tree
                    showIcon
                    defaultExpandAll
                    treeData={renderDirectoryTree(dirs)}
                    onSelect={(selectedKeys, info) => handleNodeClick(info.node, selectedKeys)}
                ></Tree>
                <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
                    Upload File
                </Button>
                <br/>
                <Button type={"primary"} onClick={()=>setWriteOpen(true)} style={{ marginTop: '20px' }}>
                    WriteFile File
                </Button>
                <RequestComponent functions={dirs} />
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
                        <Input.TextArea value={fileContent} onChange={(e) => setFileContent(e.target.value)} rows={30} />
                    ) : (
                        <CodeBlock code={fileContent} />
                    )}
                </Modal>
                <Modal title="Write File" open={isWriteFileOpen} onCancel={()=>setWriteOpen(false)} footer={null} width={900}>
                    <div id={'container'}>
                        <div style={{display:"flex"}}>
                            <Select
                                placeholder="Select a directory"
                                onChange={handleDirectoryChange}
                                style={{ width: '100%', marginBottom: '20px' }}
                            >
                                {allDirectories.map(dir => (
                                    <Select.Option key={dir} value={dir}>{dir}</Select.Option>
                                ))}
                            </Select>
                            <Input ref={fileNameRef} style={{height:"32px"}}></Input>
                        </div>
                        <Editor language="typescript" value="console.log('Hello, world!');"></Editor>
                        <Button onClick={uploadCode} type={"primary"}>upload code</Button>
                    </div>
                </Modal>
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
                        beforeUpload={() => false} // Prevent automatic upload
                    // ... other Upload props
                    >
                        <Button disabled={!selectedDirectory}>Select File</Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={!selectedDirectory || !fileList.length}
                    >
                        Upload
                    </Button>

                </Modal>
            </Col>
            <Col span={18} style={{ padding: '20px' }}>
                <Table columns={columns} dataSource={userDirs} rowKey="port" bordered />
                <Logger port={port}></Logger>
                <ReactECharts option={getOption1()} style={{ height: '300px', marginBottom: '20px' }} />
                <ReactECharts option={getOption2()} style={{ height: '300px' }} />
            </Col>
        </Row>
    );
};

export default UserDashboard;
