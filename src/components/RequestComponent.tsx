import React, {useEffect, useState} from 'react';
import { Button, Input, Select, Card } from 'antd';
import ExtractFilePaths from "../utils/extractFilePaths.ts";
import {invokeFunction} from "../api/user.ts";
import join from "../utils/join.ts";
import useStore from "../store";

const { Option } = Select;

const RequestComponent = ({ functions }) => {
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [output, setOutput] = useState('');
    const [Functions,setFunctions] = useState([])
    useEffect(()=>{
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
    };
    const state = useStore.getState()
    const handleInvoke = async () => {
        console.log('selectedFunction',selectedFunction)
        const functionPath = join(state.currDir,selectedFunction)
        const data = await invokeFunction(functionPath,JSON.parse(inputValue));
        console.log(data)
        // 这里你可以调用你的 FaaS 函数
        // 假设你有一个函数来处理这个，例如：invokeFunction
        // const result = invokeFunction(selectedFunction, inputValue);
        // setOutput(result);

        // 为了模拟，我们只是使用输入值
        setOutput(`
        Function ${selectedFunction} invoked with output: ${JSON.stringify(data.data)}
        
        `);
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
            <Input
                placeholder="Enter function input"
                value={inputValue}
                onChange={handleInputChange}
            />
            <br />
            <br />
            <Button type="primary" onClick={handleInvoke}>
                Invoke
            </Button>
            <br />
            <br />
            <h4>Output:</h4>
            <p>{output}</p>
        </Card>
    );
};

export default RequestComponent;
