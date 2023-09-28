import {Button, Input, Select, Modal, Form} from 'antd';
import React, {useEffect, useState} from 'react';
import {ApiType, ButtonType, ElementUIComponents, TarsusLowCode} from '../define';
import {ApiComponent} from "./BaseComponents.tsx";

type Props = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isButtonComponentOpen: boolean;
    setButtonComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[]
}

export function EditButtonModal(
    {
        uid,
        lowcodeComponent,
        isButtonComponentOpen,
        setButtonComponentOpen,
        removeComponent,
        ApiData
    }: Props) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
        console.log('ApiData', ApiData)
    }, [ApiData]);
    // 每次uid改变的时候都需要去获取不同的组件数据
    useEffect(() => {
        if (!lowcodeComponent?.FileConfig?.fileUid) {
            return;
        }
        const data = {
            uid,
            fileUid: lowcodeComponent.FileConfig.fileUid
        }
        lowcodeComponent.request({
            url: 'GetComponent',
            data
        }).then(res => {
            console.log('res', res);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        setButtonComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreateButton(mergeData,true)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.BUTTON)
    }
    return (
        <Modal
            title={`Edit Button Component `}
            open={isButtonComponentOpen}
            onCancel={() => setButtonComponentOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item
                    name="text"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Input placeholder="text"/>
                </Form.Item>

                <Form.Item
                    name="btnType"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Select>
                        <Select.Option key={1} value={ButtonType.Common}><Button
                            type={'default'}>"普通按钮"</Button></Select.Option>
                        <Select.Option key={2} value={ButtonType.Main}><Button
                            type={'primary'}>"主按钮"</Button></Select.Option>
                        <Select.Option key={3} value={ButtonType.Text}><Button
                            type={'text'}>"文本按钮"</Button></Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="apiUid"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Select>
                        {ApiData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ApiComponent/>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleEdit}>
                        EDIT
                    </Button>
                    <Button style={{color: "red", marginLeft: "20px"}} htmlType="submit" onClick={handleDelete}>
                        DELETE
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

type ApiProps = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isApiComponentOpen: boolean;
    setApiComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[]
}

export function EditApiModal(
    {
        uid,
        lowcodeComponent,
        isApiComponentOpen,
        setApiComponentOpen,
        removeComponent,
        ApiData
    }:ApiProps) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
        console.log('ApiData', ApiData)
    }, [ApiData]);
    // 每次uid改变的时候都需要去获取不同的组件数据
    useEffect(() => {
        if (!lowcodeComponent?.FileConfig?.fileUid) {
            return;
        }
        const data = {
            uid,
            fileUid: lowcodeComponent.FileConfig.fileUid
        }
        lowcodeComponent.request({
            url: 'GetComponent',
            data
        }).then(res => {
            console.log('res', res);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        setApiComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreateApi(mergeData,true)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.BUTTON)
    }
    return (
        <Modal
            title={`Edit Api Component `}
            open={isApiComponentOpen}
            onCancel={() => setApiComponentOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item
                    name="text"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Input placeholder="text"/>
                </Form.Item>

                <Form.Item
                    name="ApiType"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Select>
                        <Select.Option key={1} value={ApiType.DELETE}><Button
                            style={{color: "red",}}>删除</Button>
                        </Select.Option>
                        <Select.Option key={2} value={ApiType.LINK}><Button
                            type={'link'}>链接</Button>
                        </Select.Option>
                        <Select.Option key={3} value={ApiType.SEARCH}><Button
                            style={{color: "white", background: "green"}} type={'text'}>搜索</Button>
                        </Select.Option>
                        <Select.Option key={4} value={ApiType.UPDATE}><Button
                            type={'primary'}>更新</Button>
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="url"
                    rules={[{required: true, message: 'Please input api uri!'}]}
                >
                    <Input placeholder="Please input api uri!"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleEdit}>
                        EDIT
                    </Button>
                    <Button style={{color: "red", marginLeft: "20px"}} htmlType="submit" onClick={handleDelete}>
                        DELETE
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

