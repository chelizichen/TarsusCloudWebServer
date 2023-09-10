import React, { useEffect, useState } from 'react';
import {Layout, Menu, Card, Carousel, message} from 'antd';
import {HomeOutlined, UserOutlined, AimOutlined, CloudOutlined} from '@ant-design/icons';
import {Routes, Route, Link, useLocation, useNavigate} from 'react-router-dom';
import UserDashboard from '../pages/UserDashBoard';
import HomePage from '../pages/HomePage';
import AdminDashBoard from '../pages/AdminDashBoard'
import LoginForm from "../pages/Login.tsx";
import useStore from '../store';
import DatabaseManager from '../pages/DBManager.tsx';
import Logger from "../components/APIPerformance.tsx";
import LoggerViewer from "../pages/LoggerViewer.tsx";

const { Header, Content, Footer } = Layout;

const RouterComponent = () => {
    const location = useLocation();
    const navigation = useNavigate();
    const [padd, setPadd] = useState("50px");
    const userInfo = useStore((state)=>state.user)
    const setUser = useStore((state)=>state.setUser)

    const token = localStorage.getItem("token")
    const parseToken = JSON.parse(token)

    if(!userInfo && token){
        setUser(parseToken)
    }

    useEffect(() => {
        if(!token && !userInfo){
            if(location.pathname != "/login"){
                message.warning("信息失效，请重新登陆")
            }
            navigation("/login")
            return;
        }

        if(token && userInfo){
            if (location.pathname === '/admin' || location.pathname === "/database") {
                setPadd('0');
            } else {
                setPadd('50px');
            }
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
                    <Route path="/user" element={<UserDashboard userInfo={userInfo} />} />
                    <Route path="/admin" element={<AdminDashBoard />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/database" element={<DatabaseManager />} />
                    <Route path="/logger" element={<LoggerViewer />} />
                    {/* Add your Admin route here if needed */}
                </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>TarsusCloud Management Platform ©2023 Created by Leekus</Footer>
        </Layout>
    );
}

export default RouterComponent;
