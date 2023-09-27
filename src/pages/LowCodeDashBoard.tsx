import React, { useState } from 'react';
import { Row, Col, Card, Button, Divider } from 'antd';
import {  useDrag, useDrop } from 'react-dnd';
import { ElButton } from '../lowcode/BaseComponents';
import { ButtonType, TarsusLowCode } from '../define';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DifferenceComponent from '../lowcode/DifferenceComponent';
import CreateFileComponent from '../lowcode/CreateFileComponent';

const ComponentTypes = {
  DRAGGABLE: 'draggableComponent',
};

const AvailableComponents = [
  { name: '按钮', id: '1',component:<ElButton type={ButtonType.Common} text={''}/> },
  // 添加更多可选组件
];

function DraggableComponent({ component }) {
  const [, ref] = useDrag({
    type: ComponentTypes.DRAGGABLE,
    item: { id: component.id, name: component.name,component:component.component },
  });

  return (
    <div ref={ref} style={{ marginBottom: '10px' }}>
      {component.component}
    </div>
  );
}

function LowCodeDashBoard() {
  const [addedComponents, setAddedComponents] = useState([]);
  const [isEditOpen,setEditOpen] = useState(false)
  const [uid,setUid] = useState('')
  const [fileUid,setFileUid] = useState('')
  // 创建后
  const [tarsusLowCode,SetTarsusLowCode] = useState<TarsusLowCode>({} as TarsusLowCode)
  const [, drop] = useDrop({
    accept: ComponentTypes.DRAGGABLE,
    drop: (item) => {
      console.log('item',item);
      // 当组件被拖拽到中间区域时，将其添加到已添加组件列表中
      setAddedComponents([...addedComponents, item]);
    },
  });

  const removeComponent = (componentId) => {
    // 从已添加组件列表中移除组件
    const updatedComponents = addedComponents.filter((c) => c.id !== componentId);
    setAddedComponents(updatedComponents);
  };
  const editComponent = (componentId) => {
    setUid(componentId)
  };
  const [isCreateFileOpen,SetIsCreateFileOpen] = useState(false)

  const handleCreate = (value)=>{
    const {fileName} = value
    const TarsusLowCodeInstance =  new TarsusLowCode(fileName)
    setFileUid(TarsusLowCodeInstance.FileConfig.fileUid)
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
        </Col>
        <Col span={16}>
          <Card
            title={<div>操作界面 - "{fileUid}"</div>}
            style={{ minHeight: '300px' }}
            bodyStyle={{ border: '1px dashed #ccc' }}
            ref={drop}
            extra={<Button onClick={()=>SetIsCreateFileOpen(true)} type={'link'}>创建组件</Button>}
          >
            {addedComponents.map((component) => (
              <div key={component.id}>
                {component.component}
              </div>
            ))}
          </Card>
        </Col>
        <Col span={4}>
          <Card title="已添加组件">
            {addedComponents.map((component) => (
              <div key={component.id}>
                {component.component}
                <Divider type="vertical" />
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => removeComponent(component.id)}
                />
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => editComponent(component.id)}
                  // 添加编辑组件的点击事件
                />
              </div>
            ))}
          </Card>
        </Col>
        <DifferenceComponent 
        isOpen={isEditOpen} 
        setOpen={setEditOpen}
        uid={uid}
        lowcodeComponent={tarsusLowCode}
        ></DifferenceComponent>
        
         <CreateFileComponent 
          isCreateFileOpen={isCreateFileOpen}
          SetIsCreateFileOpen={SetIsCreateFileOpen}
          handleCreate={handleCreate}
          ></CreateFileComponent>
      </Row>
  );
}

export default LowCodeDashBoard;
