import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { getPortLog } from '../api/user.ts';
import { useLocation, useSearchParams } from 'react-router-dom';

function PerformanceChart({port}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if(!port){
            return;
        }
        getPortLog(port).then(res=>{
            if(!res){
                setData([])
                return
            }
            setData(res);
        })
    }, [port]);


    // Group data by API endpoint
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.request_url]) {
            acc[item.request_url] = [];
        }
        acc[item.request_url].push(item);
        return acc;
    }, {});

    const series = Object.keys(groupedData).map(url => ({
        name: url,
        type: 'line',
        data: groupedData[url].map(item => item.response_time_ms)
    }));

    const option = {
        title: {
            text: 'Response Time Analysis by Endpoint'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '5%',
            right: '5%'
        },
        legend: {
            data: Object.keys(groupedData).map(item=>({name:item,icon:'rectangle'})),
            right: 20,
            itemHeight: 10,
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.request_start_time) // Assuming request_start_time is a timestamp or date
        },
        yAxis: {
            type: 'value',
            name: 'ms'
        },
        series: series
    };

    return (
        <div>
            <ReactEcharts option={option} />
        </div>
    );
}

export default PerformanceChart;
