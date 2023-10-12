import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, Button, Menu, message } from 'antd';
import {  getDBRecords, resetDatabase } from '../api/main';
import SpaceBetween from '../components/SpaceBetween';

const GetDataSourceModal = ({ visible, onCancel }) => {
  useEffect(()=>{
    if(!visible){
      return;
    }
    handleGetDBRecords()
  },[visible])
 
  const [dbRecords,SetDBRecords] = useState([])
  const handleGetDBRecords = () =>{
    getDBRecords().then(res=>{
        console.log('res.data',res.data);
        
        SetDBRecords(res.data)
    })
  }

  const SwitchDB = async (record) =>{
    record.type = 2;
    const data = await resetDatabase(record)
    if(data.code){
        message.error("修改数据源失败 ｜"+ data.message)
        return
    }
    message.success("修改数据源成功")
    onCancel()
  }

  return (
    <Modal
      title="Switch DataSource"
      open={visible}
      onCancel={onCancel}
    >
      <Menu>
        {
            dbRecords.map(item=>{
                return <Menu.Item>
                    <SpaceBetween style={{margin:0,alignItems:'center'}}>
                        <div>{item.host}</div>
                        <Button onClick={()=>SwitchDB(item)}>connect</Button>
                    </SpaceBetween>
                </Menu.Item>
            })
        }
      </Menu>
    </Modal>
  );
};

export default GetDataSourceModal;
