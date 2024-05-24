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

function AppLoading(props) {
  const { loading } = props;
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

const mapStateToProps = (state) => ({
  loading: state.app.loading,
});

export default connect(mapStateToProps)(AppLoading);
