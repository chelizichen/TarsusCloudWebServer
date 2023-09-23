import { Modal, Button, Input, Select, message } from "antd"
import Editor from "./Editor"
import { UploadCode, getTaroInterfaces,setTaroInterfaces } from "../api/main"
import { useEffect, useState } from "react"
import { baseApiContent } from "./BaseApiContent"

function WriteFileComponent(
    {
        isWriteFileOpen,
        handleDirectoryChange,
        allDirectories,
        fileNameRef,
        editorVal,
        setEditorVal,
        setWriteOpen,
        selectedDirectory,
        userTargetDir,
    }) {
    const uploadCode = async () => {
        if (!selectedDirectory || selectedDirectory == "") {
            message.error("error : please check your directory is selected or not")
            return
        }
        const data = {
            dir: selectedDirectory,
            fileName: fileNameRef.current.input.value as string + fileType,
            code: editorVal
        }
        const ret = await UploadCode(data)
        if (ret.code) {
            message.error("上传代码失败 code:" + ret.code);
            return;
        }
        message.success("上传代码成功")
        setWriteOpen(false)
    }
    const [fileType, setFileType] = useState("typescript")
    const [interfaces,setInterfaces] = useState([])
    const [targetInterface,setTargetInterface] = useState("")
    const handleFileTypeChange = (value) => {
        setFileType(value)
    }

    useEffect(()=>{
        if(userTargetDir == "" || !isWriteFileOpen){
            return;
        }
        getTaroInterfaces({dir:userTargetDir}).then(res=>{
            setInterfaces(res.data || [])
        })
    },[userTargetDir,isWriteFileOpen])
    
    useEffect(()=>{
        if(userTargetDir == "" || targetInterface == "" || !isWriteFileOpen){
            return;
        }
        setTaroInterfaces({dir:userTargetDir,target:targetInterface}).then(res=>{
            setEditorVal(baseApiContent(userTargetDir,res.data))
        })
    },[targetInterface,isWriteFileOpen])

    const handleSetInterfaceChange = (item)=>{
        setTargetInterface(item)
    }



    return (
        <Modal title="Write File" open={isWriteFileOpen} onCancel={() => setWriteOpen(false)} footer={null}
            width={900}>
            <div id={'container'}>
                <div style={{ display: "flex" }}>
                    <Select
                        placeholder="Select a directory"
                        onChange={handleDirectoryChange}
                        style={{ width: '200px', marginBottom: '20px' }}
                    >
                        {allDirectories.map(dir => (
                            <Select.Option key={dir} value={dir}>{dir}</Select.Option>
                        ))}
                    </Select>
                    <Input ref={fileNameRef} style={{ height: "32px", width: "200px" }}></Input>
                    <Select
                        placeholder="FileType"
                        onChange={handleFileTypeChange}
                        style={{ width: '100', marginBottom: '20px' }}
                    >
                        <Select.Option key={".ts"} value={".ts"}>{".ts"}</Select.Option>
                        <Select.Option key={".js"} value={".js"}>{".js"}</Select.Option>
                    </Select>

                    <Select
                        placeholder="choose interface"
                        onChange={handleSetInterfaceChange}
                        style={{ width: '400px', marginBottom: '20px' }}
                    >
                        {
                            interfaces.map(item=>{
                                return(
                                    <Select.Option key={item} value={item}>{item}</Select.Option>
                                )
                            })
                        }
                    </Select>
                </div>
                <Editor language="typescript" value={editorVal}
                    onChange={(newValue) => setEditorVal(newValue)}></Editor>
                <Button onClick={uploadCode} type={"primary"}>upload code</Button>
            </div>
        </Modal>
    )
}

export default WriteFileComponent