// define some lowcode component types
import  axios,{ AxiosInstance, AxiosRequestConfig} from 'axios';
import {uid} from 'uid';

export enum ElementUIComponents{
    TABLE,
    SELECT,
    OPTIONS,
    PAGINATION,
    API
}

type FileConfig = {
    fileName:string;
    fileUid:string
}

type PaginationConfig = {
    NameOfOffset:string; // will create vmodel
    NameOfSize:string; // will create vmodel
    QueryApi:string;
    uid:string;
    targetTableUid:string;
    type:ElementUIComponents.PAGINATION
} & FileConfig

type TableConfig = {
    data:Array<{
        columnName:string;
        filedName:string;
        isAlignCenter:boolean;
        isBorder:boolean;
        columnUid:string;
        modelData:string;//will create vmodel
        type:ElementUIComponents.TABLE;
    }>;
    uid:string;
} & FileConfig;

type ColumnDetailConfig = {
    targetTableUid:string;
    uid:string;
    row:string;
} & FileConfig

type SelectConfig = {
    uid:string;
    modelData:string;
    type:ElementUIComponents.SELECT
} & FileConfig

type OptionConfig = {
    NameOflabel:string;
    NameOfValue:string;
    type:ElementUIComponents.OPTIONS
    uid:string;
} & FileConfig

enum ApiType{
    ADD,
    DELETE,
    UPDATE,
    SEARCH,
}

type ApiConfig={
    ApiType:ApiType;
    uid:string;
    targetUid:string;
    type:ElementUIComponents.API
} & FileConfig

enum ComponentStatus{
    Undefined,
    Created,
    Seted
}



interface LowCodeMethods{
    // 创建视图
    CreateView(fileName:string):void;

    // 设置分页
    CreatePagination(config:PaginationConfig):void;

    // 设置表格
    CreateTable(config:TableConfig):void;

    // 设置表格对应的Formatter、Link、Button
    SetTargetColumn(config:ColumnDetailConfig):void;

    // 设置Select
    SetSelect(config:SelectConfig):void;

    SetOption(config:OptionConfig):void;

    CreateApi(config:ApiConfig):void;

    GetView(uid:string):Promise<unknown>;
}


class BaseComponent{
    private AxiosInst:AxiosInstance
    constructor(){
        this.AxiosInst = axios.create({    
            baseURL: '/proxy/LowCodeServer/', // api的base_url
            timeout: 15000, // 请求超时时间})
            method:'post'
        })
        this.AxiosInst.interceptors.request.use(function(config){
            config.headers.set("X-Target-Port",10022);
            return config;
        })
        this.AxiosInst.interceptors.response.use(response => {
            return response.data
        })
    }
    public getUid(){
        return uid()
    }

    public request(config:AxiosRequestConfig){
        return this.AxiosInst(config);
    }
}


export class TarsusLowCode extends BaseComponent implements LowCodeMethods {

    constructor(fileName:string){
        super();
        this.CreateView(fileName)
    }
    async GetView(uid: string): Promise<unknown> {
        const data = {
            uid
        }
        const ret = await this.request({
            url:'CreateView',
            data
        })
        return ret
    }
    CreateApi(config: ApiConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'CreateTable',
            data:config
        })
    }
    CreateView(fileName: string): void {
        const data:FileConfig = {
            fileName,
            fileUid:this.getUid()
        }
        this.request({
            url:'CreateView',
            data
        })
        // Todo:创建Redis-Record
    }
    CreatePagination(config: PaginationConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'CreatePagination',
            data:config
        })
    }
    CreateTable(config: TableConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'CreateTable',
            data:config
        })
    }
    SetTargetColumn(config: ColumnDetailConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'SetTargetColumn',
            data:config
        })
    }
    SetSelect(config: SelectConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'SetSelect',
            data:config
        })
    }
    SetOption(config: OptionConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'SetOption',
            data:config
        })
    }
}
