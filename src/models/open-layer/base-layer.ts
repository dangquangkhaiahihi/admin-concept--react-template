namespace BaseLayerModel {
  export interface BaseLayer {
    changed: Function;
    dispatchEvent: DispatchEventModel;
    get: GetModel;
    getExtent: Function;
    getKeys: Function; 
    getMaxResolution: Function;
    getMaxZoom: Function;
    getMinResolution: Function;
    getMinZoom: Function;
    getOpacity: Function;
    getProperties: Function; 
    getRevision: Function;
    getVisible: GetVisibleModel; 
    getZIndex: Function;
    on: OnModel;
    once: OnModel; 
    set: SetModel;
    setExtent: SetExtentModel;
    setMaxResolution: SetMaxResolutionModel;
    setMaxZoom: SetMaxResolutionModel;
    setMinResolution: SetMaxResolutionModel;
    setMinZoom: SetMaxResolutionModel;
    setOpacity: SetMaxResolutionModel;
    setProperties: SetPropertiesModel;
    setVisible: SetVisibleModel;
    setZIndex: SetPropertiesModel;
    un: OnModel;
    unset: UnsetModel;
  }

  interface UnsetModel {
    (key: string, opt_silent: boolean): any;
  }

  interface SetVisibleModel {
    (visible: boolean): any;
  }

  interface SetPropertiesModel {
    (values: any, opt_silent: boolean): any;
  }

  interface SetMaxResolutionModel {
    (maxResolution: number): any;
  }

  interface SetExtentModel {
    (extent: any): any;
  }

  interface SetModel {
    (key: string, value: any, opt_silen: boolean): any; 
  }

  interface OnModel {
    (type: string | string[], listenerFunction: Function): any;
  }

  interface GetVisibleModel {
    (): boolean;
  }

  interface GetModel {
    (key: string): any;
  }

  interface DispatchEventModel {
    (event: any): boolean | undefined; 
  }
}

export default BaseLayerModel;
