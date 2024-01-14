import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { CircularProgress, Grid } from "@material-ui/core";

const PlanningUnit = React.memo((props) => {
  const { data } = props;

  const renderOptions = (data) => {
    const dataSeries = data.map((x) => ({
      y: x.total,
      name: x.name,
    }))
    const chartOptions = {
      chart: {
        type: "pie",
        height: 400,
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
            format: '<b>{point.y}</b>',
            distance: -50,
          },
          showInLegend: true,
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
          size: "85%",
          name: 'Số lượng'
        }
      ]
    }
    return chartOptions;
  }

  return (
    <div className={data && data.length ? 'wrap__planning text-center' : 'wrap__planning-loading'}>
      <h6 className="font-weight-bold">Đơn vị lập quy hoạch</h6>
      {data && data.length ?
        <Grid item xs={12}>
          <HighchartsReact highcharts={Highcharts} options={renderOptions(data)} />
        </Grid>
        :
        <CircularProgress disableShrink />
      }
    </div>
  )
})

export default PlanningUnit;

