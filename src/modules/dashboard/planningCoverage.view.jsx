import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { CircularProgress, Grid } from "@material-ui/core";

const PlanningCoverage = React.memo((props) => {
  const { data, isOtherPlanning } = props;

  const renderOptions = (data, isProvince = false) => {
    const provinceData = isProvince && data[data.length - 1];
    const districtData = data.filter((x, idx) => idx !== data.length - 1);
    const listDistrictName = districtData.flatMap((x) => x.diaban)
    const planneds = districtData.flatMap((x) => Math.round(x.dientich_quyhoach * 100) / 100)
    const unplanneds = districtData.flatMap((x) => Math.round((x.dientich - x.dientich_quyhoach) * 100) / 100)

    const dataSeriesDistrict = [
      {
        name: 'Chưa quy hoạch',
        data: unplanneds
      },
      {
        name: 'Đã quy hoạch',
        data: planneds
      }
    ]

    const dataSeriesProvince = [
      { name: 'Đã quy hoạch', y: Math.round(provinceData.dientich_quyhoach * 100) / 100 },
      { name: 'Chưa quy hoạch', y: Math.round(provinceData.dientich - provinceData.dientich_quyhoach * 100) / 100 }
    ]

    const chartOptions = {
      chart: {
        type: isProvince ? "pie" : "column",
        height: 350,
      },
      xAxis: !isProvince ? {
        categories: listDistrictName
      } : {},
      yAxis: {
        title: false,
      },
      title: {
        text: isProvince ? 'Cấp tỉnh' : 'Cấp huyện/thành phố',
        style: {
          fontWeight: 'bold',
          fontSize: '15px'
        }
      },
      tooltip: isProvince ? {
        pointFormat: '{series.name}: <b>{point.y} km² ({point.percentage:.1f} %)</b>'
      } : {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} km² ({point.percentage:.1f}%)</b><br/>',
        shared: true
      },
      plotOptions: isProvince ? {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.y} km²</b>',
            distance: -50,
          },
          showInLegend: true,
        }
      } : {
        column: {
          stacking: 'percent'
        }
      },
      legend: {
        layout: 'horizontal',
        verticalAlign: 'bottom',
        borderWidth: 0,
      },
      series: isProvince ? [
        {
          data: dataSeriesProvince,
          size: "80%",
          name: 'Diện tích'
        }
      ] : dataSeriesDistrict
    }
    return chartOptions;
  }

  return (
    <div className={data && data.length ? 'wrap__planning text-center' : 'wrap__planning-loading'}>
      <h6 className="font-weight-bold">{isOtherPlanning ? 'Phạm vi bao phủ quy hoạch chung' : 'Phạm vi bao phủ quy hoạch chi tiết'}</h6>
      {data && data.length ?
        <>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <HighchartsReact highcharts={Highcharts} options={renderOptions(data, true)} />
            </Grid>
            <Grid item xs={7}>
              <HighchartsReact highcharts={Highcharts} options={renderOptions(data)} />
            </Grid>
          </Grid>
        </> :
        <CircularProgress disableShrink/>
      }
    </div>
  )
})

export default PlanningCoverage;

