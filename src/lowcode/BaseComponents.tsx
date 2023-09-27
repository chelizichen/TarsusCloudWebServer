import { Badge, Button, Card } from "antd";
import { useCallback, useState } from "react";
import { ButtonType } from "../define";

type ElButtonProps = {
    type:ButtonType;
    text:string;
}
export function ElButton(props:ElButtonProps){
    const {type,text} = props;
    const getButtonType = useCallback(()=>{
        if(type == ButtonType.Main){
            return 'primary' 
        }
        if(type == ButtonType.Text){
            return 'text'
        }
        if(type == ButtonType.Common){
            return 'default'
        }
        return "primary"
    },[type])
    return (
        <Button type={getButtonType()}>{text || "按钮"}</Button>
    )
}

export function ApiComponent(){
    return(
        <Badge.Ribbon text="Http">
        <Card title="Request" size="small">
          body
        </Card>
      </Badge.Ribbon>
    )
}