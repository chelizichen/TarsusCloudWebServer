import { Modal, Button, Input, Select, Upload } from "antd"

function UploadFileComponent(
    {
        isModalVisible,
        handleDirectoryChange,
        allDirectories,
        selectedDirectory,
        setFileList,
        fileList,
        handleUpload,
        handleCancel
    }) {
    return (
        <Modal title="Upload File" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Select
            placeholder="Select a directory"
            onChange={handleDirectoryChange}
            style={{width: '100%', marginBottom: '20px'}}
        >
            {allDirectories.map(dir => (
                <Select.Option key={dir} value={dir}>{dir}</Select.Option>
            ))}
        </Select>
        <Upload
            disabled={!selectedDirectory}
            fileList={fileList}
            onChange={({fileList}) => setFileList(fileList)}
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
    )
}

export default UploadFileComponent