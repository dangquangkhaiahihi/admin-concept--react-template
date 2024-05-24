import React, { useEffect, useState } from "react";
import OpenlayerMapView from "../../../components/open-layer/open-layer";
import * as InitMapStore from "../../../redux/store/init-map/init-map.store";
import './object-geogies-search-on-map.scss'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import LeftToolSearchOnMapView from "./left-tool-search-on-map/left-tool-search-on-map.view";
import ControlFunctionType from "../../../components/open-layer/control-function-type/control-function-type";
// import LeftToolSearchMap from ".";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const fixedLayerTablenameConst = [
  {
      tableName : 'boundaries',
      isAddedLayer : false,
      zIndex: 10,
  },
  {
      tableName : 'diaphantinh_wgs84',
      isAddedLayer : false,
      zIndex: 5,
  }
];

function InitMapDataView(props) {
  const [extend, setExtend] = useState([]);
  const [zoom, setZoom] = useState();
  const [mapLayer, setMapLayer] = useState();
  const [dataItems, setDataItem] = useState();
  const [isFist, setIsFist] = useState(false);

  const [fixedLayerTablename, setFixedLayerTablename] = useState(fixedLayerTablenameConst);
  const [isDoneConstructMap, setIsDoneConstructMap] = useState(false);

  const [isEntendLeftBar, setIsEntendLeftBar] = useState(false);

  useEffect(() => {
    props.GetMapDetailById(1510, 200);
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

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  useEffect(() => {
    if(isDoneConstructMap) {
      const temp = [...fixedLayerTablename];
      temp.forEach((item)=>{
        props.controlOpenlayer_handleOutSideFunction(
          ControlFunctionType.AddLayerManually,
          {
            'tableName': item.tableName,
            'isAddedLayer': item.isAddedLayer,
            'zIndex': item.zIndex
          }
        );

        item.isAddedLayer = true;
      })
      setFixedLayerTablename(temp);
    }
  }, [isDoneConstructMap]);

  // useEffect(() => {
  //   const stickyTitle = document.getElementById('sticky-title');
  //   const stickyTitleHeight = stickyTitle?.clientHeight;
  //   console.log('stickyTitle', stickyTitle, stickyTitleHeight);

  //   const contentChild = document.getElementById('content-child');
  //   contentChild.style.maxHeight = `${window.innerHeight - stickyTitleHeight}px`;
  // }, [])

  return (
    <div
        className="init-map-data-container container-fluid p-0"
        style={{ overflowX: "hidden", height:'100vh' }}
    >
        <div className="row h-100 p-0 m-0" id="content-child">
            {
                ((isDesktopOrLaptop)) && 
                <div className={`${!isEntendLeftBar ? 'col-lg-3' : 'col-lg-9'} transition-smooth col-sm-0  h-100 p-0`} style={isTabletOrMobile ? {position:'absolute',height:'100vh',zIndex:30,backgroundColor:'#fff',display:'flex',flexDirection:'column'} : {backgroundColor:'#fff'}}>
                  <button class="btn btn-ct btn-danger-ct btn-inline" type="button"
                    style={isTabletOrMobile ? {alignSelf: 'center', width:'70%'} : {display:'none'}} onClick={() => {}}
                  >
                    Đóng
                  </button>
                  <LeftToolSearchOnMapView isEntendLeftBar={isEntendLeftBar} setIsEntendLeftBar={() => {setIsEntendLeftBar(prev => !prev)}}/>
                </div>
            }
            <div className={`${!isEntendLeftBar ? 'col-lg-9' : 'col-lg-3'} transition-smooth col-sm-12  h-100 p-0`}>
              {props.initMap.hasLoadingData && (
                <OpenlayerMapView
                  setExtend={setExtend}
                  setZoom={setZoom}
                  setMapLayer={setMapLayer}
                  setIsDoneConstructMap={(val) => setIsDoneConstructMap(val)}
                />
              )}
            </div>
        </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  initMap: state.initMap,
  layers: state.initMap.layers,
  controlOpenlayer_handleOutSideFunction: state.openLayer.handleOutSideFunction,
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
