import request from "../utils/request.ts";
import join from "../utils/join.ts";

export function getUserDir(dir:string){
    const user_dir = join('/api/',dir)
    return request({
        url:user_dir,
        method:'get',
    })
}