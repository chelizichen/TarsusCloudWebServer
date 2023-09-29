import {Button, Form, Input, Modal, Select, Switch, Radio} from 'antd';
import React, {useEffect, useState} from 'react';
import {ApiType, ButtonType, ElementUIComponents, TableConfig, TarsusLowCode} from '../define';
import {ApiComponent, ElTable} from "./BaseComponents.tsx";
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
                    label={"文字"}
                    name="text"
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Input placeholder="text"/>
                </Form.Item>

                <Form.Item
                    name="btnType"
                    label={"按钮类型"}
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Select>
                        <Select.Option key={1} value={ButtonType.Common}><Button
                            type={'default'}>普通按钮</Button></Select.Option>
                        <Select.Option key={2} value={ButtonType.Main}><Button
                            type={'primary'}>主按钮</Button></Select.Option>
                        <Select.Option key={3} value={ButtonType.Text}><Button
                            type={'text'}>文本按钮</Button></Select.Option>
                        <Select.Option key={4} value={ButtonType.CREATE}><Button
                            style={{background:'green',color:'white'}}
                           >新建按钮</Button></Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label={"绑定接口"}
                    name="apiUid"
                    rules={[{required: false, message: 'Please input button text!'}]}
                >
                    <Select>
                        {ApiData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ApiComponent {...item}/>
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
                    label={"接口文字"}
                    rules={[{required: true, message: 'Please input button text!'}]}
                >
                    <Input placeholder="text"/>
                </Form.Item>

                <Form.Item
                    name="ApiType"
                    label={"接口类型"}
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
                    label={"接口URI"}
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
    const [isColumnEditOpen, SetEditColumnOpen] = useState(false)
    const [currColumn, SetCurrColumn] = useState()
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

    const handleSetEditColumnOpen = (name) => {
        const item = form.getFieldValue('data')[name]
        SetEditColumnOpen(true)
        SetCurrColumn(item);
        console.log(item)
    }


    return (
        <Modal
            title={`Edit Table Component `}
            open={isTableComponentOpen}
            onCancel={() => setTableComponentOpen(false)}
            footer={null}
            width={1000}
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
                                        onClick={() => handleSetEditColumnOpen(name)}
                                        type={"primary"}
                                    >高级
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            remove(name);
                                        }}
                                        type={"primary"}
                                        style={{background: 'red'}}
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
            <EditTableColumnModal {...currColumn} isEditColumnOpen={isColumnEditOpen}
                                  setEditColumnOpen={SetEditColumnOpen}></EditTableColumnModal>
        </Modal>
    );
}


type EditTableColumnProps = TableConfig['data'][0] & {
    isEditColumnOpen: boolean;
    setEditColumnOpen(val: boolean): void;
} & {
    // todo 补充对应的特殊列的类型
}

