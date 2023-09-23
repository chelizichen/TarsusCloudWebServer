type CustomRequest = {
  requestType: Array<{ index: string; param: string; type: string }>;
  interFace: {
    returnType: string;
    methodName: string;
    requestType: string;
    responseType: string;
  };
};

const baseApiContent = (
  userTargetDir: string,
  customRequest?: CustomRequest
) => {
    if(!customRequest){
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

`;
    }else{
        const {interFace,requestType} = customRequest
        const SchemaInfo = `import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
// 这里需要你手动修改
import { load_schema } from "../../taro/${userTargetDir}";
const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: load_schema.get("${interFace.responseType}")
        },
        body: load_schema.get("${interFace.requestType}"),
    }
}
        `
        const types = requestType.map(item=>{
            const {param,type} = item;
            return `${param} : ${type};\n        `
        })
        const reqBodys = requestType.map(item=>item.param).join(",")

        const requestBody = `
const { ${reqBodys} } = request.body
        `

        const CustomRequestInfo = `
type CustomRequest = FastifyRequest<{
    Body: { 
        ${types.join("")}
    };
}>
        `

        const CustomFunctionInfo = `
const handleFunc = async (request: CustomRequest, reply: FastifyReply) => {
    ${requestBody}
    /**
    * finish your code
    */
    return {}
}
        `

        return `
${SchemaInfo}
${CustomRequestInfo}
${CustomFunctionInfo}
        `
    }

};

export { baseApiContent };
