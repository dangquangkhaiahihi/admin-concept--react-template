import BaseMapModel from "./base-layer";
import CollectionModels from "./collection.model";

namespace MapModel {
  export interface Map {
    addControl: Function;
    addLayer: AddLayerModel; 
    getLayers: GetLayersModel; 
    addInteraction: Function;
    addOverlay: Function;
    changed: Function;
    dispatchEvent: Function;
    forEachFeatureAtPixel: Function;
    forEachLayerAtPixel: Function;
    get: GetModel;
    getControls: FunctionNotParamsRequired;
    getCoordinateFromPixel: Function;
    getEventCoordinate: Function;
    getEventPixel: Function;
    getFeaturesAtPixel: Function;
    getInteractions: Function;
    getKeys: Function;
    getLayerGroup: Function;
    getOverlayById: Function;
    getOverlays: Function;
    getPixelFromCoordinate: Function;
    getProperties: Function;
    getRevision: Function;
    getSize: Function;
    getTarget: Function;
    getTargetElement: Function;
    getView: Function;
    getViewport: Function;
    hasFeatureAtPixel: Function;
    once: Function;
    removeControl: Function;
    removeInteraction: Function;
    removeLayer: Function;
    removeOverlay: Function;
    render: Function;
    renderSync: Function;
    set: Function;
    setLayerGroup: Function;
    setProperties: Function;
    setSize: Function;
    setTarget: Function;
    setView: Function;
    un: Function;
    unset: Function;
    updateSize: Function;
  }

  interface GetLayersModel {
    (): CollectionModels.Collection;
  }

  interface FunctionNotParamsRequired {
    (): any;
  }

  interface GetModel {
    (key: string): any;
  }

  interface AddLayerModel {
    (layer: BaseMapModel.BaseLayer): any;
  }
}

export default MapModel;
