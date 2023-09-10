import _ from 'lodash';


export function LinkToTable(sourceData) {
    // 获取第一个数据对象的所有字段（除了'key'字段）
    const fields = _.keys(_.omit(sourceData[0], 'key'));
    const columns = fields.map(item => {
        return {
            title: item.charAt(0).toUpperCase()
                + item.slice(1),  // 首字母大写
            dataIndex: item, 
            key: item
        }
    })
    // 计算每个字段的x坐标
    const fieldCount = fields.length;
    const centerX = 300;
    const spacing = 200;
    const start = centerX - (fieldCount - 1) * spacing / 2;

    // 生成Seriesdata
    const data = fields.map((field, index) => ({
        name: field,
        x: start + index * spacing,
        y: 300
    }));

    // 将表名添加到Seriesdata
    data.unshift({
        name: 'Table',
        x: centerX,
        y: 150
    });

    // 生成Serieslinks
    const links = fields.map(field => ({
        source: field,
        target: 'Table'
    }));

    return {
        data,
        links,
        columns        
    };
}

