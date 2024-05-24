import React, { useEffect, useState } from "react";
import InitMapDataView from "../init-map-data/init-map-data.jsx";
import { connect } from "react-redux";

//--- Material Icon
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    //backgroundColor: '#00923F'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  headerTooltip: {
    maxWidth: "none",
    fontSize: "0.85rem",
  },
}));

function CreatMapView(props) {
  const classes = useStyles();

  const { settings } = props;

  useEffect(() => {
    setClientSetting(settings);
  }, [settings]);

  const [clientSetting, setClientSetting] = useState();

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            {
                clientSetting && (
                    <AppBar className={classes.appBar} style={{ background: clientSetting.color }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Tooltip title={props.planningName + ' - ' + (props.mapSetting.name || "Bản đồ chưa đặt tên")} classes={{ tooltip: classes.headerTooltip }}>
                                <Typography variant="h6" className={classes.title + ' text-truncate'}>
                                    Phân tích ({props.planningName + ' - ' + (props.mapSetting.name || "Bản đồ chưa đặt tên")})
                                </Typography>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                )
            }

            <div className="h-100">
                <InitMapDataView isLock={props.isLock} analysisId={props.analysisId} mapId={props.mapId} planningId={props.planningId} />
            </div>
        </Dialog>
    )
}

const mapStateToProps = (state) => ({
  mapSetting: state.initMap.mapSetting,
  settings: state.clientSetting.clientSetting,
});

export default connect(mapStateToProps, null)(CreatMapView);
