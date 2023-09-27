import { Button, Input, Select,Op, Modal, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { TarsusLowCode } from '../define';

type Props = {
    uid:string;
    lowcodeComponent:TarsusLowCode;
    isOpen:boolean;
    setOpen:(bool:boolean)=>void;
}

function DifferenceComponent({uid,lowcodeComponent,isOpen,setOpen}:Props) {
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
            console.log(res);
        })
    },[uid])

    useEffect(()=>{

    },[lowcodeComponent])

    const handleFinish = ()=>{
        setOpen(false)
        form.resetFields();
    }

    const handleEdit = ()=>{

    }

    return (
        <Modal
            title={`Edit Component `}
            open={isOpen}
            onCancel={() => setOpen(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item
                    name="directoryName"
                    rules={[{required: true, message: 'Please input directory name!'}]}
                >
                    <Input placeholder="Directory Name"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleEdit}>
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default DifferenceComponent;