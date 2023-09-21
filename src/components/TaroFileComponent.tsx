import {Modal, Button, Input, Select, message} from "antd"
import Editor from "./Editor"
import {touchTaroFile} from "../api/main.ts";

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
        if(!data.code){
            message.success("发布成功")
        }
    }
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