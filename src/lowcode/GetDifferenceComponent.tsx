import {ApiComponent, ApiProps, ElButton, ElButtonProps} from "./BaseComponents.tsx";
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
        return (
            <ElButton {...restProps}></ElButton>
        )
    }
    return(
        <ElButton {...restProps}></ElButton>
    )
}