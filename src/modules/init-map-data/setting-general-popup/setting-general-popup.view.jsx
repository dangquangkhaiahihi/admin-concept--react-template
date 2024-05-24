import React, { useState, useEffect } from "react";
import "./setting-general-popup.scss";
import NotificationService from "../../../common/notification-service";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as InitMapStore from "../../../redux/store/init-map/init-map.store";
import * as mapAction from "../../../redux/store/init-map/base-map.store";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function RenderSettingGeneralPopup(props) {
  const [hasShowWarning, setHasShowWarning] = useState(false);
  const [mapName, setMapName] = useState(props.mapSetting.name ? props.mapSetting.name : "");
  const [mapProjection, setMapProjection] = useState(
    props.mapSetting.projection || 0
  );

  const [extendMinX, setExtendMinX] = useState(props.mapSetting.extent ? props.mapSetting.extent[0] : 0);
  const [extendMinY, setExtendMinY] = useState(props.mapSetting.extent ? props.mapSetting.extent[1] : 0);
  const [extendMaxX, setExtendMaxX] = useState(props.mapSetting.extent ? props.mapSetting.extent[2] : 0);
  const [extendMaxY, setExtendMaxY] = useState(props.mapSetting.extent ? props.mapSetting.extent[3] : 0);

  const [centerLng, setCenterLng] = useState(props.mapSetting.center ? props.mapSetting.center[0] : 0);
  const [centerLat, setCenterLat] = useState(props.mapSetting.center ? props.mapSetting.center[1] : 0);

  const [maxZoom, setMaxZoom] = useState(props.mapSetting.max_zoom ? props.mapSetting.max_zoom : 0);
  const [minZoom, setMinZoom] = useState(props.mapSetting.min_zoom ? props.mapSetting.min_zoom : 0);
  const [defaultZoom, setDefaultZoom] = useState(props.mapSetting.zoom ? props.mapSetting.zoom : 0);
  const classes = useStyles();

  useEffect(() => {
    console.log("extedn", props.mapSetting)
  }, []);

  function handleAccept() {
    if(!props.mapSetting.haveData) {
      console.log("ok")
    } else {
      switch ("") {
        case mapName.trim():
        case mapProjection.trim():
        case extendMinX:
        case extendMinY:
        case extendMaxX:
        case extendMaxY:
        case centerLat:
        case centerLng:
        case maxZoom:
        case minZoom:
        case defaultZoom:
          NotificationService.error("Không được bỏ trống các trường !");
          if (!hasShowWarning) setHasShowWarning(true);
          break;
        default: {
          const oldMapSetting = props.mapSetting;
          oldMapSetting["name"] = mapName;
          oldMapSetting["projection"] = mapProjection;
          oldMapSetting["extent"][0] = extendMinX;
          oldMapSetting["extent"][1] = extendMinY;
          oldMapSetting["extent"][2] = extendMaxX;
          oldMapSetting["extent"][3] = extendMaxY;
          oldMapSetting["center"][0] = centerLng;
          oldMapSetting["center"][1] = centerLat;
          oldMapSetting["max_zoom"] = maxZoom;
          oldMapSetting["min_zoom"] = minZoom;
          oldMapSetting["zoom"] = defaultZoom;
          props.UpdateMapSetting(oldMapSetting);
          const coordinate = {
            zoom: defaultZoom,
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: mapProjection,
            center: `${centerLng},${centerLat}`,
            extent: `${extendMinX},${extendMinY},${extendMaxX},${extendMaxY}`,
            id: props.mapSetting.id,
            zIndex: props.mapSetting.z_index,
            isActive: true,
            name: mapName,
          }
          mapAction.UpdateMap(coordinate);
          onClose();
        }
      }
    }
    
  }

  function handleDefault() {
    var defaultCordinate = {
      zoom: defaultZoom,
      minzoom: minZoom,
      maxzoom: maxZoom,
      leftExtentX: extendMinX,
      leftExtentY: extendMinY,
      rightExtentX: extendMaxX,
      rightExtentY: extendMaxY,
      centerX: centerLng,
      centerY: centerLat
    };
    props.UpdateDefaultCordinate(defaultCordinate);
  }

  const onClose = () => {
    props.UpdateOpenGeneralSettingModal(false);
  };

  const setValueExtend = () => {
    let extend = props.extend;

    document.getElementById("minX").value = extend[0];
    document.getElementById("minY").value = extend[1];
    document.getElementById("maxX").value = extend[2];
    document.getElementById("maxY").value = extend[3];
    document.getElementById("centerLng").value = (extend[0] + extend[2]) / 2;
    document.getElementById("centerLat").value = (extend[1] + extend[3]) / 2;
    document.getElementById("zoom").value = props.zoom;

    setCenterLng((extend[0] + extend[2]) / 2);
    setCenterLat((extend[1] + extend[3]) / 2);

    setExtendMinX(extend[0]);
    setExtendMinY(extend[1]);
    setExtendMaxX(extend[2]);
    setExtendMaxY(extend[3]);

    setDefaultZoom(props.zoom || 10);
  };

  return (
    <div className="general-setting-popup-container">
      <Dialog
        open={true}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" className="border-bottom">
          <Typography variant="h6">{"Thiết lập"}</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="pt-4 pb-2">
          <div className="form-group">
            <TextField
              error={hasShowWarning && !mapName.trim()}
              fullWidth
              variant="outlined"
              size="small"
              label="Tên bản đồ *"
              defaultValue={mapName}
              onChange={(event) => setMapName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <TextField
              error={hasShowWarning && !mapProjection.trim()}
              fullWidth
              variant="outlined"
              size="small"
              label="Projection *"
              defaultValue={mapProjection}
              onChange={(event) => setMapProjection(event.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-lg-6 form-group">
              <TextField
                error={hasShowWarning && !centerLng}
                type="number"
                id="centerLng"
                fullWidth
                variant="outlined"
                size="small"
                label="Kinh độ của điểm trung tâm"
                defaultValue={centerLng}
                onChange={(event) => setCenterLng(event.target.value)}
              />
            </div>
            <div className="col-lg-6 form-group">
              <TextField
                error={hasShowWarning && !centerLat}
                type="number"
                id="centerLat"
                fullWidth
                variant="outlined"
                size="small"
                label="Vĩ độ của điểm trung tâm"
                defaultValue={centerLat}
                onChange={(event) => setCenterLat(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group border-bottom">
            <label className="text-dark">Giới hạn (extend)</label>
          </div>

          <div className="row">
            <div className="col-lg-3 form-group">
              <TextField
                error={hasShowWarning && !extendMinX}
                type="number"
                id="minX"
                fullWidth
                variant="outlined"
                size="small"
                label="Min X"
                defaultValue={extendMinX}
                onChange={(event) => setExtendMinX(event.target.value)}
              />
            </div>
            <div className="col-lg-3 form-group">
              <TextField
                error={hasShowWarning && !extendMinY}
                type="number"
                id="minY"
                fullWidth
                variant="outlined"
                size="small"
                label="Min Y"
                defaultValue={extendMinY}
                onChange={(event) => setExtendMinY(event.target.value)}
              />
            </div>
            <div className="col-lg-3 form-group">
              <TextField
                error={hasShowWarning && !extendMaxX}
                type="number"
                id="maxX"
                fullWidth
                variant="outlined"
                size="small"
                label="Max X"
                defaultValue={extendMaxX}
                onChange={(event) => setExtendMaxX(event.target.value)}
              />
            </div>
            <div className="col-lg-3 form-group">
              <TextField
                error={hasShowWarning && !extendMaxY}
                type="number"
                id="maxY"
                fullWidth
                variant="outlined"
                size="small"
                label="Max Y"
                defaultValue={extendMaxY}
                onChange={(event) => setExtendMaxY(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <Button
              type="button"
              color="primary"
              variant="contained"
              onClick={setValueExtend}
            >
              Lấy giới hạn hiện tại
            </Button>
          </div>

          <div className="form-group border-bottom">
            <label className="text-dark">Zoom</label>
          </div>

          <div className="row">
            <div className="col-lg-4 form-group">
              <TextField
                error={hasShowWarning && !defaultZoom}
                type="number"
                id="zoom"
                fullWidth
                variant="outlined"
                size="small"
                label="Default"
                defaultValue={defaultZoom}
                onChange={(event) => setDefaultZoom(event.target.value)}
              />
            </div>
            <div className="col-lg-4 form-group">
              <TextField
                error={hasShowWarning && !minZoom}
                type="number"
                fullWidth
                variant="outlined"
                size="small"
                label="Min"
                defaultValue={minZoom}
                onChange={(event) => setMinZoom(event.target.value)}
              />
            </div>
            <div className="col-lg-4 form-group">
              <TextField
                error={hasShowWarning && !maxZoom}
                type="number"
                fullWidth
                variant="outlined"
                size="small"
                label="Max"
                defaultValue={maxZoom}
                onChange={(event) => setMaxZoom(event.target.value)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-top mobile-buttons-wrapper">
          <div className="mobile-button">
            <Button
              className="w-100"
              onClick={onClose}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
          </div>
          <div className="mobile-button">
            <Button
              className="w-100"
              color="success"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleDefault}
            >
              Đặt mặc định
            </Button>
          </div>
          <div className="mobile-button">
            <Button
              className="w-100"
              type="submit"
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleAccept}
            >
              Lưu
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <button
        type="button"
        className="btn btn-primary"
        id="button-open-general-setting"
        data-toggle="modal"
        data-target="#generalSettingPopup"
        hidden
      ></button>
    </div>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateMapSetting: InitMapStore.UpdateMapSetting,
      UpdateOpenGeneralSettingModal: InitMapStore.UpdateOpenGeneralSettingModal,
      UpdateDefaultCordinate: InitMapStore.UpdateDefaultCordinate,
    },
    dispatch
  );

const mapStateToProps = (state) => ({
  mapSetting: state.initMap.mapSetting,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderSettingGeneralPopup);
