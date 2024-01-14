import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { CircularProgress, Grid } from "@material-ui/core";

const TypeStatistics = React.memo((props) => {
  const { data, isExpanDiv } = props;

  const renderOptions = (data) => {
    const dataSeries = data.map((x) => ({
      name: x.name,
      y: x.count,
      drilldown: x.name
    }))
    const chartOptions = {
      chart: {
        type: 'column'
      },
      title: false,
      subtitle: false,
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },
      series: [
        {
          name: "Số lượng",
          colorByPoint: true,
          data: dataSeries
        }
      ]
    }
    return chartOptions;
  }

  return (
    <div className="wrap__planning-loading">
      <h6 className="font-weight-bold">Thống kê số lượng quy hoạch</h6>
      <div className={'wrap__planning text-center'} style={{
        marginTop: !isExpanDiv ? 5 : data.length ? 5 : 150
      }}>
        {data && data.length ?
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HighchartsReact highcharts={Highcharts} options={renderOptions(data)} />
              </Grid>
            </Grid>
          </> :
          <CircularProgress disableShrink />
        }
      </div>
    </div>
  )
})

export default TypeStatistics;

