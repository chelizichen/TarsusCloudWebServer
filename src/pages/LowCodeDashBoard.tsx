import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Divider } from 'antd';
import {  useDrag, useDrop } from 'react-dnd';
import { ApiComponent, ElButton } from '../lowcode/BaseComponents';
import { ApiConfig, ApiType, ButtonConfig, ButtonType, ElementUIComponents, TarsusLowCode } from '../define';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {ButtonComponent} from '../lowcode/DifferenceComponent';
import CreateFileComponent from '../lowcode/CreateFileComponent';
import { GetView, GetViews } from '../api/lowcode';


const ComponentTypes = {
  DRAGGABLE: 'draggableComponent',
};


const AvailableComponents = [
  { name: '按钮',type:ElementUIComponents.BUTTON,component:<ElButton type={ButtonType.Common} text={'按钮'}/> },
  { name: '接口',type:ElementUIComponents.API,component:<ApiComponent />}
  // 添加更多可选组件
];

function DraggableComponent({ component }) {
  const [, ref] = useDrag({
    type: ComponentTypes.DRAGGABLE,
    item: { name: component.name,type:component.type },
  });

  return (
    <div ref={ref} style={{ marginBottom: '10px' }}>
      {component.component}
    </div>
  );
}

function LowCodeDashBoard() {
  const [AllFiles,SetAllFiles] = useState([])
  useEffect(()=>{
    GetViews().then(res=>{
      SetAllFiles(res.data)
    })
  },[])

  const [isButtonComponentOpen,setButtonComponentOpen] = useState(false)
  const [uid,setUid] = useState('')
  const [fileUid,setFileUid] = useState('')

  // 组件Containers
  const [ButtonContainers,SetButtonContainers] = useState([])
  const [ApiContainers,SetApiContainers] = useState([])
  useEffect(()=>{
    if(!fileUid){
      return;
    }
    GetView(fileUid).then(res=>{
      const Buttons = res.data[ElementUIComponents.BUTTON]
      SetButtonContainers(Buttons)
      const Apis = res.data[ElementUIComponents.API]
      SetApiContainers(Apis)
    })
  },[fileUid])
  // 创建后
  const [tarsusLowCode,SetTarsusLowCode] = useState<TarsusLowCode>({} as TarsusLowCode)
  const [, drop] = useDrop({
    accept: ComponentTypes.DRAGGABLE,
    // 默认拖过来先
    drop: (item) => {
      if(!fileUid){
        return
      }
      if(item.type === ElementUIComponents.BUTTON){
        const data:ButtonConfig = {
          fileUid:fileUid,
          click:'',
          text:"按钮",
          apiUid:'',
          uid:'',
          btnType:ButtonType.Main,
          type:ElementUIComponents.BUTTON
        }
        tarsusLowCode.CreateButton(data)
        SetButtonContainers([...ButtonContainers,data])
      }
      if(item.type === ElementUIComponents.API){
        const data:ApiConfig = {
            ApiType:ApiType.SEARCH,
            uid:'',
            targetUid:'',
            type:ElementUIComponents.API,
            fileUid:fileUid
        }
        tarsusLowCode.CreateApi(data)
        SetApiContainers([...ApiContainers,data])
      }
      // 当组件被拖拽到中间区域时，将其添加到已添加组件列表中
    },
  });

  const removeComponent = (componentId:string,type:ElementUIComponents) => {
    // 从已添加组件列表中移除组件
    if(ElementUIComponents.BUTTON == type){
      const updatedComponents = ButtonContainers.filter((c) => c.uid !== componentId);
      SetButtonContainers(updatedComponents);
      // todo 添加删除的API
    }
  };
  const handleEditButtonComponent = (componentId) => {
    setUid(componentId)
    setButtonComponentOpen(true)
  };
  const [isCreateFileOpen,SetIsCreateFileOpen] = useState(false)

  const handleCreate = (value)=>{
    const {fileName} = value
    const TarsusLowCodeInstance =  new TarsusLowCode(fileName,{isNew:true,fileUid:''})
    setFileUid(TarsusLowCodeInstance.FileConfig.fileUid)
    SetTarsusLowCode(TarsusLowCodeInstance)
  }
  const handleSetFile = (item)=>{
    setFileUid(item.fileUid)
    const TarsusLowCodeInstance = new TarsusLowCode(item.fileName,{isNew:false,fileUid:item.fileUid})
    SetTarsusLowCode(TarsusLowCodeInstance)
  }
  return (
      <Row gutter={24}>
        <Col span={4}>
          <Card title="可选组件">
            {AvailableComponents.map((component) => (
              <DraggableComponent key={component.id} component={component} />
            ))}
          </Card>
          <Card title="所有文件">
            {AllFiles.map((item)=>{
              return <Button key={item.fileUid} type={'primary'} onClick={()=>handleSetFile(item)}>{item.fileName}</Button>
            })}
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title={<div>操作界面 - "{fileUid}"</div>}
            style={{ minHeight: '300px' }}
            bodyStyle={{ border: '1px dashed #ccc' }}
            ref={drop}
            extra={<Button onClick={()=>SetIsCreateFileOpen(true)} type={'link'}>创建组件</Button>}
          >
          </Card>
        </Col>
        <Col span={4}>
          <Card title="已添加组件">
            {ButtonContainers.map((component) => (
              <div key={component.uid}>
                <ElButton type={ButtonType.Common} text={component.text}/>
                <Divider type="vertical" />
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => removeComponent(component.uid,ElementUIComponents.BUTTON)}
                />
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditButtonComponent(component.uid)}
                  // 添加编辑组件的点击事件
                />
              </div>
            ))}
            {ApiContainers.map((component) => (
              <div key={component.uid}>
                <ApiComponent />
                <Divider type="vertical" />
                {/* <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => removeComponent(component.uid,ElementUIComponents.BUTTON)}
                />
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditButtonComponent(component.uid)}
                  // 添加编辑组件的点击事件
                /> */}
              </div>
            ))}
          </Card>
        </Col>
        <ButtonComponent 
        isButtonComponentOpen={isButtonComponentOpen} 
        setButtonComponentOpen={setButtonComponentOpen}
        uid={uid}
        lowcodeComponent={tarsusLowCode}
        ></ButtonComponent>
         <CreateFileComponent 
          isCreateFileOpen={isCreateFileOpen}
          SetIsCreateFileOpen={SetIsCreateFileOpen}
          handleCreate={handleCreate}
          ></CreateFileComponent>
      </Row>
  );
}

export default LowCodeDashBoard;
