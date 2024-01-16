import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const BarChartTotalAreaReport = (props) => {
    const { data, currentObjectType } = {...props};

    const options =   {
        chart: {
            type: 'bar'
        },
        title: {
            text: ( currentObjectType =='dat' || currentObjectType =='giao_thong' )
                ? 'Thống kê đối tượng theo Tổng diện tích (m&#178)'
                : (currentObjectType === "dien" || currentObjectType =='nuoc')
                ? 'Thống kê đối tượng theo Tổng chiều dài (m)'
                : "",
            align: 'center'
        },
        xAxis: {
            categories: data.map(item => ( currentObjectType =='dat' || currentObjectType =='giao_thong' )
                ? item.name
                : (currentObjectType === "dien" || currentObjectType =='nuoc')
                ? item.code
                : ""),
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Tổng diện tích',
                align: 'high'
            },
            labels: {
                overflow: 'auto'
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: ' m&#178;'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                },
                groupPadding: 0.1,
            }
        },
        legend:{ enabled:false },
        // credits: {
        //     enabled: false
        // },
            series: [{
                name: "Tổng diện tích",
                data: data.map(item => (item.total))
            },
        ]
    }

    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    );
};

export default BarChartTotalAreaReport;
