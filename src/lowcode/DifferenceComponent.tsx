import { Button, Input, Select,Op, Modal, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { ButtonType, TarsusLowCode } from '../define';

type Props = {
    uid:string;
    lowcodeComponent:TarsusLowCode;
    isButtonComponentOpen:boolean;
    setButtonComponentOpen:(bool:boolean)=>void;
}

export function ButtonComponent({uid,lowcodeComponent,isButtonComponentOpen,setButtonComponentOpen}:Props) {
    const [form] = Form.useForm();
    // 每次uid改变的时候都需要去获取不同的组件数据
    useEffect(()=>{
        if(!lowcodeComponent?.FileConfig?.fileUid){
            return;
        }
        const data = {
            uid,
            fileUid:lowcodeComponent.FileConfig.fileUid
        }
        lowcodeComponent.request({
            url:'GetComponent',
            data
        }).then(res=>{
            console.log('res',res);
        })
    },[uid])

    useEffect(()=>{

    },[lowcodeComponent])

    const handleFinish = ()=>{
        setButtonComponentOpen(false)
        form.resetFields();
    }

    const handleEdit = ()=>{
        console.log(form.getFieldsValue());
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
                        <Select.Option key={1} value={ButtonType.Common}>"普通按钮"</Select.Option>
                        <Select.Option key={2} value={ButtonType.Main}>"主按钮"</Select.Option>
                        <Select.Option key={3} value={ButtonType.Text}>"文本"</Select.Option>
                    </Select>
                </Form.Item>

    
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleEdit}>
                        Edit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

