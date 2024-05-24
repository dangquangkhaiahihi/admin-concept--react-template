import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { CircularProgress, Grid } from "@material-ui/core";

const AreaOfLand = React.memo((props) => {
  const { data, isExpanDiv } = props;
  const renderOptions = (data) => {
    const dataSeries = data.map((x) => ({
      y: x.dientich,
      name: x.loaidat,
    }))
    const chartOptions = {
      chart: {
        type: "pie",
        height: 350,
      },
      title: {
        verticalAlign: "bottom",
        floating: true,
        text: data.name,
        style: {
          color: '#707070',
          fontSize: '12px',
          fontWeight: 'normal',
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
          }
        }
      },
      legend: {
        layout: 'vertical',
        verticalAlign: 'bottom',
        borderWidth: 0,
        style: {
          color: '#707070',
          fontSize: '12px',
          fontWeight: 'normal',
          marginLeft: '20px'
        }
      },
      series: [
        {
          data: dataSeries,
          size: "80%",
          name: 'Diện tích'
        }
      ]
    }
    return chartOptions;
  }

  return (
    <div className="wrap__planning-loading">
      <h6 className="font-weight-bold">Thống kê diện tích đất đai</h6>
      <div className={'wrap__planning text-center'} style={{
        marginTop: !isExpanDiv ? 5 : data.length ? 5 : 150
      }}>
        {data && data.length ?
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HighchartsReact highcharts={Highcharts} options={renderOptions(data)} />
            </Grid>
          </Grid>
          :
          <CircularProgress disableShrink />
        }
      </div>
    </div>
  )
})

export default AreaOfLand;

