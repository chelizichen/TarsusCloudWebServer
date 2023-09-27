import { Form, Modal, Input, Button } from "antd";

function CreateFileComponent({isCreateFileOpen,SetIsCreateFileOpen,handleCreate}){
    const [form] = Form.useForm();
    const handleFinish = ()=>{
        SetIsCreateFileOpen(false)
        form.resetFields()
    }
    return (
        <Modal
        title={`Edit Component `}
        open={isCreateFileOpen}
        onCancel={() => SetIsCreateFileOpen(false)}
        footer={null}
    >
        <Form form={form} onFinish={handleFinish}>
            <Form.Item
                name="fileName"
                rules={[{required: true, message: 'Please input Vue Component Name'}]}
            >
                <Input placeholder="Vue component Name"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" onClick={()=>handleCreate(form.getFieldsValue())}>
                    Create
                </Button>
            </Form.Item>
        </Form>
        </Modal>
    )
}

export default CreateFileComponent