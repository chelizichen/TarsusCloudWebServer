import {ApiComponent, ApiProps, ElButton, ElButtonProps, ElTable} from "./BaseComponents.tsx";
import {ElementUIComponents} from "../define.ts";

type differenceComponentProps = Partial<ElButtonProps & ApiProps>
export default function GetDifferenceComponent(props:differenceComponentProps){
    const {type,...restProps} = props
    if(type === ElementUIComponents.API){
        return(
            <ApiComponent {...restProps}></ApiComponent>
        )
    }
    if(type === ElementUIComponents.BUTTON){
        console.log('restProps',restProps)
        return (
            <ElButton {...restProps}></ElButton>
        )
    }
    if(type === ElementUIComponents.TABLE){
        return (
            <ElTable {...restProps}></ElTable>
        )
    }
}