/* eslint-disable no-useless-constructor */
import React from "react";
import { connect } from "react-redux";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 99999,
    color: "#fff",
  },
}));

function AppSyncLoading(props) {
  const { syncLoading } = props;
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={syncLoading}>
      <div className="row">
        <div className="col-12" style={{ fontSize: '22px', fontWeight: 800,}}>
          Hệ thống đang xác định kiểu dữ liệu liên quan đến lớp dữ liệu của các loại đồ án quy hoạch
        </div>
        <div className="col-12 justify-content-center row">
          <CircularProgress color="inherit" />
        </div>
      </div>
    </Backdrop>
  );
}

const mapStateToProps = (state) => ({
  syncLoading: state.app.syncLoading,
});

export default connect(mapStateToProps)(AppSyncLoading);
