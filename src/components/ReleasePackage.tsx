import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const ReleasePackageModal = ({ visible, onCancel, onOk }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Release Package"
            open={visible}
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onOk(values);
                    })
                    .catch(info => {
                        console.log('Validation failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="release_package_form"
                initialValues={{
                    dir_id: 2,
                    user_id: '2',
                    package_info: '测试打包',
                    package_version: '1',
                    dir_path: 'leemulus',
                }}
            >
                <Form.Item
                    name="dir_id"
                    label="Directory ID"
                    rules={[{ required: true, message: 'Please input the directory ID!' }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="user_id"
                    label="User ID"
                    rules={[{ required: true, message: 'Please input the user ID!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="package_info"
                    label="Package Info"
                    rules={[{ required: true, message: 'Please input the package info!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="package_version"
                    label="Package Version"
                    rules={[{ required: true, message: 'Please input the package version!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="dir_path"
                    label="Directory Path"
                    rules={[{ required: true, message: 'Please input the directory path!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReleasePackageModal;
