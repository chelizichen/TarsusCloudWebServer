import React from 'react';
import {utils,writeFile} from 'xlsx';
import { Button } from 'antd';

const ExportToExcelButton = ({ dataSource, columns, fileName }) => {
    const handleExportToExcel = () => {
        const ws = utils.json_to_sheet(dataSource);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <Button onClick={handleExportToExcel} type={"primary"} style={{backgroundColor:"green",marginLeft:"20px"}}>导出Excel</Button>
    );
};

export default ExportToExcelButton;
