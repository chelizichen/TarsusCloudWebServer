import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Carousel } from 'antd';
import { HomeOutlined, UserOutlined, AimOutlined } from '@ant-design/icons';
import { Routes, Route, Link,useLocation } from 'react-router-dom';

import UserDashboard from './UserDashBoard';
import HomePage from './HomePage';
import AdminDashBoard from './AdminDashBoard'

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
                    <Menu.Item key="1" icon={<HomeOutlined />}><Link to="/">TarsusCloud</Link></Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}><Link to="/user">User</Link></Menu.Item>
                    <Menu.Item key="3" icon={<AimOutlined />}> <Link to="/admin">Admin</Link></Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: padd }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashBoard />} />
                    {/* Add your Admin route here if needed */}
                </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fass Management Platform ©2023 Created by Your Name</Footer>
        </Layout>
    );
}

export default RouterComponent;
