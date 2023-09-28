import {Button, Form, Input, Modal, Select, Switch, List} from 'antd';
import React, {useEffect, useState} from 'react';
import {ApiType, ButtonType, ElementUIComponents, TarsusLowCode} from '../define';
import {ApiComponent} from "./BaseComponents.tsx";
import SpaceBetween from "../components/SpaceBetween.tsx";

type Props = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isButtonComponentOpen: boolean;
    setButtonComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function EditButtonModal(
    {
        uid,
        lowcodeComponent,
        isButtonComponentOpen,
        setButtonComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc
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
        lowcodeComponent.CreateButton(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.BUTTON)
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
                    rules={[{required: false, message: 'Please input button text!'}]}
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
    ApiData: any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function EditApiModal(
    {
        uid,
        lowcodeComponent,
        isApiComponentOpen,
        setApiComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc
    }: ApiProps) {
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
        lowcodeComponent.CreateApi(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.API)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.API)
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
                        <Select.Option key={1} value={ApiType.DELETE}>删除
                        </Select.Option>
                        <Select.Option key={2} value={ApiType.LINK}>链接
                        </Select.Option>
                        <Select.Option key={3} value={ApiType.SEARCH}>搜索
                        </Select.Option>
                        <Select.Option key={4} value={ApiType.UPDATE}>更新
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="url"
                    rules={[{required: false, message: 'Please input api uri!'}]}
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


type EditTableProps = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isTableComponentOpen: boolean;
    setTableComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function EditTableModal(
    {
        uid,
        lowcodeComponent,
        isTableComponentOpen,
        setTableComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc
    }: EditTableProps) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
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
            console.log('EditTableModal', res.data);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        setTableComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreateTable(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.TABLE)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.TABLE)
    }

    return (
        <Modal
            title={`Edit Table Component `}
            open={isTableComponentOpen}
            onCancel={() => setTableComponentOpen(false)}
            footer={null}
            width={600}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.List name="data">
                    {(fields, {add, remove}) => (
                        <div>
                            {fields.map(({key, name, fieldKey, ...restField}) => (
                                <SpaceBetween key={key}>
                                    <Form.Item
                                        label="列名"
                                        name={[name, 'columnName']}
                                        fieldKey={[fieldKey, 'columnName']}
                                        {...restField}
                                    ><Input placeholder="列名"/>
                                    </Form.Item>
                                    <Form.Item
                                        label="字段名"
                                        name={[name, 'filedName']}
                                        fieldKey={[fieldKey, 'filedName']}
                                        {...restField}
                                    ><Input placeholder="字段名"/>
                                    </Form.Item>
                                    <Button
                                        onClick={() => {
                                            remove(name);
                                        }}
                                        type={"primary"}
                                    >删除
                                    </Button>
                                </SpaceBetween>
                            ))}
                            <Button
                                onClick={() => {
                                    add(); // 添加一个新的 data 条目
                                }}
                                type="primary"
                            >
                                添加 Column
                            </Button>
                        </div>
                    )}
                </Form.List>
                {/* 模型数据 */}
                <Form.Item label="模型数据" name="modelData">
                    <Input placeholder="模型数据"/>
                </Form.Item>

                {/* 文本 */}
                <Form.Item label="文本" name="text">
                    <Input placeholder="文本"/>
                </Form.Item>

                {/* 是否显示边框 */}
                <Form.Item label="是否显示边框" name="isBorder" valuePropName="checked">
                    <Switch/>
                </Form.Item>

                {/* 是否居中 */}
                <Form.Item label="是否居中" name="isAlignCenter" valuePropName="checked">
                    <Switch/>
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
