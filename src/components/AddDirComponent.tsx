import { Modal, Button, Input, Form } from "antd"

function AddDirComponent(
    {
        currentFolder,
        isAddFolderVisable,
        setIsAddFolderVisable,
        handleAddDirectory,
        form,
        handleMkDir,
    }) {
    return (
        <Modal
        title={`Add Directory to ${currentFolder?.name}`}
        open={isAddFolderVisable}
        onCancel={() => setIsAddFolderVisable(false)}
        footer={null}
    >
        <Form form={form} onFinish={handleAddDirectory}>
            <Form.Item
                name="directoryName"
                rules={[{required: true, message: 'Please input directory name!'}]}
            >
                <Input placeholder="Directory Name"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" onClick={handleMkDir}>
                    Add
                </Button>
            </Form.Item>
        </Form>
    </Modal>
    )
}

export default AddDirComponent