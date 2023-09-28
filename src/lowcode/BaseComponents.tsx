import {Badge, Button, Card, Table} from "antd";
import {useCallback, useState} from "react";
import {ApiConfig, ButtonConfig, ButtonType, TableConfig} from "../define";
import {ColumnsType} from "antd/es/table";


export function ElButton(props: ButtonConfig) {
    const {btnType, text} = props;
    const getButtonType = () => {
        if (btnType == ButtonType.Main) {
            return 'primary'
        }
        if (btnType == ButtonType.Text) {
            return 'text'
        }
        if (btnType == ButtonType.Common) {
            return 'default'
        }
        return "primary"
    }
    return (
        <div style={{margin: "0 5px"}}>
            <Button type={getButtonType()}>{text || "Button"}</Button>
        </div>
    )
}

export type ApiProps = Partial<ApiConfig>

export function ApiComponent({url, text}: ApiProps) {
    return (
        <div style={{width: "200px"}}>
            <Badge.Ribbon text="HTTP" style={{width: 70}}>
                <Card title={url || "Request"} size="small">
                    {text || 'body'}
                </Card>
            </Badge.Ribbon>
        </div>
    )
}

export function ElTable({uid}: TableConfig) {
    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
    ];
    return (
        <div style={{width: "200px"}}>
            <Table columns={columns} dataSource={data} size="middle" pagination={false} />
        </div>
    )
}