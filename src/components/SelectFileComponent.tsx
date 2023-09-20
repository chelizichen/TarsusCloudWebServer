import { Modal, Button, Input } from "antd"
import CodeBlock from "./HighLightCode"

function SelectFileComponent(
    {
        selectedFile,
        handleOk,
        isFileVisible,
        handleEdit,
        isEditing,
        setFileVisible,
        fileContent,
        setFileContent
    }){
    return(
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
            <CodeBlock code={fileContent}/>
        )}
    </Modal>
    )
}

export default SelectFileComponent