// define some lowcode component types

export enum ElementUIComponents{
    TABLE,
    SELECT,
    OPTIONS,
    PAGINATION
}

type PaginationConfig = {
    NameOfOffset:string; // will create vmodel
    NameOfSize:string; // will create vmodel
    QueryApi:string;
    uid:string;
    targetTableUid:string;
    type:ElementUIComponents.PAGINATION
}

type TableConfig = Array<{
    columnName:string;
    filedName:string;
    isAlignCenter:boolean;
    isBorder:boolean;
    uid:string;
    modelData:string;//will create vmodel
    type:ElementUIComponents.TABLE
}>

type ColumnDetailConfig = {
    targetTableUid:string;
    columnUid:string;
    row:string;
}

type SelectConfig = {
    uid:string;
    modelData:string;
    type:ElementUIComponents.SELECT
}

type OptionConfig = {
    NameOflabel:string;
    NameOfValue:string;
    type:ElementUIComponents.OPTIONS
}

enum ApiType{
    ADD,
    DELETE,
    UPDATE,
    SEARCH,
}

type ApiConfig={
    type:ApiType;
    uid:string;
    Table:string;
}

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

    CreateApi(config:ApiConfig):void
}




export class TarsusLowCode implements LowCodeMethods{
    private fileName:string;
    constructor(fileName:string){
        this.CreateView(fileName)
    }
    CreateApi(config: ApiConfig): void {
        throw new Error("Method not implemented.");
    }
    CreateView(fileName: string): void {
        this.fileName = fileName;
    }
    CreatePagination(config: PaginationConfig): void {
        throw new Error("Method not implemented.");
    }
    CreateTable(config: TableConfig): void {
        throw new Error("Method not implemented.");
    }
    SetTargetColumn(config: ColumnDetailConfig): void {
        throw new Error("Method not implemented.");
    }
    SetSelect(config: SelectConfig): void {
        throw new Error("Method not implemented.");
    }
    SetOption(config: OptionConfig): void {
        throw new Error("Method not implemented.");
    }
}
