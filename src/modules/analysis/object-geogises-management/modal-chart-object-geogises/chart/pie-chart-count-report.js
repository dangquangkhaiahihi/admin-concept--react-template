import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const PieChartCountReport = (props) => {
    const { data, currentObjectType } = {...props};

    const options = {
        chart: {
            type: "pie",
        },
        title: {
            text: "Thống kê số lượng đối tượng",
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f}%",
                },
            },
        },
        series: [
            {
            name: "Số lượng đối tượng",
            colorByPoint: true,
            data: data.map(item => (
                {
                    name: ( currentObjectType =='dat' || currentObjectType =='giao_thong' )
                    ? item.name
                    : (currentObjectType === "dien" || currentObjectType =='nuoc')
                    ? item.code
                    : "",
                    y: item.count,
                }
            )),
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default PieChartCountReport;
