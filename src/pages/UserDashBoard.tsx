import React, {useEffect, useRef, useState} from 'react';
import {Tree, Row, Col, Table, Button, Modal, Spin, message, Upload, Select, Input, InputRef, Form} from 'antd';
import {FolderOutlined, FileOutlined, ReloadOutlined, PlusOutlined} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import {getUserContent} from "../api/user.ts";
import join from "../utils/join.ts";
import {
    Reload,
    UserDirs,
    Touch as UpLoadFile,
    UploadCode,
    UpdateCode,
    getApiCallsCharts,
    ShutDown, getStats, MakeDir, ReleasePkg, getTaroFile, DeleteProject
} from "../api/main.ts";
import RequestComponent from "../components/RequestComponent.tsx";
import useStore from "../store";
import {useNavigate} from 'react-router-dom';
import Logger from "../components/APIPerformance.tsx";
import {baseApiContent} from "../components/BaseApiContent.ts";
import CreateProjectComponent from "../components/ProjectInfo.tsx";
import ReleasePackageModal from "../components/ReleasePackage.tsx";
import SelectFileComponent from '../components/SelectFileComponent.tsx';
import WriteFileComponent from '../components/WriteFileComponent.tsx';
import UploadFileComponent from '../components/UploadFileComponent.tsx';
import AddDirComponent from '../components/AddDirComponent.tsx';
import TaroFileComponent from "../components/TaroFileComponent.tsx";

