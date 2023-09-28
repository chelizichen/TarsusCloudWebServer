import request from "../utils/request.ts";
import {ElementPosition} from "../define.ts";

// 查询所有文件
export function GetViews() {
    return request({
        url: "/main/lowcode/GetViews",
        method: "post",
    })
}

// 查询文件下所有组件
export function GetView(fileUid) {
    const data = {
        uid:fileUid
    }
    return request({
        url: "/main/lowcode/GetView",
        method: "post",
        data
    })
}

export function GetElement(fileUid,position:ElementPosition){
    const data = {
        fileUid,
        position
    }
    return request({
        url: "/main/lowcode/GetElement",
        method: "post",
        data
    })
}

export function DeleteElement(data){
    return request({
        url: "/main/lowcode/DeleteElement",
        method: "post",
        data
    })
}