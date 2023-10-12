import React, { useState } from 'react';
import { Modal, Input, Form, Button, message } from 'antd';
import {  setDBRecord } from '../api/main';

const AddDataSourceModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [port, setPort] = useState(3306);
  const [host, setHost] = useState('');
  const [database, setDatabase] = useState('');
  const [connectionLimit, setConnectionLimit] = useState(10);

  const handleAdd = () => {
    // 获取表单数据，可以根据需要将数据传递给父组件进行处理
    const formData = {
      user,
      password,
      port,
      host,
      database,
      connectionLimit,
    };
    const data = setDBRecord(formData);
    if(data.code){
      message.error("添加数据源失败 ｜"+ data.message)
      return
    }
    message.success("添加数据源成功")
    // 调用添加数据源的回调函数
    onAdd(formData);
    // 清空表单数据
    form.resetFields();
    
    // 关闭Modal
    onCancel();
  };

  return (
    <Modal
      title="Add Data Source"
      open={visible}
      onCancel={onCancel}
      onOk={handleAdd}
    >
      <Form form={form}>
        <Form.Item label="User" name="user">
          <Input onChange={(e) => setUser(e.target.value)} />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item label="Port" name="port">
          <Input type="number" onChange={(e) => setPort(e.target.value)} />
        </Form.Item>
        <Form.Item label="Host" name="host">
          <Input onChange={(e) => setHost(e.target.value)} />
        </Form.Item>
        <Form.Item label="Database" name="database">
          <Input onChange={(e) => setDatabase(e.target.value)} />
        </Form.Item>
        <Form.Item label="Connection Limit" name="connectionLimit">
          <Input type="number" onChange={(e) => setConnectionLimit(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDataSourceModal;
