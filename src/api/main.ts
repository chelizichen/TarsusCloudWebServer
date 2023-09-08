import request from "../utils/request.ts";

// 关闭节点
export function ShutDown(port: number) {
    const data = {port}
    return request({
        url: "/main/shutdown",
        method: "post",
        data
    })
}

export function Reload(port: number) {
    const data = {port}
    return request({
        url: "/main/reload",
        method: "post",
        data
    })
}

export function Touch(data: any) {
    return request({
        url: "/main/touch",
        method: "post",
        data
    })
}

export function UserDirs(id: string) {
    const data = {id}
    return request({
        url: "/main/userdirs",
        method: "post",
        data
    })
}
