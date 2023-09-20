import { Modal, Button, Input, Select } from "antd"
import Editor from "./Editor"

function WriteFileComponent(
    {
        isWriteFileOpen,
        handleDirectoryChange,
        allDirectories,
        fileNameRef,
        handleFileTypeChange,
        editorVal,
        setEditorVal,
        uploadCode,
        setWriteOpen
    }) {
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
                        style={{ width: '70', marginBottom: '20px' }}
                    >
                        <Select.Option key={".ts"} value={".ts"}>{".ts"}</Select.Option>
                        <Select.Option key={".js"} value={".js"}>{".js"}</Select.Option>
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