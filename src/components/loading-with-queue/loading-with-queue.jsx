import React, { useEffect } from "react";
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

function LoadingScreen(props) {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={props.loadingQueue.length > 0}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

const mapStateToProps = (state) => ({
    loadingQueue: state.loadingState.loadingQueue,
});

export default connect(mapStateToProps)(LoadingScreen);
