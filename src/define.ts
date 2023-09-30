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
    BUTTON,
    TIMEPICKER
}

type FileConfig = {
    fileName:string;
    fileUid:string
}

export type PaginationConfig = {
    NameOfOffset:string; // will create vmodel
    NameOfSize:string; // will create vmodel
    QueryApiUid:string;
    uid:string;
    targetTableUid:string;
    type:ElementUIComponents.PAGINATION
} & Pick<FileConfig, 'fileUid'>

export type TableConfig = {
    data:Array<{
        columnName:string;
        filedName:string;
        columnUid:string;
    }>;
    modelData:string;//will create vmodel
    uid:string;
    text:string;
    isBorder:boolean;
    isAlignCenter:boolean;
    type:ElementUIComponents.TABLE;
} & Pick<FileConfig, 'fileUid'>;

type ColumnDetailConfig = {
    targetTableUid:string;
    uid:string;
    row:string;
} & FileConfig

export type SelectConfig = {
    uid:string;
    modelData:string;
    type:ElementUIComponents.SELECT;
    mutilate:boolean;
    targetOptionUid:string;
} & Pick<FileConfig, 'fileUid'>

// 有些情况下，需要配合表格的属性来使用
// 比如后台返回枚举值的时候，通过选项框，直接找到对应的数据

export type OptionConfig = {
    NameOfLabel:string;
    NameOfValue:string;
    type:ElementUIComponents.OPTIONS;
    // 当ApiUid 不存在时，options 默认生效,
    // 必须为 Array<{label:string,value:any}>的形式
    options:Array<any>;
    uid:string;
    targetApiUid:string; // 如果有ApiUid,则认为是从API取值
} & Pick<FileConfig, 'fileUid'>

export enum ButtonType{
    Main,
    Common,
    Text,
    CREATE
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
    LINK,
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
    Setted
}

export enum ElementPosition {
    Top = "TopElement",
    Table = "TableElement"
}

type ElementConfig = {
    fileUid: string;
    position: ElementPosition;
    config: Record<string, any> & {
        uid:string
    }
}

export type TimePickerConfig = {
    uid:string;
    modelData:string; // 自动生成 startTime 和 endTime
} & Pick<FileConfig,"fileUid">


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

    AddTopElement(fileUid:string,anyConfig:any):void;

    AddTableElement(fileUid:string,anyConfig:any):void;

    UpdateElement(fileUid:string,position:ElementPosition,config:any):void;

    CreateTimePicker(config:TimePickerConfig):void;
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
    CreateButton(config: ButtonConfig,isUpdate?:boolean): ButtonConfig {
        if(!isUpdate){
            config.uid = this.getUid()
        }
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
    CreateApi(config: ApiConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
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
    CreatePagination(config: PaginationConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
        this.request({
            url:'CreatePagination',
            data:config
        })
    }
    CreateTable(config: TableConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
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
    SetSelect(config: SelectConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
        this.request({
            url:'SetSelect',
            data:config
        })
    }
    SetOption(config: OptionConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
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

    AddTableElement(fileUid:string,anyConfig: any): void {
        const data:ElementConfig = {
            fileUid,
            position:ElementPosition.Table,
            config:anyConfig
        }
        this.request({
            url:'AddElement',
            data
        })
    }

    AddTopElement(fileUid:string,anyConfig: any): void {
        const data:ElementConfig = {
            fileUid,
            position:ElementPosition.Top,
            config:anyConfig
        }
        this.request({
            url:'AddElement',
            data
        })
    }

    UpdateElement(fileUid: string, position: ElementPosition, config: any): void {
        const data = {
            fileUid,
            position,
            config,
        }
        this.request({
            url:'UpdateElement',
            data
        })
    }

    CreateTimePicker(config: TimePickerConfig,isUpdate?:boolean): void {
        if(!isUpdate){
            config.uid = this.getUid()
        }
        this.request({
            url:'CreateTimePicker',
            data:config
        })
    }
}
