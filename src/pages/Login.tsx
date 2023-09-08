import React, {useState} from 'react';
import {Form, Input, Button, Card, Typography, Row, Col, message as OpenMessage} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {login} from "../api/user.ts";
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
const {Title, Paragraph} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const setUser = useStore((state) => state.setUser);
    const history = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        const apiResponse = {
            success: true, // 如果登录失败，将此设置为false
            message: '登录成功!' // 根据API的响应更改此消息
        };
        const {data, code, message} = await login(values.user_name, values.password)
        if (code) {
            OpenMessage.error(message)
            setLoading(false);
            return;
        }
        setLoading(false);
        OpenMessage.success(apiResponse.message)
        setUser(data);
        const token = JSON.stringify(data)
        localStorage.setItem("token", token);
        history('/user')
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
            <Row gutter={16}>
                <Col span={12}>
                    <Title level={2}>欢迎来到Fass管理平台</Title>
                    <Paragraph>
                        Fass管理平台是一个先进的、易于使用的平台，专为开发者和团队设计，以帮助他们更高效地管理和部署函数。
                    </Paragraph>
                    <Paragraph>
                        使用我们的平台，您可以轻松地跟踪、管理和优化您的函数，确保它们始终以最佳状态运行。
                    </Paragraph>
                </Col>
                <Col span={12}>
                    <Card>
                        <Title level={3} style={{textAlign: 'center'}}>登录</Title>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="user_name"
                                rules={[{required: true, message: '请输入你的用户名!'}]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{required: true, message: '请输入你的密码!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button"
                                        loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
