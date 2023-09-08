import React, {useState} from 'react';
import {Form, Input, Button, Card, Typography, Row, Col} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

const {Title, Paragraph} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        // 这里你可以添加登录逻辑，例如 API 调用等
        setTimeout(() => {
            setLoading(false);
        }, 2000); // 模拟登录延迟
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
                                name="username"
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
