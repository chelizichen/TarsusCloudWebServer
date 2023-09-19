const baseApiContent = `
import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                    code:{
                        type:"number"
                    },
                    data:{
                        type:"object"
                    }
                }
            }
        },
        body: {
            userId:{
                type:"string"
            }
        },
        queryString:{
            userId:{
                type:"number"
            }
        }
    }
}

type CustomRequest = FastifyRequest<{
    Body: { userId: string };
}>

const handleFunc = async (request: CustomRequest, reply: FastifyReply) => {
    const {userId} =  request.body;
    /**
    * finish your code
    */
    return {
        code:0,
        message:'success',
        data:{}
    }
}

export default [opts, handleFunc]

`

export {
    baseApiContent
}