const UserDashboard = ({userInfo}: any) => {
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

    const loadDirs = () => {
        UserDirs(userInfo.id).then(res => {
            setUserDirs((res.data))
        })
    }

    const [apiCharts, setApiCharts] = useState({})
    useEffect(() => {
        loadDirs()
        getApiCallsCharts(port).then(opt => {
            setApiCharts(opt)
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
    }, [userDirs, index, apiCharts])


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
        }else {
            if(userTargetDir == item.key){
                item.name = join(userTargetDir)
            }else {
                item.name = join(userTargetDir,item.key)
            }
            setCurrentFolder(item);
            setIsAddFolderVisable(true);
        }
    };

    const handleOk = async () => {
        if (isEditing) {
            const data = {
                dir: userTargetDir,
                code: fileContent,
                fileName: selectedFile
            }
            const ret = await UpdateCode(data)
            if (!ret.code) {
                setIsEditing(false);
                message.success("修改代码成功")
            }
        } else {
            setIsModalVisible(false);
            setIsEditing(false);
            setFileVisible(false)
        }
    };

    const handleDirCheck = (index, record) => {
        setIndex(index)
        setPort(record.port)
        setCurrDir(record.dir)
    }

    const [restartingPorts, setRestartingPorts] = useState({});

    const showDatabase = () => {
        navigate("/tarsuscloud/database")
    }

    const handleShutDown = async (port) => {
        Modal.confirm({  
            title: '关停确认',  
            content: '确定要关停这个服务吗？',  
            okText: '确定',  
            cancelText: '取消',  
            onOk:async () => {  
              // 执行关停操作  
              const data = await ShutDown(port)
              if (!data.code) {
                message.success(`服务 ${port} 已成功关停`);  
              }
            },  
            onCancel: () => {  
              message.error('关停操作已取消');  
            },  
          });  
    }

    const [taroFileVisible,setTaroFileVisible] = useState(false)
    const [taroEditorVal, setTaroEditorVal] = useState("")
    const [taroDir,setTaroDir] = useState("")
    const handleGetTaroFile = async (dir:string)=>{
        setTaroDir(dir)
        const data = await getTaroFile({dir})
        setTaroEditorVal(data.data)
        setTaroFileVisible(true)
    }

    const handleDeleteProject = async (id,dir)=>{
        Modal.confirm({  
            title: '删除确认',  
            content: '确定要删除这个项目吗？',  
            okText: '确定',  
            cancelText: '取消',  
            onOk: async () => {  
              // 执行删除操作  
              const ret = await DeleteProject({id,dir})
              if(ret.code){
                  message.error("删除失败")
                  return
              }
              message.success(`节点 ${id} 已成功删除`);  
              loadDirs()
            },  
            onCancel: () => {  
              message.error('删除操作已取消');  
            },  
          });  

    }

    
    const columns = [
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            render: (text, record) => (
                <span>
                    <div onClick={() => handleViewLog(record.port)}
                         style={{color: "#1890ff", cursor: "pointer"}}>{record.port}</div>
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
                         style={{color: "#1890ff", cursor: "pointer"}}>{record.dir}</div>
                </span>
            ),
        },
        {
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
        },
        {
            title: 'DESC',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'VERSION',
            dataIndex: 'release_version',
            key: 'release_version',
        },
        {
            title: 'DataBase',
            dataIndex: 'database',
            key: 'database',
            render: (text, record, index) => (
                <span>
                    <div onClick={() => showDatabase(index, record)} style={{color: "#1890ff", cursor: "pointer"}}>database
                    </div>
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width:"300px",
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => handleRestart(record)}loading={restartingPorts[record.port]}>restart</Button>
                    <Button style={{margin: '4px',background:"green",color:'white'}} onClick={() => handleCheckStatus(record.pid)}>stats</Button>
                    <Button style={{margin: '4px',background:"orange",color:'white'}} onClick={()=>handleGetTaroFile(record.dir)}>taro</Button>
                    <Button style={{margin: '4px',background:"purple",color:"white"}} onClick={() => handleShutDown(record.port)}>shutdown</Button>
                    <Button style={{margin: '4px',background:"red",color:'white'}} onClick={()=>handleDeleteProject(record.id,record.dir)}>delete</Button>
                </div>
            ),
        },
    ];

    const [isAddFolderVisable, setIsAddFolderVisable] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [form] = Form.useForm();
    const handleMkDir = async ()=>{
        const dir = form.getFieldValue("directoryName") as string
        const data = await MakeDir(currentFolder.name,dir)
        if(!data.code){
            message.success("创建目录成功")
        }
    }
    // Recursive directory tree
    const renderDirectoryTree = (data: any) =>
        data.map((item: any) => {
            if (item.type === 'folder') {
                return {
                    title: item.name,
                    key: item.path,
                    type: item.type,
                    icon: <FolderOutlined className="ant-tree-icon-folder"/>,
                    children: renderDirectoryTree(item.children || []),
                };
            }
            return {
                title: item.name,
                key: item.path,
                type: item.type,
                icon: <FileOutlined className="ant-tree-icon-file"/>,
            };
        });

    const handleAddDirectory = (values) => {
        // 这里你可以更新你的目录数据
        // 例如：currentFolder.children.push(newDirectory)
        // 然后重新渲染目录树

        setIsAddFolderVisable(false);
        form.resetFields();
    };

    const handleRestart = async (record) => {
        setRestartingPorts(prev => ({...prev, [record.port]: true}));
        const data = await Reload(record.port);
        console.log(data);

        setTimeout(() => {
            setRestartingPorts(prev => ({...prev, [record.port]: false}));
            message.success('重启成功');

            // 刷新PID值的逻辑（这取决于你如何存储和更新数据）
            // ...

        }, 2000);
    };

    const handleCheckStatus = async (node) => {
        console.log('Checking status for node:', node);
        const data = await getStats(node)
        if (!data.code) {
            message.success("该节点状态正常")
        }
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
            customUpload({file: fileList[0].originFileObj, onSuccess: onUploadSuccess, onError: onUploadError});
        }
    };

    const onUploadSuccess = (response) => {
        message.success("上传成功！" + response.data.write_file_path)
    };

    const onUploadError = (error) => {
        message.error("上传失败！" + error)
        // Handle error logic here
    };


    const customUpload = async ({file, onSuccess, onError}) => {
        const formData = new FormData();
        formData.append('file', file); // 'file' 是服务器期望的字段名

        try {
            const response = await UpLoadFile(formData, selectedDirectory);
            onSuccess(response);
        } catch (error) {
            onError(error);
        }
    };

    const [isWriteFileOpen, setWriteOpen] = useState(false)
    const fileNameRef = useRef<InputRef>({} as InputRef);
    const [editorVal, setEditorVal] = useState("")
    useEffect(()=>{
        if(userTargetDir != ""){
            setEditorVal(baseApiContent(userTargetDir))
        }
    },[userTargetDir])
    const [isCreateProjectVisible, setIsCreateProjectVisible] = useState(false);
    const [isReleaseVisible, setIsReleaseVisible] = useState(false);

    const showReleaseModal = () => {
        setIsReleaseVisible(true);
    };

    const handleReleaseOk = async (values) => {
        values.user_id = userInfo.id
        const {id:dir_id,dir:dir_path} = JSON.parse(values.dir_obj);
        values.dir_id = dir_id;
        values.dir_path = dir_path;
        console.log('Received values from form: ', values);
        const data = await ReleasePkg(values)
        console.log(data)
        setIsReleaseVisible(false);
    };

    const handleReleaseCancel = () => {
        setIsReleaseVisible(false);
    };

    return (
        <Row style={{height: 'auto'}}>
            <Col span={6} style={{borderRight: '1px solid #e8e8e8', padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3>Directory</h3>
                    <ReloadOutlined onClick={loadDirs}/>
                </div>
                <Tree
                    showIcon
                    defaultExpandAll
                    treeData={renderDirectoryTree(dirs)}
                    onSelect={(selectedKeys, info) => handleNodeClick(info.node, selectedKeys)}
                ></Tree>
                <Button type="primary" onClick={showModal} style={{marginTop: '20px'}}>
                    Upload File
                </Button>
                <br/>
                <Button type={"primary"} onClick={() => setWriteOpen(true)} style={{marginTop: '20px'}}>
                    WriteFile File
                </Button>
                <RequestComponent functions={dirs}/>
                <SelectFileComponent 
                    selectedFile={selectedFile}
                    handleOk={handleOk}
                    isFileVisible={isFileVisible}
                    handleEdit={handleEdit}
                    isEditing={isEditing}
                    setFileVisible={setFileVisible}
                    fileContent={fileContent}
                    setFileContent={setFileContent}
                ></SelectFileComponent>
                <WriteFileComponent
                    isWriteFileOpen={isWriteFileOpen}
                    handleDirectoryChange={handleDirectoryChange}
                    allDirectories={allDirectories}
                    fileNameRef={fileNameRef}
                    editorVal={editorVal}
                    setEditorVal={setEditorVal}
                    selectedDirectory={selectedDirectory}
                    setWriteOpen={setWriteOpen}
                    userTargetDir={userTargetDir}
                ></WriteFileComponent>
                <UploadFileComponent 
                    isModalVisible={isModalVisible}
                    handleDirectoryChange={handleDirectoryChange}
                    allDirectories={allDirectories}
                    selectedDirectory={selectedDirectory}
                    setFileList={setFileList}
                    fileList={fileList}
                    handleUpload={handleUpload}
                    handleCancel={handleCancel}
                ></UploadFileComponent>
                <AddDirComponent 
                    currentFolder={currentFolder}
                    isAddFolderVisable={isAddFolderVisable}
                    setIsAddFolderVisable={setIsAddFolderVisable}
                    handleAddDirectory={handleAddDirectory}
                    form={form}
                    handleMkDir={handleMkDir}
                ></AddDirComponent>
                <TaroFileComponent
                    taroDir={taroDir}
                    taroEditorVal={taroEditorVal}
                    setTaroEditorVal={setTaroEditorVal}
                    taroFileVisible={taroFileVisible}
                    setTaroFileVisible={setTaroFileVisible}
                ></TaroFileComponent>
            </Col>
            <Col span={18} style={{padding: '20px'}}>
                <Button
                    type="primary"
                    onClick={() => setIsCreateProjectVisible(!isCreateProjectVisible)}
                >Create Project
                </Button>
                <Button style={{margin: '0 8px',background:"green",color:"white"}} onClick={showReleaseModal}>Release Package</Button>
                <ReleasePackageModal
                    visible={isReleaseVisible}
                    onCancel={handleReleaseCancel}
                    dirs = {userDirs}
                    onOk={handleReleaseOk}
                />
                <CreateProjectComponent visible={isCreateProjectVisible}
                                        onCancel={() => setIsCreateProjectVisible(false)}
                                        userInfo={userInfo}/>
                <Table columns={columns} dataSource={userDirs} rowKey="port" bordered/>
                <Logger port={port}></Logger>
                <ReactECharts option={apiCharts} style={{height: '300px', marginBottom: '20px'}}/>
            </Col>
        </Row>
    );
};

export default UserDashboard;
