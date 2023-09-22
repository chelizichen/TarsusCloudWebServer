const baseApiContent = (userTargetDir:string)=>{
    return `
import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
// 这里需要你手动修改
import { load_schema } from "../../taro/${userTargetDir}";
const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: load_schema.get("QueryIdReq")
        },
        body: load_schema.get("BaseResponse"),
    }
}

type CustomRequest = FastifyRequest<{
    Body: { id: string };
}>

const handleFunc = async (request: CustomRequest, reply: FastifyReply) => {
    const {id} =  request.body;
    /**
    * finish your code
    */
    return {
        code:id,
        message:'success',
    }
}

export default [opts, handleFunc]

`
}

export {
    baseApiContent
}