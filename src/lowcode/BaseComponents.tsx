import {Badge, Button, Card, Pagination, Table} from "antd";
import {useEffect, useState} from "react";
import {ApiConfig, ButtonConfig, ButtonType, PaginationConfig, TableConfig} from "../define";
import {ColumnsType} from "antd/es/table";


export function ElButton(props: ButtonConfig) {
    const {btnType, text} = props;
    const style:React.CSSProperties = {};
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
        if(btnType == ButtonType.CREATE){
            style.background = 'green'
            style.color = 'white'
        }
        return "primary"
    }
    return (
        <div style={{margin: "0 5px"}}>
            <Button style={style} type={getButtonType()}>{text || "Button"}</Button>
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

export function ElTable({uid,data,isOperate,isAlignCenter}: TableConfig) {
    const [columns,SetColumns] = useState([])
    const [sourceData,SetSourceData] = useState([])

    const [width,setWidth] = useState('')
    useEffect(() => {
        if(isOperate){
           setWidth("100%")
        }else {
            setWidth("200px")
        }
    }, []);
    useEffect(() => {
        if(data instanceof Array && data.length){
            SetColumns(data.map(item=>({title:item.columnName,dataIndex:item.filedName,align:isAlignCenter?'center':''})))
            const keys = data.map(item=>item.filedName)
            const testData = {}
            for(let v in keys){
                testData[keys[v]] = keys[v]
            }
            SetSourceData([testData])
        }else {
            SetColumns(demoColumns)
            SetSourceData(demoSourceData)
        }
    }, [data]);
    const demoColumns: ColumnsType<any> = [
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

    const demoSourceData = [
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
        <div style={{width:width}}>
            <Table columns={columns} dataSource={sourceData} size="middle" pagination={false} scroll={{ x: 'max-content' }} />
        </div>
    )
}

export function ElPagination({isOperate,url}:PaginationConfig){
    const [style,setStyle]:React.CSSProperties = useState()
    useEffect(()=>{
        const obj:React.CSSProperties = {}
        if(isOperate){
            obj.float = 'right';
            obj.margin = '20px';
            obj.width = '300px';
        }else {
            obj.width = '200px';
        }
        setStyle(obj)
    },[isOperate])
    return(
        <div style={{...style}}>
            <Badge count={url || 'api'}>
                <Pagination defaultCurrent={1} total={50} pageSize={10} size="small" />
            </Badge>
        </div>
    )
}