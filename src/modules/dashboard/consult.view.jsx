import React, { useCallback } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { CircularProgress } from "@material-ui/core";

const typeConsult =
{
  old: "Quy hoạch cũ",
  end: "Đã kết thúc",
  consultanting: "Đang xin ý kiến",
}

const Consult = React.memo((props) => {
  const { data } = props;

  const renderOptions = useCallback((data) => {
    const categories = data.flatMap((x) => x.name);
    const oldData = data.flatMap((x) => x.old)
    const enData = data.flatMap((x) => x.end)
    const consultantingData = data.flatMap((x) => x.consultanting)

    const dataSeries = [
      {
        name: typeConsult.old,
        data: oldData
      },
      {
        name: typeConsult.end,
        data: enData
      },
      {
        name: typeConsult.consultanting,
        data: consultantingData
      }
    ]

    const chartOptions = {
      chart: {
        type: 'column'
      },
      title: false,
      xAxis: {
        categories
      },

      yAxis: {
        min: 0,
        title: false,
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray',
            textOutline: 'none'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Tổng: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: dataSeries
    }
    return chartOptions;
  }, []);

  return (
    <div class='wrap__planning text-center'>
      <h6 className="font-weight-bold">Xin ý kiến cộng đồng</h6>
      {data && data.length ?
        <div class="row w-100">
          <div class="col">
            <HighchartsReact highcharts={Highcharts} options={renderOptions(data)} />
          </div>
        </div>
        :
        <CircularProgress disableShrink />
      }
    </div >
  )
})

export default Consult;