export function EditTableColumnModal(props: EditTableColumnProps) {
    const {columnName, filedName, columnUid, isEditColumnOpen, setEditColumnOpen} = props;
    const [form] = Form.useForm();
    const [specialColumnType, setSpecialColumnType] = useState<string | null>(null);
    const [formatOption, setFormatOption] = useState<string | null>(null);

    const handleOk = () => {
        form.validateFields().then((values) => {
            // 处理确认按钮点击事件，保存数据等操作
            console.log(values);
            setEditColumnOpen(false); // 关闭 Modal
        });
    };

    const handleCancel = () => {
        setEditColumnOpen(false); // 关闭 Modal
    };


    return (
        <Modal
            title={`编辑列-${columnName}`}
            visible={isEditColumnOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 16}}>
                <Form.Item label="列名" name="columnName" initialValue={columnName}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item label="字段名" name="filedName" initialValue={filedName}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item label="特殊列选项">
                    <Radio.Group
                        value={specialColumnType}
                        onChange={(e) => setSpecialColumnType(e.target.value)}
                    >
                        <Radio.Button value="format">格式化选项</Radio.Button>
                        <Radio.Button value="button">按钮类型</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {specialColumnType === 'format' && (
                    <Form.Item label="格式化选项" name="formatOption">
                        <Select
                            value={formatOption}
                            onChange={(value) => setFormatOption(value)}
                        >
                            <Select.Option value="date">日期格式化</Select.Option>
                            <Select.Option value="percentage">百分比格式化</Select.Option>
                        </Select>
                    </Form.Item>
                )}
                {specialColumnType === 'button' && (
                    <Form.Item label="按钮类型" name="buttonType">
                        <Select>
                            <Select.Option value="primary">Primary</Select.Option>
                            <Select.Option value="secondary">Secondary</Select.Option>
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}


type ElPaginationProps = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isPaginationComponentOpen: boolean;
    SetPaginationComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[];
    TableData:any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function ElPaginationModal(
    {
        uid,
        lowcodeComponent,
        isPaginationComponentOpen,
        SetPaginationComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc,
        TableData
    }: ElPaginationProps) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
        console.log('ApiData', ApiData)
        console.log('TableData', TableData)
    }, [ApiData,TableData]);
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
            console.log('ElPaginationModal', res);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        SetPaginationComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreatePagination(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.PAGINATION)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.PAGINATION)
    }
    return (
        <Modal
            title={`Edit Pagination Component `}
            open={isPaginationComponentOpen}
            onCancel={() => SetPaginationComponentOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item label="Offset 名称" name="NameOfOffset" >
                    <Input />
                </Form.Item>
                <Form.Item label="Size 名称" name="NameOfSize" >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="QueryApiUid"
                    rules={[{required: false, message: 'Please input button text!'}]}
                    label="选择请求"
                >
                    <Select bordered={false}>
                        {ApiData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ApiComponent {...item}/>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="targetTableUid"
                    rules={[{required: false, message: 'Please input button text!'}]}
                    label="选择表格"
                >
                    <Select bordered={false}>
                        {TableData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ElTable {...item}/>
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



type ElSelectionModalProps = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isSelectionComponentOpen: boolean;
    SetSelectionComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[];
    TableData:any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function ElSelectionModal(
    {
        uid,
        lowcodeComponent,
        isSelectionComponentOpen,
        SetSelectionComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc,
        TableData
    }: ElSelectionModalProps) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
        console.log('ApiData', ApiData)
        console.log('TableData', TableData)
    }, [ApiData,TableData]);
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
            console.log('ElPaginationModal', res);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        SetSelectionComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreatePagination(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.SELECT)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.SELECT)
    }
    return (
        <Modal
            title={`Edit Pagination Component `}
            open={isSelectionComponentOpen}
            onCancel={() => SetSelectionComponentOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item
                    label="数据模型"
                    name="modelData"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="是否多选"
                    name="mutilate"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="QueryApiUid"
                    rules={[{required: false, message: 'Please input button text!'}]}
                    label="选择选项框"
                >
                    <Select bordered={false}>
                        {ApiData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ApiComponent {...item}/>
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


type ElOptionModalProps = {
    uid: string;
    lowcodeComponent: TarsusLowCode;
    isOptionComponentOpen: boolean;
    SetOptionComponentOpen: (bool: boolean) => void;
    removeComponent: (...args: any[]) => void;
    ApiData: any[];
    TableData:any[];
    callBackEditFunc: (uid: any, type: ElementUIComponents) => void;
}

export function ElOptionModal(
    {
        uid,
        lowcodeComponent,
        isOptionComponentOpen,
        SetOptionComponentOpen,
        removeComponent,
        ApiData,
        callBackEditFunc,
        TableData
    }: ElOptionModalProps) {
    const [form] = Form.useForm();
    const [originData, setOriginData] = useState({})
    useEffect(() => {
    }, [ApiData,TableData]);
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
            console.log('ElPaginationModal', res);
            form.setFieldsValue(res.data)
            setOriginData(res.data)
        })
    }, [uid])

    const handleFinish = () => {
        SetOptionComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = () => {
        const mergeData = Object.assign(originData, form.getFieldsValue())
        lowcodeComponent.CreatePagination(mergeData, true)
        callBackEditFunc(mergeData, ElementUIComponents.OPTIONS)
    }

    const handleDelete = () => {
        const fileUid = lowcodeComponent.FileConfig.fileUid
        lowcodeComponent.DeleteComponent(fileUid, uid)
        removeComponent(uid, ElementUIComponents.OPTIONS)
    }
    return (
        <Modal
            title={`Edit Pagination Component `}
            open={isOptionComponentOpen}
            onCancel={() => SetOptionComponentOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item
                    label="数据模型"
                    name="modelData"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="是否多选"
                    name="mutilate"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="QueryApiUid"
                    rules={[{required: false, message: 'Please input button text!'}]}
                    label="选择选项框"
                >
                    <Select bordered={false}>
                        {ApiData.map(item => (
                            <Select.Option value={item.uid} key={item.uid}>
                                <ApiComponent {...item}/>
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