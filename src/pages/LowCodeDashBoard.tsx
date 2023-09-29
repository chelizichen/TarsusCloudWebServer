import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Divider, Row, Tabs} from 'antd';
import {useDrag, useDrop, XYCoord} from 'react-dnd';
import {ApiComponent, ElButton, ElOption, ElPagination, ElSelection, ElTable} from '../lowcode/BaseComponents';
import {
    ApiConfig,
    ApiType,
    ButtonConfig,
    ButtonType,
    ElementPosition,
    ElementUIComponents, OptionConfig,
    PaginationConfig,
    SelectConfig,
    TableConfig,
    TarsusLowCode
} from '../define';
import {AndroidOutlined, AppleOutlined, EditOutlined} from '@ant-design/icons';
import {
    EditApiModal,
    EditButtonModal,
    EditTableModal, ElOptionModal,
    ElPaginationModal,
    ElSelectionModal
} from '../lowcode/EditModals.tsx';
import CreateFileComponent from '../lowcode/CreateFileComponent';
import {DeleteElement, GetElement, GetView, GetViews} from '../api/lowcode';
import SpaceBetween from "../components/SpaceBetween.tsx";
import GetDifferenceComponent from "../lowcode/GetDifferenceComponent.tsx";


const ComponentTypes = {
    DRAGGABLE: 'draggableComponent',
};

function isElementIn(clientOffset: XYCoord, elementRect) {
    return (clientOffset.x >= elementRect.left &&
        clientOffset.x <= elementRect.right &&
        clientOffset.y >= elementRect.top &&
        clientOffset.y <= elementRect.bottom)
}

const AvailableComponents = [
    {name: '按钮', type: ElementUIComponents.BUTTON, component: <ElButton btnType={ButtonType.Common} text={'按钮'}/>},
    {name: '接口', type: ElementUIComponents.API, component: <ApiComponent/>},
    {name: '表格', type: ElementUIComponents.TABLE, component: <ElTable/>},
    {name: '分页', type: ElementUIComponents.PAGINATION, component: <ElPagination/>},
    {name: '选择器', type: ElementUIComponents.SELECT, component: <ElSelection/>},
    {name: '选项框', type: ElementUIComponents.OPTIONS, component: <ElOption/>},
    // 添加更多可选组件
];

function DraggableComponent({component}) {
    const [, ref] = useDrag({
        type: ComponentTypes.DRAGGABLE,
        item: {name: component.name, type: component.type},
    });

    return (
        <div ref={ref} style={{marginBottom: '10px', display: 'inline-block'}}>
            {component.component}
        </div>
    );
}

