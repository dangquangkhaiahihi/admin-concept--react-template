import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const StackedGroupedColumnChartReport = (props) => {
    const { data } = {...props};

    const options = {

        chart: {
            type: 'column'
        },
    
        title: {
            text: 'Biểu đồ thống kê - đồng bộ',
            align: 'left'
        },
    
        xAxis: {
            categories: data.map(item => item.planningType),
        },
    
        yAxis: {
            // allowDecimals: false,
            min: 0,
            title: {
                text: 'Số lượng'
            }
        },
    
        tooltip: {
            backgroundColor: '#FCFFC5',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3,
            formatter: function() {
                return '<b>' + this.series.name +'</b><br/> - Số lượng: ' + this.y + 
                '<br/> - Tổng số: ' + this.point.stackTotal + 
                '<br/> - Tỉ lệ: ' + ((this.y / this.point.stackTotal) * 100).toFixed(2) + "%";
            }
        },
    
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
    
        series: [
            {
                name: 'Chưa đồng bộ',
                data: data.map(item => item.unsync),
                stack: 'Status sync',
            },
            {
                name: 'Đã đồng bộ',
                data: data.map(item => item.syncied),
                stack: 'Status sync',
            },
            {
                name: 'Thành công',
                data: data.map(item => item.success),
                stack: 'Status',
                stackTotal: data.map(item => item.syncied),
            },
            {
                name: 'Chưa thành công',
                data: data.map(item => item.fail),
                stack: 'Status',
                stackTotal: data.map(item => item.syncied),
            },
        ]
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default StackedGroupedColumnChartReport;
