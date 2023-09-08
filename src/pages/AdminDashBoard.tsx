import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Input, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // 假设这是一个API调用来获取所有用户
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Fetch users here and setUsers
        // For now, let's use a mock data
        setTimeout(() => {
            setUsers([
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                // ... more users
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Implement debounce here for better performance
    };

    const filteredUsers = users.filter(user => user.name.includes(searchTerm));

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={200} theme="dark">
                <Menu mode="inline" defaultSelectedKeys={['1']} theme="dark">
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        用户管理
                    </Menu.Item>
                    {/* Other admin functionalities can be added here */}
                </Menu>
            </Sider>
            <Layout>
                <div style={{display:"flex"}}>
                    <Content style={{ padding: '24px', minHeight: '280px' }} >
                        <Input.Search
                            placeholder="搜索用户"
                            onChange={handleSearch}
                            style={{ marginBottom: '20px' }}
                        />
                        <Table
                            dataSource={filteredUsers}
                            columns={[
                                { title: 'Name', dataIndex: 'name', key: 'name' },
                                { title: 'Email', dataIndex: 'email', key: 'email' },
                                {
                                    title: 'Action',
                                    key: 'action',
                                    render: (text, record) => (
                                        <a onClick={() => handleUserClick(record)}>查看详情</a>
                                    ),
                                },
                            ]}
                            rowKey="id"
                        />
                    </Content>
                    <Content style={{ padding: '24px', borderLeft: '1px solid #f0f0f0' }}>
                        {selectedUser ? (
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <p>Email: {selectedUser.email}</p>
                                {/* Add more user.ts details here */}
                            </div>
                        ) : (
                            <Spin spinning={loading}>
                                <p>选择一个用户查看详情</p>
                            </Spin>
                        )}
                    </Content>
                </div>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
