import {Modal, Button, Input, Select, message} from "antd"
import Editor from "./Editor"
import {touchTaroFile} from "../api/main.ts";
import { useEffect } from "react";

function TaroFileVisible(
    {
        taroDir,
        taroEditorVal,
        setTaroEditorVal,
        taroFileVisible,
        setTaroFileVisible,
    }) {
    const uploadCode = async ()=>{
        const data = await touchTaroFile({
            dir:taroDir,
            content:taroEditorVal
        })
        if(!Number(data.code)){
            message.success("更新协议成功")
        }else{
            message.error("更新协议失败")
        }
        setTaroFileVisible(false)
    }

    useEffect(()=>{
        console.log('taroEditorVal',taroEditorVal);
    },[taroEditorVal])

    return (
        <Modal title="Taro proto File" open={taroFileVisible} onCancel={() => setTaroFileVisible(false)} footer={null}
               width={900}>
            <Editor language="typescript" value={taroEditorVal}
                    onChange={(newValue) => setTaroEditorVal(newValue)}></Editor>
            <Button onClick={uploadCode} type={"primary"}>upload taro</Button>
        </Modal>
    )
}

export default TaroFileVisible