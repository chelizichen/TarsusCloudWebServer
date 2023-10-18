import React, {useCallback, useEffect, useState} from 'react';
import {
    RadiusUprightOutlined,
    TableOutlined,
    ReadOutlined,
    CheckCircleOutlined,
    CopyrightCircleFilled, CopyFilled
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Button,
    Typography,
    Table,
    Form,
    FormInstance,
    Popconfirm,
    Modal,
    message,
    Select,
    Input,
    Drawer,
    Spin
} from 'antd';
import {
    deleteTableData,
    getDatabaseTables, getDBInfo,
    getTableDatas,
    getTableDetail,
    resetDatabase,
    saveTableData,
    showDatabases
} from "../api/main.ts";
import lodash from 'lodash'
import {EditableCell} from "../dbmanager/EditableCell.tsx";
import moment from 'moment';
import {uid} from "uid";
import ExportToExcelButton from "../dbmanager/ExportToExcelButton.tsx";
import CreateTable from "../dbmanager/CreateTable.tsx";
import SpaceBetween from "../components/SpaceBetween.tsx";
import FlexStart from '../components/FlexStart.tsx';
import AddDataSourceModal from '../dbmanager/AddDataSourceModal.tsx';
import GetDataSourceModal from '../dbmanager/GetDataSourceModal.tsx';
import QuerySqlModal from "../dbmanager/Query.tsx";

const {Title} = Typography;
const {Sider, Content} = Layout;


