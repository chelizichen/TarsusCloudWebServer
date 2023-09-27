import React from 'react';
import { Layout, Menu, Card, Carousel, Button } from 'antd';
import { Link } from 'react-router-dom';


const HomePage = () => {
    return (
        <div className="site-layout-content">
            <Carousel autoplay>
                <div>
                    <h1>ElementUI Low-Code Platform</h1>
                    <h2>快速构建Vue2原形</h2>
                    <Link to={'/tarsuscloud/lowcode'}>
                        <Button type="primary">创建组件</Button>
                    </Link>
                    <Card title="Welcome to ElementUI Low-Code Platform" style={{ marginTop: '20px' }}>
                        <p>This platform allows users to manage their Fass nodes, view their status, and much more.</p>
                        <p>Choose between User Interface and Admin Interface to proceed.</p>
                    </Card>
                </div>
                <div>
                    <h1>FASS Platform</h1>
                    <h2>快速构建服务</h2>
                    <Link to={'/tarsuscloud/user'}>
                        <Button type="primary">创建函数</Button>
                    </Link>
                    <Card title="Welcome to Fass Management Platform" style={{ marginTop: '20px' }}>
                        <p>This platform allows users to manage their Fass nodes, view their status, and much more.</p>
                        <p>Choose between User Interface and Admin Interface to proceed.</p>
                    </Card>
                </div>
            </Carousel>
        </div>
    );
}

export default HomePage;
