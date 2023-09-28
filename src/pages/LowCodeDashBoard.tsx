import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Row, Col, Card, Button, Divider} from 'antd';
import {useDrag, useDrop, XYCoord} from 'react-dnd';
import {ApiComponent, ElButton} from '../lowcode/BaseComponents';
import {ApiConfig, ApiType, ButtonConfig, ButtonType, ElementUIComponents, TarsusLowCode} from '../define';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {EditApiModal, EditButtonModal} from '../lowcode/EditModals.tsx';
import CreateFileComponent from '../lowcode/CreateFileComponent';
import {GetView, GetViews} from '../api/lowcode';
import SpaceBetween from "../components/SpaceBetween.tsx";


const ComponentTypes = {
    DRAGGABLE: 'draggableComponent',
};

function isElementIn(clientOffset:XYCoord,elementRect){
    return (clientOffset.x >= elementRect.left &&
    clientOffset.x <= elementRect.right &&
    clientOffset.y >= elementRect.top &&
    clientOffset.y <= elementRect.bottom)
}

const AvailableComponents = [
    {name: '按钮', type: ElementUIComponents.BUTTON, component: <ElButton type={ButtonType.Common} text={'按钮'}/>},
    {name: '接口', type: ElementUIComponents.API, component: <ApiComponent/>}
    // 添加更多可选组件
];

function DraggableComponent({component}) {
    const [, ref] = useDrag({
        type: ComponentTypes.DRAGGABLE,
        item: {name: component.name, type: component.type},
    });

    return (
        <div ref={ref} style={{marginBottom: '10px',display:'inline-block'}}>
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
    const [uid, setUid] = useState('')
    const [fileUid, setFileUid] = useState('')

    // 组件Containers
    const [ButtonContainers, SetButtonContainers] = useState([])
    const [ApiContainers, SetApiContainers] = useState([])
    useEffect(() => {
        if (!fileUid) {
            return;
        }
        GetView(fileUid).then(res => {
            const Buttons = res.data[ElementUIComponents.BUTTON]
            SetButtonContainers(Buttons)
            const Apis = res.data[ElementUIComponents.API]
            SetApiContainers(Apis)
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
            // todo 拖拽到指定的位置，然后我需要对他进行位置标注
            const dropPosition = monitor.getClientOffset();
            if (dropPosition) {
                const {x, y} = dropPosition;
                console.log(`拖拽到坐标：x=${x}, y=${y}`);
            }
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
                tarsusLowCode.CreateButton(data)
                SetButtonContainers([...ButtonContainers, data])
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
            }
            // 当组件被拖拽到中间区域时，将其添加到已添加组件列表中
        },
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
                isElementIn(clientOffset,topElementRect)
            ) {
                console.log('拖拽项在 TopElement 区域内');
                // 在这里执行 TopElement 区域的操作
            }

            // 判断拖拽项是否在 TableElement 区域内
            if (
                isElementIn(clientOffset,tableElementRect)
            ) {
                console.log('拖拽项在 TableElement 区域内');
                // 在这里执行 TableElement 区域的操作
            }
        },
    });

    const removeComponent = (componentId: string, type: ElementUIComponents) => {
        // 从已添加组件列表中移除组件
        if (ElementUIComponents.BUTTON == type) {
            const updatedComponents = ButtonContainers.filter((c) => c.uid !== componentId);
            SetButtonContainers(updatedComponents);
            // todo 添加删除的API
        }
    };
    const handleEditComponent = (componentId, type) => {
        setUid(componentId)
        if (type == ElementUIComponents.BUTTON) {
            setButtonComponentOpen(true)
        }
        if (type == ElementUIComponents.API) {
            setApiComponentOpen(true)
        }
    };
    const [isCreateFileOpen, SetIsCreateFileOpen] = useState(false)

    const handleCreate = (value) => {
        const {fileName} = value
        const TarsusLowCodeInstance = new TarsusLowCode(fileName, {isNew: true, fileUid: ''})
        setFileUid(TarsusLowCodeInstance.FileConfig.fileUid)
        SetTarsusLowCode(TarsusLowCodeInstance)
    }
    const handleSetFile = (item) => {
        setFileUid(item.fileUid)
        const TarsusLowCodeInstance = new TarsusLowCode(item.fileName, {isNew: false, fileUid: item.fileUid})
        SetTarsusLowCode(TarsusLowCodeInstance)
    }
    return (
        <Row gutter={24}>
            <Col span={4}>
                <Card title="可选组件">
                    {AvailableComponents.map((component) => (
                        <DraggableComponent key={component.name} component={component}/>
                    ))}
                </Card>
                <Card title="所有文件">
                    {AllFiles.map((item) => {
                        return <Button key={item.fileUid} type={'primary'}
                                       onClick={() => handleSetFile(item)}>{item.fileName}</Button>
                    })}
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
                        borderBottom:'1px dashed gray'
                    }} ref={TopElement}>

                    </div>

                    {/*表格组件*/}
                    <div ref={TableElement} style={{height: '600px', width: '100%'}}>

                    </div>
                </Card>
            </Col>
            <Col span={5}>
                <Card title="已添加组件">
                    {ButtonContainers.map((component) => (
                        <SpaceBetween key={component.uid}>
                            <ElButton type={ButtonType.Common} text={component.text}/>
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
                    {ApiContainers.map((component) => (
                        <SpaceBetween key={component.uid}>
                            <ApiComponent url={component.url} text={component.text}/>
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
                </Card>
            </Col>
            <EditButtonModal
                isButtonComponentOpen={isButtonComponentOpen}
                setButtonComponentOpen={setButtonComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
            ></EditButtonModal>
            <EditApiModal
                isApiComponentOpen={isApiComponentOpen}
                setApiComponentOpen={setApiComponentOpen}
                removeComponent={removeComponent}
                uid={uid}
                lowcodeComponent={tarsusLowCode}
                ApiData={ApiContainers}
            ></EditApiModal>
            <CreateFileComponent
                isCreateFileOpen={isCreateFileOpen}
                SetIsCreateFileOpen={SetIsCreateFileOpen}
                handleCreate={handleCreate}
            ></CreateFileComponent>
        </Row>
    );
}

export default LowCodeDashBoard;
