import {Badge, Button, Card} from "antd";
import {useCallback, useState} from "react";
import {ApiConfig, ButtonType} from "../define";

type ElButtonProps = {
    type: ButtonType;
    text: string;
}

export function ElButton(props: ElButtonProps) {
    const {type, text} = props;
    const getButtonType = useCallback(() => {
        if (type == ButtonType.Main) {
            return 'primary'
        }
        if (type == ButtonType.Text) {
            return 'text'
        }
        if (type == ButtonType.Common) {
            return 'default'
        }
        return "primary"
    }, [type])
    return (
       <div>
           <Button type={getButtonType()}>{text || "按钮"}</Button>
       </div>
    )
}

type ApiProps = Partial<ApiConfig>

export function ApiComponent({url,text}:ApiProps) {
    return (
        <div style={{width:"200px"}}>
            <Badge.Ribbon text="HTTP" style={{width:70}}>
                <Card title={url || "Request"} size="small">
                    {text || 'body'}
                </Card>
            </Badge.Ribbon>
        </div>
    )
}