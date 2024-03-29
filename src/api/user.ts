import request from "../utils/request.ts";
import join from "../utils/join.ts";
import proxy from "../utils/proxy.ts";

export function getUserContent(path:string){
    const user_dir = join('/api/',path)
    return request({
        url:user_dir,
        method:'get',
    })
}

export function invokeFunction(path:string,data:Record<string, any>){
    const user_dir = join('/proxy/',path).replace(".js","")
    return proxy({
        url:user_dir,
        method:'post',
        data
    })
}

export function getPortLog(port:string){
    return proxy({
        url:"/performance",
        method:'get',
        params:{
            port
        }
    })
}

export function login(user_name:string,password:string){
    const data = {
        user_name,password
    }
    return request({
        url:'/main/login',
        method:'post',
        data
    })
}