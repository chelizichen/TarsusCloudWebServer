import {Modal, Button, Input, Select} from "antd"
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
    const uploadCode = ()=>{
        touchTaroFile({
            dir:taroDir,
            content:taroEditorVal
        })
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