import React, {useCallback, useEffect, useState} from 'react';
import {Layout, Menu, Button, Typography, Table, Form, FormInstance, Popconfirm} from 'antd';
import {getDatabases, getTableDatas, getTableDetail, saveTableData} from "../api/main.ts";
import lodash from 'lodash'
import {EditableCell} from "../dbmanager/EditableCell.tsx";

const {Title} = Typography;
const {Sider, Content} = Layout;

const EditableContext = React.createContext<FormInstance<any> | null>(null);


const DatabaseManager = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [viewMode, setViewMode] = useState('DATA'); // or 'STRUCT'

    const [myTables, SetTables] = useState([])
    const [tableDatas, SetTableDatas] = useState([])
    const [tableColumns, SetTableColumns] = useState([])
    const [fieldColumnsData, SetFieldColumnsData] = useState([])

    const fieldsColumns = lodash.keys({
        "Field": "id",
        "Type": "int",
        "Null": "NO",
        "Key": "PRI",
        "Default": null,
        "Extra": "auto_increment"
    }).map(item => ({
        title: item.charAt(0).toUpperCase()
            + item.slice(1),  // 首字母大写
        dataIndex: item,
        key: item
    }))
    const [KeyField, SetKeyField] = useState("")
    const OperateColumn = {
        title: 'Operation',
        dataIndex: 'Operation',
        render: (_: any, record: any) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
            <Typography.Link onClick={() => save(record[KeyField])} style={{marginRight: 8}}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
            ) : (
                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                    Edit
                </Typography.Link>
            );
        },
    }
    const [form] = Form.useForm();

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: any) => {
        return record[KeyField] === editingKey
    };

    const edit = (record: any & { key: React.Key }) => {
        console.log('PRIMARY-KEY', record[KeyField])
        form.setFieldsValue({...record});
        setEditingKey(record[KeyField]);
    };
    const save = async (key: any) => {
        try {
            const row = (await form.validateFields()) as any;
            const newData = [...tableDatas];
            const index = newData.findIndex((item) => key === item[KeyField]);
            // 修改
            if (index > -1) {
                const item = newData[index];
                const mergeItem = {
                    ...item,
                    ...row
                }
                const body = {
                    type:1,
                    data:mergeItem,
                    where:{
                        [KeyField]:key
                    }
                }
                const data = await saveTableData(selectedTable,body)
                console.log(data)
                // 合并
                newData.splice(index, 1, mergeItem);
                SetTableDatas(newData);
                setEditingKey('');
            } else {
                const body = {
                    type:0,
                    data:row,
                }
                newData.push(row);
                SetTableDatas(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const cancel = () => {
        setEditingKey('');
    };


    useEffect(() => {
        getDatabases({}).then(res => {
            SetTables(res.data)
        })
    }, []);

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    const handleRecordAdd = () => {
        const newData = lodash.cloneDeep(tableDatas[0]);
        for (let k in newData) {
            newData[k] = ""
        }
        SetTableDatas([newData, ...tableDatas]);
    };


    useEffect(() => {
        if (typeof selectedTable == "string") {
            getTableDatas(selectedTable, {}).then(res => {
                SetTableDatas(res.data)
            })
            getTableDetail(selectedTable).then(res => {
                const findKey = (res.data as Array<any>).find(item => item.Key == 'PRI')
                console.log(findKey, findKey.Field)
                SetKeyField(findKey.Field)

                const keys = Object.keys(lodash.keyBy(res.data, "Field")).map(item => ({
                    title: item.charAt(0).toUpperCase()
                        + item.slice(1),  // 首字母大写
                    dataIndex: item,
                    key: item,
                    editable:true,
                }))
                SetTableColumns(keys)
                SetFieldColumnsData(res.data)
            })
        }
    }, [selectedTable])

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const mergedColumns = tableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <Layout style={{height: '100vh'}}>
            <Sider width={200} style={{backgroundColor: 'white'}}>
                <Menu mode="inline" defaultSelectedKeys={['1']}>
                    {myTables.map(table => (
                        <Menu.Item key={table} onClick={() => setSelectedTable(table)}>
                            {table}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Content style={{padding: '20px'}}>
                    {selectedTable && (
                        <div>
                            <Title level={3}>{selectedTable}</Title>
                            <Button type={viewMode === 'DATA' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('DATA')}>
                                DATA
                            </Button>
                            <Button type={viewMode === 'STRUCT' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('STRUCT')}>
                                STRUCT
                            </Button>

                            <div style={{marginTop: '20px'}}>
                                {viewMode === 'DATA' ? (
                                    <div>
                                        <Button onClick={handleRecordAdd} type="primary" style={{marginBottom: 16}}>
                                            Add a row
                                        </Button>
                                        <Form form={form} component={false}>
                                            <Table dataSource={tableDatas}
                                                   columns={[...mergedColumns, OperateColumn]}
                                                   rowSelection={{
                                                       type: "checkbox",
                                                       ...rowSelection,
                                                   }}
                                                   components={components}
                                                   rowClassName="editable-row"
                                                   bordered
                                            />
                                        </Form>
                                    </div>
                                ) : (
                                    <div>
                                        <Table dataSource={fieldColumnsData} columns={fieldsColumns}/>
                                    </div>
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
