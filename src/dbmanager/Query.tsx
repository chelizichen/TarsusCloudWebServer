import React, { useRef, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Breadcrumb,
  message,
  Table,
  Tooltip,
} from "antd";
import { addQuery } from "../api/main.ts";
import Editor from "../components/Editor.tsx";
import lodash from "lodash";
import Draggable from "react-draggable";
import type { DraggableData, DraggableEvent } from "react-draggable";

const QuerySqlModal = ({ visible, onCancel, source, database }) => {
  const [fileName, setFileName] = useState("");
  const [editorVal, setEditorVal] = useState("");

  const handleCancel = () => {
    onCancel();
  };

  const [columns, SetColumns] = useState([]);

  const handleQuery = async () => {
    const data = await addQuery({
      fileName,
      sql: editorVal,
      source,
      database,
    });
    if (data.code) {
      message.error(data.message);
      return;
    }

    SetResultOpen(true);
    const head = lodash.head(data.data);
    const keys = lodash.keys(head);
    const columns = keys.map((item: string,index:number) => {
      return {
        title: item.charAt(0).toUpperCase() + item.slice(1), // 首字母大写
        dataIndex: item,
        key: index,
        sorter: {
            compare: (a, b) => a[item] - b[item],
            multiple: 1,
        },
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>
            {val}
          </Tooltip>
        ),
      };
    });
    SetColumns(columns);
    SetResult(data.data);
    // 在这里执行查询操作
    // 使用 fileName 和 sql 变量
  };

  const [resultOpen, SetResultOpen] = useState(false);
  const [result, SetResult] = useState([]);

  const draggleRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <Modal
        title="Query SQL"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="query" type="primary" onClick={handleQuery}>
            Query
          </Button>,
        ]}
        modalRender={(modal) => (
          <Draggable
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        style={{ cursor: "move" }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{source}</Breadcrumb.Item>
          <Breadcrumb.Item>{database}</Breadcrumb.Item>
        </Breadcrumb>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          style={{ width: "150px" }}
          bordered={false}
        />
        <div style={{ marginTop: "16px" }}>
          <Editor
            language="mysql"
            value={editorVal}
            onChange={(newValue) => setEditorVal(newValue)}
          ></Editor>
        </div>
      </Modal>
      <Modal
        centered
        width={"auto"}
        title="Results"
        open={resultOpen}
        onOk={() => SetResultOpen(false)}
        onCancel={() => SetResultOpen(false)}
      >
        <Table
          dataSource={result}
          columns={columns}
          style={{ width: "auto" }}
          bordered
        ></Table>
      </Modal>
    </>
  );
};

export default QuerySqlModal;
