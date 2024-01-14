import MapModel from "../open-layer/map";
import LAYERMODELS from "../init-map-state/layers";
import BASEMAPMODELS from "../init-map-state/base-map";
import MAPSETTINGMODELS from "../init-map-state/map-setting";
import { Coordinate } from "ol/coordinate";

namespace OpenLayerComponent {
  export interface OpenlayerMapViewStateModel {
    map: MapModel.Map | any;
    mapContainerStyle: any;
  }

  export interface OpenlayerMapViewPropsModel {
    SetOutSideHandleFunction: any;
    baseMaps: BASEMAPMODELS.BaseMapModel;
    mapSetting: MAPSETTINGMODELS.MapSettingModel;
    layers: LAYERMODELS.LayerModel;
    setExtend: Function;
    setZoom: Function;
    setMapLayer: Function;
  }
}

export default OpenLayerComponent;
