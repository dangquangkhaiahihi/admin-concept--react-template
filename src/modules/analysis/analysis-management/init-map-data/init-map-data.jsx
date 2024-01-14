import React, { useEffect, useState } from "react";
import "./init-map-data.scss";
import OpenlayerMapView from "../../../../components/open-layer/open-layer";
import LeftControlView from "./left-control/left-control";
import * as InitMapStore from "../../../../redux/store/init-map/init-map.store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BottomControl from "./bottom-control/botttom-control";
import FunctionButton from "./function-button/function-button";
import AnalysisNote from "./analysis-note/analysis-note";

function InitMapDataView(props) {
  const [extend, setExtend] = useState([]);
  const [zoom, setZoom] = useState();
  const [mapLayer, setMapLayer] = useState();
  const [dataItems, setDataItem] = useState();
  const [isFist, setIsFist] = useState(false);

  useEffect(() => {
    if (props.planningId) {
      if (props.mapId) {
        props.GetMapAnalysisById(props.mapId,props.analysisId);
      }
      else props.UpdateDefaultMapData(props.mapId,props.analysisId);
    }
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


  const handleGetDataClick = (value) => {
    setDataItem(undefined);
    setDataItem(value);
  };

  return (
    <div
      className="init-map-data-container h-100 container-fluid p-0"
      style={{ overflowX: "hidden" }}
    >
      <div className="row h-100 p-0 m-0">
        <div className="col-3 h-100 p-0">
          <LeftControlView planningId={props.planningId} analysisId={props.analysisId} mapId={props.mapId} isLock={props.isLock} dataItems={dataItems}/>
        </div>
        <div className="col-9 h-100 p-0">
          {props.initMap.hasLoadingData && (
            <OpenlayerMapView
              setExtend={setExtend}
              setZoom={setZoom}
              setMapLayer={setMapLayer}
            />
          )}
        </div>
      </div>
      <div className="relative">
        {<AnalysisNote  analysisId={props.analysisId} />}
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
      GetMapAnalysisById: InitMapStore.GetMapAnalysisById,
      GetAllBaseMapDefault: InitMapStore.GetAllBaseMap,
      UpdateDefaultMapData: InitMapStore.UpdateDefaultMapData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InitMapDataView);