function LowCodeDashBoard() {

    const TopElement: React.MutableRefObject<HTMLDivElement | undefined> = useRef<HTMLDivElement>();
    const TableElement: React.MutableRefObject<HTMLDivElement | undefined> = useRef<HTMLDivElement>();

    const [AllFiles, SetAllFiles] = useState([])
    useEffect(() => {
        GetViews().then(res => {
            SetAllFiles(res.data)
        })
    }, [])

    const [isButtonComponentOpen, setButtonComponentOpen] = useState(false)
    const [isApiComponentOpen, setApiComponentOpen] = useState(false)
    const [isTableComponentOpen, setIsTableComponentOpen] = useState(false)
    const [isPaginationComponentOpen, SetPaginationComponentOpen] = useState(false)
    const [isElSelectionComponentOpen, SetElSelectionComponentOpen] = useState(false)
    const [isElOptionComponentOpen, SetElOptionComponentOpen] = useState(false)

    const [activeKey,setActiveKey] = useState(0)
    const [uid, setUid] = useState('')
    const [fileUid, setFileUid] = useState('')

    const [TopContainers, SetTopContainers] = useState([])
    const [TableContainers, SetTableContainers] = useState([])

    // 组件Containers
    const [ButtonContainers, SetButtonContainers] = useState([])
    const [ApiContainers, SetApiContainers] = useState([])
    const [ElTablesContainers, SetElTablesContainers] = useState([])
    const [ElPaginationContainers, SetElPaginationContainers] = useState([])
    const [ElSelectContainers, SetElSelectContainers] = useState([])
    const [ElOptionContainers, SetElOptionContainers] = useState([])

    useEffect(() => {
        if (!fileUid) {
            return;
        }
        GetView(fileUid).then(res => {
            // 按钮
            const Buttons = res.data[ElementUIComponents.BUTTON] || []
            SetButtonContainers(Buttons)

            // API
            const Apis = res.data[ElementUIComponents.API] || []
            SetApiContainers(Apis)

            // 表格
            const Tables = res.data[ElementUIComponents.TABLE] || []
            SetElTablesContainers(Tables)

            // 选择器
            const Selections = res.data[ElementUIComponents.SELECT] || []
            SetElSelectContainers(Selections)

            // 选择器
            const Options = res.data[ElementUIComponents.OPTIONS] || []
            SetElOptionContainers(Options)


            // 分页处理
            const Paginations = res.data[ElementUIComponents.PAGINATION] || []
            const ElPaginationData =  Paginations.map(item=>{
                const {QueryApiUid=''} = item;
                const apiItem = Apis.find(item=>item.uid == QueryApiUid)
                item.url = apiItem?apiItem.url:'';
                return item
            })
            SetElPaginationContainers(ElPaginationData)
            return Apis
        }).then((Apis)=>{
            // 获取不同地方的元素
            GetElement(fileUid, ElementPosition.Table).then(res => {
                const tableElements = [...TableContainers, ...res.data].reverse().map(item=>{
                    const {QueryApiUid=''} = item;
                    const apiItem = Apis.find(item=>item.uid == QueryApiUid)
                    item.url = apiItem?apiItem.url:'';
                    return item
                })
                SetTableContainers(tableElements)
            })
            GetElement(fileUid, ElementPosition.Top).then(res => {
                SetTopContainers([...TopContainers, ...res.data].reverse())
            })
        })

    }, [fileUid])
    // 创建后
    const [tarsusLowCode, SetTarsusLowCode] = useState<TarsusLowCode>({} as TarsusLowCode)
    const [, drop] = useDrop({
        accept: ComponentTypes.DRAGGABLE,
        // 默认拖过来先
        drop: (item, monitor) => {
            if (!fileUid) {
                return
            }
            const dropPosition = monitor.getClientOffset() as XYCoord;
            const topElementRect = TopElement.current!.getBoundingClientRect();
            const tableElementRect = TableElement.current!.getBoundingClientRect();
            const isElementInTop = isElementIn(dropPosition, topElementRect)
            const isElementInTable = isElementIn(dropPosition, tableElementRect)
            let ElementData = undefined;
            if (item.type === ElementUIComponents.BUTTON) {
                const data: ButtonConfig = {
                    fileUid: fileUid,
                    click: '',
                    text: "按钮",
                    apiUid: '',
                    uid: '',
                    btnType: ButtonType.Main,
                    type: ElementUIComponents.BUTTON
                }
                tarsusLowCode.CreateButton(data);
                SetButtonContainers([...ButtonContainers, data])
                ElementData = data;
            }
            if (item.type === ElementUIComponents.API) {
                const data: ApiConfig = {
                    ApiType: ApiType.SEARCH,
                    uid: '',
                    targetUid: '',
                    type: ElementUIComponents.API,
                    fileUid: fileUid,
                    text: '请求',
                    url: "",
                }
                tarsusLowCode.CreateApi(data)
                SetApiContainers([...ApiContainers, data])
                ElementData = data;
            }
            if (item.type === ElementUIComponents.TABLE) {
                const data: TableConfig = {
                    text:"表格",
                    data:[],
                    modelData:'',
                    isBorder:true,
                    isAlignCenter:true,
                    type:ElementUIComponents.TABLE,
                    uid:'',
                    fileUid: fileUid,
                }
                tarsusLowCode.CreateTable(data)
                SetElTablesContainers([...ElTablesContainers, data])
                ElementData = data;
            }
            if (item.type === ElementUIComponents.PAGINATION) {
                const data: PaginationConfig = {
                    NameOfOffset: "offset",
                    NameOfSize: "size",
                    QueryApiUid: "",
                    fileUid: fileUid,
                    targetTableUid: "",
                    type: ElementUIComponents.PAGINATION,
                    uid: ""
                }
                tarsusLowCode.CreatePagination(data)
                const ElPaginationData = [...ElPaginationContainers, data].map(item=>{
                    const {QueryApiUid=''} = item;
                    if(QueryApiUid){
                        const apiItem = ApiContainers.find(item=>item.uid == QueryApiUid)
                        item.url = apiItem?apiItem.url:'';
                    }
                    return item
                })
                SetElPaginationContainers(ElPaginationData)
                ElementData = data;
            }
            if (item.type === ElementUIComponents.SELECT) {
                const data: SelectConfig = {
                    fileUid: fileUid,
                    modelData: "",
                    type: ElementUIComponents.SELECT,
                    uid: "",
                    mutilate:false,
                    targetOptionUid:''
                }
                tarsusLowCode.SetSelect(data)
                SetElSelectContainers([...ElSelectContainers, data])
                ElementData = data;
            }
            if (item.type === ElementUIComponents.OPTIONS) {
                const data: OptionConfig = {
                    NameOfLabel: "label",
                    NameOfValue: "value",
                    fileUid: fileUid,
                    options: [],
                    type: ElementUIComponents.OPTIONS,
                    targetApiUid:'',
                    uid: "",
                }
                tarsusLowCode.SetOption(data)
                SetElOptionContainers([...ElOptionContainers, data])
                ElementData = data;
            }
            isElementInTop && tarsusLowCode.AddTopElement(fileUid, ElementData)
            isElementInTable && tarsusLowCode.AddTableElement(fileUid, ElementData)
            isElementInTop && SetTopContainers([...TopContainers, ElementData])
            isElementInTable && SetTableContainers([...TableContainers, ElementData])

            TableElement.current!.style.background = 'unset'
            TopElement.current!.style.background = 'unset'

            // 当组件被拖拽到中间区域时，将其添加到已添加组件列表中
        },
        // hover 的过程中进行颜色判断
        hover: (item, monitor) => {
            // 获取拖拽的坐标信息
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) {
                return;
            }

            // 获取 TopElement 和 TableElement 的位置和尺寸信息
            const topElementRect = TopElement.current!.getBoundingClientRect();
            const tableElementRect = TableElement.current!.getBoundingClientRect();

            // 判断拖拽项是否在 TopElement 区域内
            if (
                isElementIn(clientOffset, topElementRect)
            ) {
                TopElement.current!.style.background = '#f8f8f8'
                TableElement.current!.style.background = 'unset'
            }

            // 判断拖拽项是否在 TableElement 区域内
            if (
                isElementIn(clientOffset, tableElementRect)
            ) {
                TopElement.current!.style.background = 'unset'
                TableElement.current!.style.background = '#f8f8f8'
            }
        },
    });

    const removeComponent = (componentId: string, type: ElementUIComponents) => {
        // 从已添加组件列表中移除组件
        if (ElementUIComponents.BUTTON == type) {
            const updatedComponents = ButtonContainers.filter((c) => c.uid !== componentId);
            SetButtonContainers(updatedComponents);
        }
        if (ElementUIComponents.API == type) {
            const updatedComponents = ApiContainers.filter((c) => c.uid !== componentId);
            SetApiContainers(updatedComponents);
        }
        if (ElementUIComponents.TABLE == type) {
            const updatedComponents = ElTablesContainers.filter((c) => c.uid !== componentId);
            SetElTablesContainers(updatedComponents);
        }

        if (ElementUIComponents.PAGINATION == type) {
            const updatedComponents = ElPaginationContainers.filter((c) => c.uid !== componentId);
            SetElPaginationContainers(updatedComponents);
        }

        if (ElementUIComponents.SELECT == type) {
            const updatedComponents = ElSelectContainers.filter((c) => c.uid !== componentId);
            SetElSelectContainers(updatedComponents);
        }

        if (ElementUIComponents.OPTIONS == type) {
            const updatedComponents = ElOptionContainers.filter((c) => c.uid !== componentId);
            SetElOptionContainers(updatedComponents);
        }

        const updateTopContainers = TopContainers.filter((c) => c.uid !== componentId);
        const updateTableContainers = TableContainers.filter((c) => c.uid !== componentId);

        let position = ''
        let findTableItem = TableContainers.find(item => item.uid == componentId)
        let findTopItem = TopContainers.find(item => item.uid == componentId)

        if (findTableItem) {
            position = ElementPosition.Table
        }
        if (findTopItem) {
            position = ElementPosition.Top
        }
        const data = {
            fileUid,
            position,
            config: findTableItem || findTopItem
        }

        SetTopContainers(updateTopContainers);
        SetTableContainers(updateTableContainers);
        DeleteElement(data)
    };
    const handleEditComponent = (componentId, type) => {
        setUid(componentId)
        if (type == ElementUIComponents.BUTTON) {
            setButtonComponentOpen(true)
        }
        if (type == ElementUIComponents.API) {
            setApiComponentOpen(true)
        }
        if (type == ElementUIComponents.TABLE) {
            setIsTableComponentOpen(true)
        }
        if (type == ElementUIComponents.PAGINATION) {
            SetPaginationComponentOpen(true)
        }
        if (type == ElementUIComponents.SELECT) {
            SetElSelectionComponentOpen(true)
        }
    };
    const [isCreateFileOpen, SetIsCreateFileOpen] = useState(false)

    const handleCreate = (value) => {
        const {fileName} = value
        const TarsusLowCodeInstance = new TarsusLowCode(fileName, {isNew: true, fileUid: ''})
        setActiveKey(0)
        setFileUid(TarsusLowCodeInstance.FileConfig.fileUid)
        SetTarsusLowCode(TarsusLowCodeInstance)
    }
    const handleSetFile = (item) => {
        setFileUid(item.fileUid)
        setActiveKey(0)
        const TarsusLowCodeInstance = new TarsusLowCode(item.fileName, {isNew: false, fileUid: item.fileUid})
        SetTarsusLowCode(TarsusLowCodeInstance)
    }
    const callBackEditFunc = (data: any, type: ElementUIComponents) => {
        const {uid} = data
        let position = ElementPosition.Table
        // 替换容器内的数据

        const updatedTableContainers = TableContainers.map((item) => {
            if (item.uid === uid) {
                // 找到要更新的元素，替换它
                position = ElementPosition.Table;
                return data;
            }
            return item;
        });

        const updatedTopContainers = TopContainers.map((item) => {
            if (item.uid === uid) {
                // 找到要更新的元素，替换它
                position = ElementPosition.Top;
                return data;
            }
            return item;
        });

        tarsusLowCode.UpdateElement(fileUid, position, data)

        SetTableContainers(updatedTableContainers);
        SetTopContainers(updatedTopContainers);

        const updatedButtonContainers = ButtonContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })

        const updatedApiContainers = ApiContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })

        const updatedElTableContainers = ElTablesContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })


        const updatedPaginationContainers = ElPaginationContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })

        const updatedSelectionContainers = ElSelectContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })

        const updatedOptionContrainers = ElOptionContainers.map(item => {
            if (item.uid === uid) {
                return data;
            }
            return item;
        })

        SetButtonContainers(updatedButtonContainers);
        SetApiContainers(updatedApiContainers);
        SetElTablesContainers(updatedElTableContainers);
        SetElSelectContainers(updatedSelectionContainers);
        SetElOptionContainers(updatedOptionContrainers);

        // 单独对分页做API处理
        const ElPaginationData = updatedPaginationContainers.map(item=>{
            const {QueryApiUid=''} = item;
            console.log('ApiContainers',ApiContainers)
            console.log('QueryApiUid',QueryApiUid)
            if(QueryApiUid){
                const apiItem = ApiContainers.find(item=>item.uid == QueryApiUid)
                item.url = apiItem?apiItem.url:'';
            }
            return item
        })
        SetElPaginationContainers(ElPaginationData)

    }
    return (
        <Row gutter={24}>
            <Col span={4}>
                <Card title="可选组件">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {AvailableComponents.map((component) => (
                            <div  key={component.name}
                                  style={{width:'100%',
                                      // border:'1px gray dashed',
                                      padding:'10px 5px',
                                      margin:'5px 0 ',
                                      // borderRadius:'10px',
                                      display:'flex',
                                      alignItems:'center',
                                      justifyContent:'center'
                            }}>
                             <DraggableComponent key={component.name} component={component}/>
                            </div>
                        ))}
                    </div>
                </Card>
            </Col>
            <Col span={15}>
                <Card
                    title={<div>操作界面 - "{fileUid}"</div>}
                    style={{minHeight: '800px'}}
                    bodyStyle={{border: '1px dashed #ccc'}}
                    ref={drop}
                    extra={<Button onClick={() => SetIsCreateFileOpen(true)} type={'link'}>创建组件</Button>}
                >
                    {/*顶部 包含按钮等*/}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        height: '100px',
                        width: '100%',
                        borderBottom: '1px dashed gray'
                    }} ref={TopElement}>
                        {TopContainers.filter(item=>item.type != ElementUIComponents.API).map(item => (
                            <GetDifferenceComponent {...item}></GetDifferenceComponent>
                        ))}
                    </div>

                    {/*表格组件*/}
                    <div ref={TableElement} style={{height: '600px', width: '100%'}}>
                        {TableContainers.filter(item=>item.type != ElementUIComponents.API).map(item => (
                            <GetDifferenceComponent {...item}></GetDifferenceComponent>
                        ))}
                    </div>
                </Card>
            </Col>
            <Col span={5}>
                <Tabs
                    activeKey={activeKey}
                    onTabClick={(key)=>setActiveKey(key)}
                    items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
                        let label, children;
                        if (i == 0) {
                            label = <span><Icon/>已添加</span>
                            children = (
                                <Card title="已添加组件">
                                    {ButtonContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ElButton {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.BUTTON)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                    {ElSelectContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ElSelection {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.SELECT)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                    {ElOptionContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ElOption {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.SELECT)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                    {ApiContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ApiComponent {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.API)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                    {ElTablesContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ElTable {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.TABLE)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                    {ElPaginationContainers.map((component) => (
                                        <SpaceBetween key={component.uid}>
                                            <ElPagination {...component}/>
                                            <div>
                                                <Divider type="vertical"/>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined/>}
                                                    onClick={() => handleEditComponent(component.uid, ElementUIComponents.PAGINATION)}
                                                    // 添加编辑组件的点击事件
                                                />
                                            </div>
                                        </SpaceBetween>
                                    ))}
                                </Card>
                            )
                        }
                        if (i == 1) {
                            label = <span><Icon/>所有 </span>
                            children = (
                                <Card title="所有文件">
                                    {AllFiles.map((item) => {
                                        return <Button key={item.fileUid} type={'primary'} onClick={() => handleSetFile(item)}>{item.fileName}</Button>
                                    })}
                                </Card>
                            )
                        }
                        return {
                            label,
                            key: i,
                            children,
                        };
                    })}
                />

            </Col>
            <EditButtonModal
                isButtonComponentOpen={isButtonComponentOpen}
                setButtonComponentOpen={setButtonComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
            ></EditButtonModal>
            <EditApiModal
                isApiComponentOpen={isApiComponentOpen}
                setApiComponentOpen={setApiComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
            ></EditApiModal>
            <EditTableModal
                isTableComponentOpen={isTableComponentOpen}
                setTableComponentOpen={setIsTableComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
            ></EditTableModal>
            <ElPaginationModal
                isPaginationComponentOpen={isPaginationComponentOpen}
                SetPaginationComponentOpen={SetPaginationComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
                TableData={ElTablesContainers}
            ></ElPaginationModal>

            <ElSelectionModal
                isSelectionComponentOpen={isElSelectionComponentOpen}
                SetSelectionComponentOpen={SetElSelectionComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
                TableData={ElTablesContainers}
            ></ElSelectionModal>

            <ElOptionModal
                isOptionComponentOpen={isElOptionComponentOpen}
                SetOptionComponentOpen={SetElOptionComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
                callBackEditFunc={callBackEditFunc}
                TableData={ElTablesContainers}
            ></ElOptionModal>

            <CreateFileComponent
                isCreateFileOpen={isCreateFileOpen}
                SetIsCreateFileOpen={SetIsCreateFileOpen}
                handleCreate={handleCreate}
            ></CreateFileComponent>
        </Row>
    );
}

export default LowCodeDashBoard;
