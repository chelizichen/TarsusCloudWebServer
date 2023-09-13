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


    // 获取所有的时间点
    const allTimes = [...new Set(data.map(item => item.request_start_time))].sort();

    // 将数据按 request_url 分组
    const groupedData = data.reduce((acc, curr) => {
        if (!acc[curr.request_url]) {
            acc[curr.request_url] = {};
        }
        acc[curr.request_url][curr.request_start_time] = curr.response_time_ms;
        return acc;
    }, {});

    // 为每个 request_url 创建一个系列
    const series = Object.keys(groupedData).map((url) => {
        return {
            name: url,
            type: 'line',
            data: allTimes.map(time => groupedData[url][time] || null),
        };
    });

    const option = {
        title: {
            text: 'Response Time Analysis by Endpoint'
        },
        xAxis: {
            type: 'category',
            data: allTimes,
        },
        yAxis: {
            type: 'value',
        },
        legend: {
            data: Object.keys(groupedData).map(item=>({name:item,icon:'rectangle'})),
            right: 20,
            itemHeight: 10,
            orient:"vertical",
        },
        tooltip: {
            show: true,
            trigger:"item"
        },
        series,
    };

    return (
        <div>
            <ReactEcharts option={option} />
        </div>
    );
}

export default PerformanceChart;
