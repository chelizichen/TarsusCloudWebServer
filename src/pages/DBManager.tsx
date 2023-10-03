import React, {useEffect, useState} from 'react';
import { Layout, Menu, Button, Typography, Table } from 'antd';
import {getDatabases, getTableDatas, getTableDetail} from "../api/main.ts";
import lodash from 'lodash'
const { Title } = Typography;
const { Sider, Content } = Layout;

const DatabaseManager = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [viewMode, setViewMode] = useState('DATA'); // or 'STRUCT'

    const [myTables,SetTables] = useState([])
    const [tableDatas,SetTableDatas] = useState([])
    const [tableColumns,SetTableColumns] = useState([])

    useEffect(() => {
        getDatabases({}).then(res=>{
            SetTables(res.data)
        })
    }, []);

    useEffect(()=>{
        if(typeof selectedTable == "string"){
            getTableDatas(selectedTable,{}).then(res=>{
                SetTableDatas(res.data)
                
            })
            getTableDetail(selectedTable).then(res=>{
                console.log(res);
                const keys = Object.keys(lodash.keyBy(res.data,"Field")).map(item=>({
                    title: item.charAt(0).toUpperCase()
                        + item.slice(1),  // 首字母大写
                    dataIndex: item,
                    key: item
                }))
                SetTableColumns(keys)
            })
        }
    },[selectedTable])


    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={200} style={{backgroundColor:'white'}}>
                <Menu mode="inline" defaultSelectedKeys={['1']}>
                    {myTables.map(table => (
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

                            <div style={{ marginTop: '20px' }}>
                                {viewMode === 'DATA' ? (
                                    <div>
                                        <Table dataSource={tableDatas} columns={tableColumns} />
                                    </div>
                                ) : (
                                    <div></div>
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
