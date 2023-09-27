import request from "../utils/request.ts";

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