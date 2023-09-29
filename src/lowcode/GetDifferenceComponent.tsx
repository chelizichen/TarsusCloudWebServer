import {ApiComponent, ApiProps, ElButton, ElOption, ElPagination, ElSelection, ElTable} from "./BaseComponents.tsx";
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
        console.log('PAGINATION',props)
        return (
            <ElPagination {...restProps}></ElPagination>
        )
    }
    if(type === ElementUIComponents.SELECT){
        restProps.isOperate = true
        console.log('SELECT',props)
        return (
            <ElSelection {...restProps}></ElSelection>
        )
    }
    if(type === ElementUIComponents.OPTIONS){
        restProps.isOperate = true
        console.log('SELECT',props)
        return (
            <ElOption {...restProps}></ElOption>
        )
    }
}