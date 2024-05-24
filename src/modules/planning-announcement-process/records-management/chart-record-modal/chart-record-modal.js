import React, { useEffect, useState } from "react";

import {
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

const ChartPlanningModal = ({
  isOpen,
  onClose,
  data
}) => {
  const classes = useStyles();

  const [chartData, setChartData] = useState([]);
  console.log("chartData",chartData);
  console.log("data",data);
  useEffect(() => {
    const temp = gatherCountByPlanningType(data);
    setChartData(temp);
  }, [])

  const options = {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Biểu đồ thống kê quy hoạch theo thời gian',
    },
    xAxis: {
        categories: data.map(entry => entry.month),
    },
    yAxis: {
        title: {
            text: 'Count',
        },
    },
    tooltip: {
        backgroundColor: '#FCFFC5',
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 3,
        formatter: function() {
            return '<b>' + this.series.name +'</b><br/> - Số lượng: ' + this.y;
        }
    },
    // series: data.map(entry => ({
    //     name: entry.month,
    //     data: entry.groupedByPlanningType.map(planningType => planningType.count),
    // })),

    series: chartData.map(item => {
      return {
          name: item.planningTypeName,
          data: item.count,
      }
    })
};

function gatherCountByPlanningType(data) {
  const result = {}

  data.map((itemGroupedByPlanningType) => {
    itemGroupedByPlanningType.groupedByPlanningType.map(forPlanningType => {
      if (!result[forPlanningType.planningTypeName]) {
        result[forPlanningType.planningTypeName] = {
            planningTypeName: forPlanningType.planningTypeName,
            count: [forPlanningType.count]
        };
      } else result[forPlanningType.planningTypeName].count.push(forPlanningType.count)
    })
  });

  return Object.values(result);
}


  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Biểu đồ thống kê</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

          <DialogContent className="pt-4 pb-2">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </DialogContent>

          <DialogActions className="border-top">
            <Button
              type="submit"
              onClick={onClose}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Đóng
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChartPlanningModal;
