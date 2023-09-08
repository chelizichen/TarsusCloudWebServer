import request from "../utils/request.ts";
import join from "../utils/join.ts";

export function getUserContent(path:string){
    const user_dir = join('/api/',path)
    return request({
        url:user_dir,
        method:'get',
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