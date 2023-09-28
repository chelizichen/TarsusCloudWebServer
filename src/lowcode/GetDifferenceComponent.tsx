import {ApiComponent, ApiProps, ElButton, ElButtonProps, ElTable} from "./BaseComponents.tsx";
import {ElementUIComponents} from "../define.ts";

type differenceComponentProps = Partial<ElButtonProps & ApiProps & {isOperate:boolean}>
export default function GetDifferenceComponent(props:differenceComponentProps){
    const {type,...restProps} = props
    if(type === ElementUIComponents.API){
        return(
            <ApiComponent {...restProps}></ApiComponent>
        )
    }
    if(type === ElementUIComponents.BUTTON){
        return (
            <ElButton {...restProps}></ElButton>
        )
    }
    if(type === ElementUIComponents.TABLE){
        console.log('ElTable|restProps',restProps)
        restProps.isOperate = true
        return (
            <ElTable {...restProps}></ElTable>
        )
    }
}