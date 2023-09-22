// CreateProjectComponent.js
import React, { useState } from 'react';
import {Button, Form, Input, InputNumber, message, Modal, Select} from 'antd';
import {CreateProject} from "../api/main.ts";


const CreateProjectComponent = ({ visible, onCancel,userInfo }) => {
    const [form] = Form.useForm();

    const portOptions = new Array(5000).fill(0).map((_,index)=>{
        return 10000+index 
    }); // 示例端口列表
    const versionOptions = ['1.0', '1.1', '1.2']; // 示例版本列表

    const handleSubmit = async (values) => {
        values.user_id = userInfo.id;
        console.log('Received values of form: ', values);
        const data= await CreateProject(values)
        console.log(data)
        // CreateProject(values)
        onCancel(); // 关闭模态框
    };

    return (
        <Modal
            title="Create Project"
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="port" label="Port" rules={[{ required: true, message: 'Please select a port!' }]}>
                    <Select placeholder="Select a port">
                        {portOptions.map(port => (
                            <Select.Option key={port} value={port}>
                                {port}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="dir" label="Directory" rules={[{ required: true, message: 'Please input the directory!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="release_version" label="Release Version" initialValue={versionOptions[0]}>
                    <Select>
                        {versionOptions.map(version => (
                            <Select.Option key={version} value={version}>
                                v{version}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProjectComponent;
