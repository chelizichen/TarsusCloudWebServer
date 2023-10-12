import React, {useEffect, useRef, useState} from 'react';
import {Input, Select, Button, Table, Space, message, Checkbox} from 'antd';
import {useLocation} from "react-router-dom";
import {createTable} from "../api/main";
import {uid} from "uid";
import {KeyOutlined, BoxPlotOutlined} from '@ant-design/icons'

const {Option} = Select;

/**
 * todo {
 *     缺少小数点
 *     虚拟键
 *     主键
 *     备注
 *     填充零
 *     无符号
 *     自动递增
 * }
 * */
const CreateTable = () => {
    const [tableName, setTableName] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [fieldLength, setFieldLength] = useState('');
    const [allowNull, setAllowNull] = useState(true);
    const [isPrimary, serIsPrimary] = useState(false);
    const [fields, setFields] = useState([]);
    const [GenerateSql, SetGeneRateSql] = useState('')
    const location = useLocation()
    const [prefix, SetPrefix] = useState("")
    const [selectedFieldOptions, setSelectedFieldOptions] = useState([]);

    useEffect(() => {
        const search = new URLSearchParams(location.search)
        const dir = search.get("dir");
        SetPrefix(dir)
    }, [location])
    const addField = () => {
        if (fieldName && fieldType) {
            const newField = {
                name: fieldName,
                type: fieldType,
                length: fieldLength,
                allowNull,
                isPrimary,
                key: uid(),
                fieldOptions: selectedFieldOptions
            };
            setFields([...fields, newField]);
            setFieldName('');
            setFieldType('');
            setFieldLength('');
            setSelectedFieldOptions([])
        }
    };

    const deleteField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const columns = [
        {
            title: 'Field Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Data Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Length',
            dataIndex: 'length',
            key: 'length',
        },
        {
            title: 'Allow Null',
            dataIndex: 'allowNull',
            key: 'allowNull',
            render: (allowNull) => allowNull ? 'Yes' : 'No',
        },
        {
            title: 'Is Primary',
            dataIndex: 'isPrimary',
            key: 'isPrimary',
            render: (isPrimary) => isPrimary ? <KeyOutlined style={{color: "gold", fontWeight: "900"}}/> : 'No',
        },
        {
            title: 'Field Options',
            dataIndex: 'fieldOptions',
            key: 'fieldOptions',
            render: (options) => (
                <Checkbox.Group options={fieldOptions} defaultValue={options} disabled={true}/>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space size="middle">
                    <a onClick={() => deleteField(index)}>Delete</a>
                </Space>
            ),
        },
    ];

    const generateCreateTableSQL = (fields, tableName) => {
        if (!fields || fields.length === 0 || !tableName) {
            return null;
        }

        let sql = `CREATE TABLE ${tableName} ( \n`;

        let primary_keys = []

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const fieldName = field.name;
            const fieldType = field.type;
            const fieldLength = field.length ? `(${field.length})` : '';
            const allowNull = field.allowNull ? 'NULL' : 'NOT NULL';
            const fieldOptions = field.fieldOptions || []
            sql += `      ${fieldName} ${fieldType}${fieldLength} ${allowNull} ${fieldOptions.join(" ")}`;
            if (field.isPrimary) {
                primary_keys.push(field.name)
            }
            // Add a comma if it's not the last field
            if (i < fields.length - 1) {
                sql += ', \n';
            }
        }

        if (!primary_keys.length) {
            message.error("error:该表必须包含主键")
            return
        }
        sql += `, \n      PRIMARY KEY (${primary_keys.map(item => '`' + item + '`').join(",")})`

        sql += '\n);';
        SetGeneRateSql(sql)
        return sql;
    }

    const CreateTableRequest = async () => {
        const data = await createTable({createSql: GenerateSql})
        console.log(data)
    }
    const filterOption = (inputValue, option) => {
        return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
    };

    const fieldOptions = [
        {label: 'Auto Increment', value: 'AUTO_INCREMENT'},
        {label: 'Unsigned', value: 'UNSIGNED'},
        {label: 'Zero Fill', value: 'ZEROFILL'},
    ];

    const fieldOptionChange = (checkedValues: any[]) => {
        setSelectedFieldOptions(checkedValues);
    };

    return (
        <div>
            <h1>Create Table</h1>
            <div>
                <h2>Table Name:</h2>
                <Input
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                />
            </div>
            <h2>Add Field</h2>
            <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around'}}>
                <div>
                    <label>FieldName : &nbsp;</label>
                    <Input
                        placeholder="Field Name"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        style={{width: '200px'}}
                    />
                </div>
                <div>
                    <label>DataType : &nbsp;</label>
                    <Select
                        showSearch
                        placeholder="Data Type"
                        style={{width: 200}}
                        value={fieldType}
                        onChange={(value) => setFieldType(value)}
                        optionFilterProp="children" // 指定搜索的属性
                        filterOption={filterOption} // 自定义搜索逻辑
                    >
                        <Option value="INT">INT</Option>
                        <Option value="TINYINT">TINYINT</Option>
                        <Option value="SMALLINT">SMALLINT</Option>
                        <Option value="BIGINT">BIGINT</Option>
                        <Option value="FLOAT">FLOAT</Option>
                        <Option value="DOUBLE">DOUBLE</Option>
                        <Option value="DECIMAL">DECIMAL</Option>
                        <Option value="CHAR">CHAR</Option>
                        <Option value="VARCHAR">VARCHAR</Option>
                        <Option value="TEXT">TEXT</Option>
                        <Option value="DATE">DATE</Option>
                        <Option value="TIME">TIME</Option>
                        <Option value="DATETIME">DATETIME</Option>
                        <Option value="TIMESTAMP">TIMESTAMP</Option>
                        <Option value="YEAR">YEAR</Option>
                        <Option value="BOOLEAN">BOOLEAN</Option>
                        <Option value="ENUM">ENUM</Option>
                        <Option value="SET">SET</Option>
                        <Option value="BLOB">BLOB</Option>
                        <Option value="JSON">JSON</Option>
                    </Select>
                </div>
                <div>
                    <label>Length : &nbsp;</label>
                    <Input
                        placeholder="Length"
                        value={fieldLength}
                        onChange={(e) => setFieldLength(e.target.value)}
                        style={{width: '200px'}}
                    />
                </div>
                <div>
                    <label>Allow Null : &nbsp;</label>
                    <Select
                        style={{width: 120}}
                        value={allowNull}
                        onChange={(value) => setAllowNull(value)}
                    >
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
                    </Select>
                </div>
                <div>
                    <label>Primary : &nbsp;</label>
                    <Select
                        style={{width: 120}}
                        value={isPrimary}
                        onChange={(value) => serIsPrimary(value)}
                    >
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
                    </Select>
                </div>
                <div>
                    <label>Options : </label>
                    <Checkbox.Group options={fieldOptions} onChange={fieldOptionChange} value={selectedFieldOptions}
                                    style={{width: "200px"}}/>
                </div>
                <Button type="primary" onClick={addField}>Add Field</Button>
            </div>
            <div>
                <h2>Table Fields</h2>
                <Table dataSource={fields} columns={columns} bordered={true}/>
            </div>
            <div style={{marginTop: "20px"}}>
                <Button type="primary" onClick={() => generateCreateTableSQL(fields, tableName)}
                        style={{marginRight: "20px"}}>Generate Table SQL</Button>
                <Button type="primary" onClick={() => CreateTableRequest()}>Create TABLE</Button>
            </div>
            <div style={{padding: "20px", width: "80vw", height: "400px", backgroundColor: "white", marginTop: '20px'}}>
                <Input.TextArea style={{height: "300px"}} value={GenerateSql}></Input.TextArea>
            </div>
        </div>
    );
};

export default CreateTable;
