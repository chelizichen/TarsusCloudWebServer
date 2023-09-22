import React, {useEffect, useState} from 'react';
import { Button, Input, Select, Card } from 'antd';
import ExtractFilePaths from "../utils/extractFilePaths.ts";
import {invokeFunction} from "../api/user.ts";
import join from "../utils/join.ts";
import useStore from "../store";
import JSONView from 'react-json-view';
import './RequestComponent.css';

const { Option } = Select;

const RequestComponent = ({ functions }) => {
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [output, setOutput] = useState({});
    const [Functions,setFunctions] = useState([])
    const [json,setJson] = useState({})
    useEffect(()=>{1
        if(!functions){
            return
        }
        const extractFilePaths = ExtractFilePaths(functions);
        setFunctions(extractFilePaths)
    },[functions])
    const handleFunctionChange = (value) => {
        setSelectedFunction(value);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setJson(JSON.parse(e.target.value))
    };
    const state = useStore.getState()
    const handleInvoke = async () => {
        console.log('selectedFunction',selectedFunction)
        const functionPath = join(state.currDir,selectedFunction)
        const data = await invokeFunction(functionPath,JSON.parse(inputValue));
        setOutput(data);
    };

    return (
        <Card title="Invoke a Function" style={{ marginTop: '20px' }}>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a function"
                optionFilterProp="children"
                onChange={handleFunctionChange}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {Functions.map((func) => (
                    <Option key={func} value={func}>
                        {func}
                    </Option>
                ))}
            </Select>
            <br />
            <br />
            <Input.TextArea
                placeholder="Enter function input"
                value={inputValue}
                onChange={handleInputChange}
                style={{letterSpacing:"3px",width:"auto",height:"100px"}}

            />
            <br />
            <br />
            <JSONView
                src={json}
                enableClipboard={true}
            />

            <br />
            <br />
            <Button type="primary" onClick={handleInvoke}>
                Invoke
            </Button>
            <br />
            <br />
            <h4>Output:</h4>
            <div> Function ${selectedFunction} invoked with output:</div>
            <JSONView
                src={output}
                enableClipboard={true}
            />
        </Card>
    );
};

export default RequestComponent;
