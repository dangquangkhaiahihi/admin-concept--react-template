import React, { useEffect, useState } from "react";
import "./init-map-data.scss";
import OpenlayerMapView from "../../components/open-layer/open-layer";
import LeftControlView from "./left-control/left-control";
import RenderSettingGeneralPopup from "./setting-general-popup/setting-general-popup.view.jsx";
import * as InitMapStore from "../../redux/store/init-map/init-map.store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BottomControl from "./bottom-control/botttom-control";
import FunctionButton from "./function-button/function-button";
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "@material-ui/core";

function InitMapDataView(props) {
  const [extend, setExtend] = useState([]);
  const [zoom, setZoom] = useState();
  const [mapLayer, setMapLayer] = useState();
  const [dataItems, setDataItem] = useState();
  const [isFist, setIsFist] = useState(false);
  const [isOpenSettingMap, setIsOpenSettingMap] = useState(false);

  useEffect(() => {
    if (props.planningId) {
      if (props.mapId) props.GetMapDetailById(props.mapId, props.planningId).then((data)=>{
        if(data && data.content) {
          props.setIsActive(data.content.is_active);
        }
      });
      else props.UpdateDefaultMapData(props.planningId);
    } else props.GetMapDetailById(21, 1);
    props.GetAllBaseMapDefault();
    setMapLayer(undefined);
    setDataItem(undefined);
  }, []);

  useEffect(() => {
    if (isFist) {
      setDataItem(undefined);
    }
    setIsFist(true);
  }, [props.layers]);

  // useEffect(() => {
  //     if (props.planningId) {
  //         if (props.mapId) props.UpdateDefaultMapData(props.planningId, props.mapId); else props.UpdateDefaultMapData(props.planningId)
  //     } else props.UpdateDefaultMapData(21, 1);
  //     props.GetAllBaseMapDefault();
  // }, []);

  const handleGetDataClick = (value) => {
    setDataItem(undefined);
    setDataItem(value);
  };

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    <div
      className="init-map-data-container h-100 container-fluid p-0"
      style={{ overflowX: "hidden" }}
    >
      <div className="row h-100 p-0 m-0">
        {
          ((isDesktopOrLaptop) || (isOpenSettingMap && isTabletOrMobile)) && 
          (<div className="col-lg-3 col-sm-0  h-100 p-0" style={isTabletOrMobile ? {position:'absolute',height:'100vh',zIndex:30,backgroundColor:'#fff',display:'flex',flexDirection:'column'} : {}}>
            <button class="btn btn-ct btn-danger-ct btn-inline" type="button" style={isTabletOrMobile ? {alignSelf: 'center', width:'70%'} : {display:'none'}}
              onClick={() => {setIsOpenSettingMap((prevIsOpenSettingMap) => !prevIsOpenSettingMap)}}
            >
              Đóng
            </button>
            <LeftControlView planningId={props.planningId} mapId={props.mapId} isLock={props.isLock}/>
          </div>)
        }
        {
          isTabletOrMobile && (
            <Tooltip title={'Thiết lập thông số chung'} placement="left-start" style={{position:'absolute',width:'30px',top:'100px', left:'10px',zIndex:20,backgroundColor: '#666666',border: 0, paddingBottom:'4px' }}>
              <button className="tool-button" onClick={() => {setIsOpenSettingMap((prevIsOpenSettingMap) => !prevIsOpenSettingMap)}}>
                <img style={{height:'18px',width:'18px'}}
                  src={require('../../assets/icon/settings.svg')} alt="setting" />
              </button>
            </Tooltip>
          )
        }
        <div className="col-lg-9 col-sm-12 h-100 p-0">
          {props.initMap.hasLoadingData && (
            <OpenlayerMapView
              setExtend={setExtend}
              setZoom={setZoom}
              setMapLayer={setMapLayer}
            />
          )}
        </div>
        {props.initMap.isOpenSettingGeneralModal && (
          <RenderSettingGeneralPopup extend={extend} zoom={zoom} />
        )}
      </div>
      <div className="relative">
        {dataItems && <BottomControl isLock={props.isLock} dataItems={dataItems} />}
      </div>
      <div>
        {mapLayer && (
          <FunctionButton
            key={Date.now.toString()}
            mapLayer={mapLayer}
            planningName={props.planningName}
            handleGetDataClick={handleGetDataClick}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  initMap: state.initMap,
  layers: state.initMap.layers,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      GetMapDetailById: InitMapStore.GetMapDetailById,
      GetAllBaseMapDefault: InitMapStore.GetAllBaseMap,
      UpdateDefaultMapData: InitMapStore.UpdateDefaultMapData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InitMapDataView);
