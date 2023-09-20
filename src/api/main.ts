import request from "../utils/request.ts";
import proxy from "../utils/proxy.ts";
import join from "../utils/join.ts";

// 关闭节点
export function ShutDown(port: number) {
    const data = {port}
    return request({
        url: "/main/shutdown",
        method: "post",
        data
    })
}

export function MakeDir(...args:string[]) {
    console.log(args)
    let dir = join(...args)
    console.log(dir)
    const data = {dir}
    return request({
        url: "/main/mkdir",
        method: "post",
        data
    })
}


export function Reload(port: number) {
    const data = {port: Number(port)}
    return request({
        url: "/main/reload",
        method: "post",
        data
    })
}

export function Touch(data: any, dir: string) {
    return request({
        url: "/main/touch",
        method: "post",
        data,
        params: {
            dir
        }
    })
}

export function getStats(pid) {
    return request({
        url: "/main/stats",
        method: "post",
        data: {
            pid
        }
    })
}

type UploadType = { dir: string; code: string; fileName: string };

export function UploadCode(data: UploadType) {
    return request({
        url: "/main/uploadcode",
        method: "post",
        data,
    })
}

export function UpdateCode(data: UploadType) {
    return request({
        url: "/main/updatecode",
        method: "post",
        data,
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

export function  CreateProject(data) {
    return request({
        url: "/main/project/create",
        method: "post",
        data
    })
}

export function  ReleasePkg(data) {
    return request({
        url: "/main/release/create",
        method: "post",
        data
    })
}

export async function getApiCallsCharts(port: string) {
    const options =  {
        title: {
            text: 'Function Run Count (Last 7 days)'
        },
        xAxis: {
            type: 'category',
            data: undefined // Sample data
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: undefined, // Sample data
            type: 'bar'
        }]
    };

    const body = {port}
    const data = await proxy({
        url: "/apicalls",
        method: "get",
        params:body
    }) as unknown as Array<{request_day:string,api_calls:string}>
    const xData = data.map(item=>item.request_day)
    const yData = data.map(item=>item.api_calls)
    options.xAxis.data = xData
    options.series[0].data = yData
    console.log('options',options)
    return options
}

export async function getTaroFile(data:{
    dir:string
}) {
    console.log('data',data)
    return request({
        url: "/main/taro/get",
        method: "post",
        data
    })
}

export async function touchTaroFile(data:{
    dir:string,
    content:string
}) {
    return request({
        url: "/main/taro/touch",
        method: "post",
        data
    })
}
