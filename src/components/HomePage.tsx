import React from 'react';
import { Layout, Menu, Card, Carousel } from 'antd';


const HomePage = () => {
    return (
        <div className="site-layout-content">
            <Carousel autoplay>
                <div>
                    <h3>Slide 1</h3>
                </div>
                <div>
                    <h3>Slide 2</h3>
                </div>
                <div>
                    <h3>Slide 3</h3>
                </div>
            </Carousel>
            <Card title="Welcome to Fass Management Platform" style={{ marginTop: '20px' }}>
                <p>This platform allows users to manage their Fass nodes, view their status, and much more.</p>
                <p>Choose between User Interface and Admin Interface to proceed.</p>
            </Card>
        </div>
    );
}

export default HomePage;
