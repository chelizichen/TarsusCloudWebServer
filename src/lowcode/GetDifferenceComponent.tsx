import {
    ApiComponent,
    ApiProps,
    ElButton,
    ElOption,
    ElPagination,
    ElSelection,
    ElTable,
    ElTimePicker
} from "./BaseComponents.tsx";
import {ButtonConfig, ElementUIComponents} from "../define.ts";

type differenceComponentProps = Partial<ButtonConfig & ApiProps & {isOperate:boolean}>
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
        restProps.isOperate = true
        return (
            <ElTable {...restProps}></ElTable>
        )
    }
    if(type === ElementUIComponents.PAGINATION){
        restProps.isOperate = true
        return (
            <ElPagination {...restProps}></ElPagination>
        )
    }
    if(type === ElementUIComponents.SELECT){
        restProps.isOperate = true
        return (
            <ElSelection {...restProps}></ElSelection>
        )
    }
    if(type === ElementUIComponents.OPTIONS){
        restProps.isOperate = true
        return (
            <ElOption {...restProps}></ElOption>
        )
    }
    if(type === ElementUIComponents.TIMEPICKER){
        restProps.isOperate = true
        return (
            <ElTimePicker></ElTimePicker>
        )
    }
}