import React, {useState} from 'react';
import {Input, Select, Button, Table, Space} from 'antd';

const {Option} = Select;

const CreateTable = () => {
    const [tableName, setTableName] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [fieldLength, setFieldLength] = useState('');
    const [allowNull, setAllowNull] = useState(true);
    const [fields, setFields] = useState([]);

    const addField = () => {
        if (fieldName && fieldType) {
            const newField = {
                name: fieldName,
                type: fieldType,
                length: fieldLength,
                allowNull,
            };
            setFields([...fields, newField]);
            setFieldName('');
            setFieldType('');
            setFieldLength('');
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
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space size="middle">
                    <a onClick={() => deleteField(index)}>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Create Table</h1>
            <div>
                <label>Table Name:</label>
                <Input
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                />
            </div>
            <h2>Add Field</h2>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
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
                        placeholder="Data Type"
                        style={{width: 200}}
                        value={fieldType}
                        onChange={(value) => setFieldType(value)}

                    >
                        <Option value="string">String</Option>
                        <Option value="number">Number</Option>
                        <Option value="boolean">Boolean</Option>
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
                <Button type="primary" onClick={addField}>Add Field</Button>
            </div>
            <div>
                <h2>Table Fields</h2>
                <Table dataSource={fields} columns={columns}/>
            </div>
            <div>
                <Button type="primary">Save Table</Button>
            </div>
        </div>
    );
};

export default CreateTable;