const DatabaseManager = () => {
    const [loading, setLoading] = useState(true);

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
                <>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}
                                     style={{marginRight: "10px"}}>
                        Edit
                    </Typography.Link>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => deleteRecord(record)}
                                     style={{color: "red"}}>
                        Delete
                    </Typography.Link>
                </>
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

    const deleteRecord = (record: any) => {
        const KeyFieldVal = record[KeyField]
        Modal.confirm({
            title: '删除确认',
            content: '确定要删除这条数据吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                // 执行删除操作
                const ret = await deleteTableData(selectedTable, {
                    [KeyField]: KeyFieldVal
                })
                if (ret.code) {
                    message.error("删除失败")
                    return
                }
                const index = tableDatas.findIndex(item => item[KeyField] === KeyFieldVal)
                const newData = [...tableDatas];
                newData.splice(index, 1)
                SetTableDatas(newData)
                message.success(`数据 KEY ${KeyField} ${KeyFieldVal} 已成功删除`);
            },
            onCancel: () => {
                message.error('删除操作已取消');
            },
        });
    }

    const save = async (key: any) => {
        try {
            // debugger;
            const row = (await form.validateFields()) as any;
            let newData = [...tableDatas];
            // id必须唯一，给UID的理由是确定行
            const index = newData.findIndex((item) => item[KeyField] === form.getFieldValue(KeyField));
            if (index > -1) {
                const item = newData[index];
                const mergeItem = {
                    ...item,
                    ...row
                }
                const body = {
                    type: 1,
                    data: mergeItem,
                    where: {
                        [KeyField]: key
                    }
                }
                const data = await saveTableData(selectedTable, body)
                // 合并
                newData.splice(index, 1, mergeItem);
                SetTableDatas(newData);
                setEditingKey('');
            } else {
                const body = {
                    type: 0,
                    data: row,
                }
                const data = await saveTableData(selectedTable, body)
                if(!row[KeyField]){
                    row[KeyField] = data.data.insertId
                }
                newData.push(row);
                newData = newData.filter(item=>item[KeyField] !== editingKey)
                SetTableDatas(newData);
                setEditingKey('');
            }
            message.success("保存成功")
        } catch (errInfo) {
           message.error("保存数据失败 | " + errInfo)
        }
    };


    const cancel = () => {
        setEditingKey('');
    };


    const InitDatabaseTables = () => {
        getDatabaseTables({}).then(res => {
            if (res.code) {
                message.error("初始化数据源失败 |" + res.message)
                SetTables([])
                return
            }
            SetTables(res.data)
        })
    }

    useEffect(() => {
        getDBInfo().then(res=>{
            SetDBSource(res.data.host)
            SetCurrentDB(res.data.database)
            console.log(res)
        })
        InitDatabaseTables()
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

    // 不允许自定义 PRI KEY 的值
    const handleRecordAdd = () => {
        const newData = lodash.cloneDeep(tableDatas[0]);
        for (let k in newData) {
            newData[k] = ""
        }
        let key = uid()
        newData[KeyField] = key
        setEditingKey(key)
        form.setFieldsValue({...newData})
        SetTableDatas([newData, ...tableDatas]);
    };

    const Refresh = () => {
        setLoading(true)
        const column = lodash.keyBy(fieldColumnsData, "Field")
        getTableDatas(selectedTable, {}).then(res => {
            res.data.forEach(item => {
                for (let v in item) {
                    if (['datetime', 'timestamp'].includes(column[v].Type)) {
                        item[v] = moment(item[v]).format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            })
            SetTableDatas(res.data)
            setTimeout(() => {
                setLoading(false)
            }, 500)
        })
    }


    useEffect(() => {
        if (typeof selectedTable == "string") {
            getTableDetail(selectedTable).then(res => {
                const findKey = (res.data as Array<any>).find(item => item.Key == 'PRI')
                console.log(findKey, findKey.Field)
                SetKeyField(findKey.Field)

                const keys = Object.keys(lodash.keyBy(res.data, "Field")).map(item => ({
                    title: item.charAt(0).toUpperCase()
                        + item.slice(1),  // 首字母大写
                    dataIndex: item,
                    key: item,
                    editable: true,
                }))
                SetTableColumns(keys)
                SetFieldColumnsData(res.data)
                const Filed2KeysMap = lodash.keyBy(res.data, "Field")
                return Filed2KeysMap
            }).then((column) => {
                getTableDatas(selectedTable, {}).then(res => {
                    res.data.forEach(item => {
                        for (let v in item) {
                            if (['datetime', 'timestamp'].includes(column[v].Type)) {
                                item[v] = moment(item[v]).format("YYYY-MM-DD HH:mm:ss")
                            }
                        }
                    })
                    SetTableDatas(res.data)
                    setLoading(false)
                })
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

    const switchView = () => {
        if (viewMode === 'DATA') {
            return (<div>
                <FlexStart>
                    <Button onClick={handleRecordAdd} type="primary" style={{margin: '0 5px'}}>
                        Add a Record
                    </Button>
                    <Button onClick={Refresh} type="primary" style={{margin: '0 5px'}}>
                        Refresh
                    </Button>、
                    <Button onClick={()=>SetQuerySqlVisible(true)} type="primary" style={{margin: '0 5px'}}>
                        Query
                    </Button>
                </FlexStart>
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
                           virtual
                           scroll={{ x: 1000, y: 700 }}
                           pagination={{
                               showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                               pageSize:1000,
                           }}
                    />
                </Form>
            </div>)
        }
        if (viewMode === "STRUCT") {
            return (
                <div>
                    <Table dataSource={fieldColumnsData} columns={fieldsColumns}/>
                </div>
            )
        }
        if (viewMode === "CREATETABLE") {
            return (
                <CreateTable></CreateTable>
            )
        }
    }

    const PreviewCreate = () => {
        if (!selectedTable || !fieldColumnsData || fieldColumnsData.length === 0) {
            return null;
        }

        let sql = `CREATE TABLE ${selectedTable} (\n`;

        for (let i = 0; i < fieldColumnsData.length; i++) {
            const field = fieldColumnsData[i];
            const fieldName = field.Field;
            const fieldType = field.Type;
            const allowNull = field.Null === 'YES' ? 'NULL' : 'NOT NULL';
            const primaryKey = field.Key === 'PRI' ? 'PRIMARY KEY' : '';
            const defaultValue = field.Default !== null ? `DEFAULT ${field.Default}` : '';
            const extra = field.Extra ? field.Extra : '';

            sql += `  ${fieldName} ${fieldType} ${allowNull} ${primaryKey} ${defaultValue} ${extra}`;

            // Add a comma if it's not the last field
            if (i < fieldColumnsData.length - 1) {
                sql += ',\n';
            }
        }

        sql += '\n);';

        Modal.confirm({
            title: "CREATE SQL",
            content: <Input.TextArea value={sql} style={{height: "300px"}}/>,
            cancelText: "取消",
            closable: true,
            width: 600,
            icon: <RadiusUprightOutlined/>
        })
    }

    const [open, setOpen] = useState(false);
    const [database, setDatabases] = useState([])
    const toggleDrawer = async (bool) => {
        if (bool === true) {
            const data = await showDatabases()
            if (data.code) {
                message.error("初始化数据库失败 |" + data.message)
                setDatabases([])
                return
            }
            setDatabases(data.data)
        }
        setOpen(bool);
    };

    const drawerStyles = {
        mask: {
            backdropFilter: 'blur(10px)',
        },
        content: {
            boxShadow: '-10px 0 10px #666',
        },
        header: {
            borderBottom: `1px solid red`,
        },
        body: {
            fontSize: 'large',
        },
        footer: {
            borderTop: `1px solid gray`,
        },
    };

    const handleResetDabase = (database) => {
        SetCurrentDB(database);
        resetDatabase({database, type: 1}).then(() => {
            InitDatabaseTables()
        })
    }

    const [isAddDataSourceOpen, SetIsAddDataSourceOpen] = useState(false);
    const [isSwitchDataSourceOpen, SetIsSwitchDataSourceOpen] = useState(false)
    // 这个函数将在Modal的确认按钮被点击时调用
    const handleAddDataSource = (formData) => {
        // 在这里处理添加数据源的逻辑，formData包含了表单数据
        console.log('Adding data source:', formData);

        // 关闭Modal
        SetIsAddDataSourceOpen(false);
    };

    const handleSwitchDataSourceModal = () => {
        InitDatabaseTables()
        SetIsSwitchDataSourceOpen(false)
    }

    const [isQuerySqlVisible,SetQuerySqlVisible] = useState(false);
    const [DBSource,SetDBSource] = useState('');
    const [currentDB,SetCurrentDB] = useState('')

    return (
        <Layout style={{height: '100vh'}}>
            <Sider width={200} style={{
                backgroundColor: 'white',
                overflow: 'auto',
                height: '100vh',
            }}>
                <Menu mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item>
                        <Button type={"link"} onClick={() => setViewMode("CREATETABLE")}> Create Table </Button>
                    </Menu.Item>
                    {myTables.map((table, index) => (

                        <Menu.Item key={table} onClick={() => {
                            setSelectedTable(table)
                            setViewMode("DATA")
                        }}>
                            <SpaceBetween>
                                <div style={{
                                    width: "80%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    wordWrap: "break-word"
                                }}>
                                    {table}
                                </div>
                                <div>
                                    <Popconfirm
                                        placement="right"
                                        title={'table [' + table + ']'}
                                        icon={<CopyFilled/>}
                                        description={
                                            <Menu>
                                                <Menu.Item>复制表</Menu.Item>
                                                <Menu.Item>复制表+数据</Menu.Item>
                                            </Menu>
                                        }
                                        showCancel={false}
                                    >
                                        <TableOutlined></TableOutlined>
                                    </Popconfirm>
                                </div>
                            </SpaceBetween>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Content style={{padding: '20px'}}>
                    {viewMode != "CREATETABLE" && (
                        <SpaceBetween>
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
                                <Button type={"dashed"} onClick={() => PreviewCreate()} style={{marginLeft: "10px"}}>
                                    PREVIEW
                                </Button>
                                <ExportToExcelButton
                                    dataSource={tableDatas}
                                    columns={[...mergedColumns, OperateColumn]}
                                    fileName={selectedTable}
                                />
                            </div>
                            <div>
                                <Button type={"primary"} style={{margin: '0 5px'}} onClick={() => toggleDrawer(true)}>Show
                                    DATABASES</Button>
                                <Button type="primary" style={{margin: '0 5px', backgroundColor: 'green'}}
                                        onClick={() => SetIsAddDataSourceOpen(true)}>Add DATASOURCE</Button>
                                <Button type="primary" style={{margin: '0 5px', backgroundColor: "orange"}}
                                        onClick={() => SetIsSwitchDataSourceOpen(true)}>Switch DATASOURCE</Button>
                            </div>
                        </SpaceBetween>
                    )}
                    <div style={{marginTop: '20px'}}>
                        {
                            <Spin spinning={loading} tip={"请选择表格"}>
                                {switchView()}
                            </Spin>
                        }
                    </div>
                </Content>
            </Layout>
            <Drawer
                title="Databases"
                placement="right"
                footer="Footer"
                onClose={() => toggleDrawer(false)}
                open={open}
                styles={drawerStyles}
            >
                <Menu>
                    {database.map((item, index) => {
                        return (
                            <Menu.Item key={item + index} onClick={() => handleResetDabase(item)}> {item}</Menu.Item>
                        )
                    })}
                </Menu>
            </Drawer>
            <AddDataSourceModal
                visible={isAddDataSourceOpen}
                onCancel={() => SetIsAddDataSourceOpen(false)}
                onAdd={handleAddDataSource}
            />
            <GetDataSourceModal
                visible={isSwitchDataSourceOpen}
                onCancel={handleSwitchDataSourceModal}
                onSet={(currentDB)=>SetDBSource(currentDB)}
            />
            <QuerySqlModal visible={isQuerySqlVisible} onQuery={()=>{}} onCancel={() => SetQuerySqlVisible(false)} source={DBSource} database={currentDB}></QuerySqlModal>
        </Layout>
    );
}

export default DatabaseManager;
