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
    // 圆的中心坐标和半径
    const centerX = 300;
    const centerY = 300;
    const radius = 150;

    // 计算每个字段的角度
    const fieldCount = fields.length;
    const angleIncrement = (2 * Math.PI) / fieldCount;

    // 生成Seriesdata
    const data = fields.map((field, index) => {
        const angle = index * angleIncrement;
        return {
            name: field,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            itemStyle: {
                color: '#4CAF50'  // 字段的颜色
            }
        };
    });

    // 将表名添加到Seriesdata
    data.unshift({
        name: 'Table',
        x: centerX,
        y: centerY
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

