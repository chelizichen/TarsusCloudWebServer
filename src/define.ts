// define some lowcode component types
import  axios,{ AxiosInstance, AxiosRequestConfig} from 'axios';
import {uid} from 'uid';
import useStore from "./store";

export enum ElementUIComponents{
    TABLE,
    SELECT,
    OPTIONS,
    PAGINATION,
    API,
    BUTTON
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
        type:ElementUIComponents.TABLE;
    }>;
    modelData:string;//will create vmodel
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

export enum ButtonType{
    Main,
    Common,
    Text
}

export type ButtonConfig = {
    click:string;
    uid:string;
    btnType:ButtonType;
    apiUid:string;
    text:string;
    type:ElementUIComponents.BUTTON
} & Pick<FileConfig,"fileUid">

export enum ApiType{
    ADD,
    DELETE,
    UPDATE,
    SEARCH,
}

export type ApiConfig = {
    ApiType:ApiType;
    uid:string;
    targetUid:string;
    text:string;
    type:ElementUIComponents.API;
    url:string;
} & Pick<FileConfig,"fileUid">

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

    CreateButton(config:ButtonConfig):ButtonConfig;

    // 设置表格对应的Formatter、Link、Button
    SetTargetColumn(config:ColumnDetailConfig):void;

    // 设置Select
    SetSelect(config:SelectConfig):void;

    SetOption(config:OptionConfig):void;

    CreateApi(config:ApiConfig):void;

    GetView(uid:string):Promise<unknown>;

    GetViewList():Promise<Array<FileConfig>>;

    DeleteComponent(fileUid,uid):void;
}


class BaseComponent{
    private AxiosInst:AxiosInstance
    constructor(){
        this.AxiosInst = axios.create({    
            baseURL: '/primary/main/lowcode/', // api的base_url
            timeout: 15000, // 请求超时时间})
            method:'post'
        })
        this.AxiosInst.interceptors.request.use(function(config){
            const state = useStore.getState() as Record<string,string>
            config.headers.set("X-Target-Port",state.invokePort)
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

    public FileConfig:FileConfig;

    constructor(fileName:string,config:{
        isNew:boolean;
        fileUid:string;
    }){
        super();
        this.FileConfig = {} as FileConfig
        if(config.isNew){
            this.CreateView(fileName)
        }else{
            this.FileConfig.fileName = fileName;
            this.FileConfig.fileUid = config.fileUid;
        }
    }
    CreateButton(config: ButtonConfig): ButtonConfig {
        config.uid = this.getUid()
        this.request({
            url:'CreateButton',
            data:config
        })
        return config
    }
    async GetViewList(): Promise<FileConfig[]> {
        const ret = await this.request({
            url:'GetViewList',
        }) as unknown as Record<string,any>
        return ret.data as FileConfig[]
    }
    async GetView(uid: string): Promise<unknown> {
        const data = {
            uid
        }
        const ret = await this.request({
            url:'GetView',
            data
        })
        return ret
    }
    CreateApi(config: ApiConfig): void {
        config.uid = this.getUid()
        this.request({
            url:'CreateApi',
            data:config
        })
    }
    CreateView(fileName: string): void {
        const data:FileConfig = {
            fileName,
            fileUid:this.getUid()
        }
        this.FileConfig = data;
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

    DeleteComponent(fileUid, uid): void {
        const data = {
            fileUid,
            uid
        }
        this.request({
            url:'DeleteComponent',
            data:data
        })
    }
}
