import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { LinkToTable } from '../utils/chartsUtils';

const { Title } = Typography;
const { Sider, Content } = Layout;

const DatabaseManager = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [viewMode, setViewMode] = useState('DATA'); // or 'STRUCT'

    // 假设的数据
    const dbName = 'MyDatabase';
    const tables = ['table1', 'table2'];

    // 假设的表数据
    const tableData = [
        { key: '1', name: 'John', age: 32,phone:"123456",user_name:"admin",password:"1234566" },
        { key: '2', name: 'Doe', age: 42,phone:"123456",user_name:"admin",password:"123456" },
    ];

    const SeriesData = LinkToTable(tableData)
    const columns = SeriesData.columns;

    const [showModel,SetShowModel] = useState(false);

    const getOption = () => {
        return {
            title: {
                text: 'Table Structure'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 70,
                    roam: false,
                    label: {
                        show: true
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    data: SeriesData.data,
                    links: SeriesData.links,
                    lineStyle: {
                        opacity: 0.9,
                        width: 4,
                        curveness: 0
                    }
                }
            ]
        };
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={200}>
                <Title level={4} style={{ color: 'white', textAlign: 'center', padding: '20px 0' }}>
                    {dbName}
                </Title>
                <Menu mode="inline" defaultSelectedKeys={['1']}>
                    {tables.map(table => (
                        <Menu.Item key={table} onClick={() => setSelectedTable(table)}>
                            {table}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ padding: '20px' }}>
                    {selectedTable && (
                        <div>
                            <Title level={3}>{selectedTable}</Title>
                            <Button type={viewMode === 'DATA' ? 'primary' : 'default'} onClick={() => setViewMode('DATA')}>
                                DATA
                            </Button>
                            <Button type={viewMode === 'STRUCT' ? 'primary' : 'default'} onClick={() => setViewMode('STRUCT')}>
                                STRUCT
                            </Button>
                            <Button type={"link"} onClick={() => setViewMode('STRUCT')}>
                                MODEL
                            </Button>

                            <div style={{ marginTop: '20px' }}>
                                {viewMode === 'DATA' ? (
                                    <div>
                                        <Table dataSource={tableData} columns={columns} />
                                    </div>
                                ) : (
                                    <ReactECharts option={getOption()} style={{ height: '400px' }} />
                                )}
                            </div>
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
}

export default DatabaseManager;
