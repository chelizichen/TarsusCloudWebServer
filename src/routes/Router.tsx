import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Carousel } from 'antd';
import {HomeOutlined, UserOutlined, AimOutlined, CloudOutlined} from '@ant-design/icons';
import { Routes, Route, Link,useLocation } from 'react-router-dom';

import UserDashboard from '../pages/UserDashBoard';
import HomePage from '../pages/HomePage';
import AdminDashBoard from '../pages/AdminDashBoard'
import LoginForm from "../pages/Login.tsx";

const { Header, Content, Footer } = Layout;

const RouterComponent = () => {
    const location = useLocation();
    const [padd, setPadd] = useState("50px");

    useEffect(() => {
        if (location.pathname === '/admin') {
            setPadd('0');
        } else {
            setPadd('50px');
        }
    }, [location.pathname]);
    return (
        <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<CloudOutlined />}><Link to="/">TarsusCloud</Link></Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}><Link to="/user">User</Link></Menu.Item>
                    <Menu.Item key="3" icon={<AimOutlined />}> <Link to="/admin">Admin</Link></Menu.Item>
                    <Menu.Item key="4" icon={<HomeOutlined />}> <Link to="/login">Login</Link></Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: padd }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashBoard />} />
                    <Route path="/login" element={<LoginForm />} />
                    {/* Add your Admin route here if needed */}
                </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>TarsusCloud Management Platform ©2023 Created by Leekus</Footer>
        </Layout>
    );
}

export default RouterComponent;
