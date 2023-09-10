import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';

function LogViewer() {
    const [endpoints, setEndpoints] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch all available endpoints from your API
        // For demonstration purposes, I'm using a mock array
        const mockEndpoints = [
            { id: 'API1' },
            { id: 'API2' },
            // ... more data
        ];
        setEndpoints(mockEndpoints);
    }, []);

    const handleMenuClick = async (e) => {
        // Fetch logs for the selected endpoint
        // For demonstration purposes, I'm using a mock array
        const mockLogs = [
            { requestTime: '10:00', responseTime: '10:01', endpoint: 'API1', params: '{}', bodyLength: 100 },
            { requestTime: '10:02', responseTime: '10:03', endpoint: 'API1', params: '{}', bodyLength: 150 },
            // ... more data
        ];
        setLogs(mockLogs);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Menu
                mode="vertical"
                onClick={handleMenuClick}
                style={{ width: 256 }}
            >
                {endpoints.map(endpoint => (
                    <Menu.Item key={endpoint.id}>
                        {endpoint.id}
                    </Menu.Item>
                ))}
            </Menu>

            <div style={{ flex: 1, padding: '20px', backgroundColor: 'black', color: '#fff', overflowY: 'auto' }}>
                {logs.map((log, index) => (
                    <div key={index}>
                        {log.requestTime} >> {log.responseTime} >> {log.endpoint} >> {log.params} >> {log.bodyLength}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LogViewer;
