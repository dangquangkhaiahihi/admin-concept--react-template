namespace mapObjectModel {
  export interface mapObject {
    attributes: {
      name: string; 
      extends: string;
      projection: string;
      minZoom: number;
      maxZoom: number;
      startZoom: number;
      center: string; 
    };
    baseMaps: BaseMap[];
    layers: Layer[];
  }

  export interface Layer {
      name: string;
      type: string; 
      dataSource: string; 
  }

  export interface BaseMap {
    id: string;
    name: string;
    baseMapType: string;
    defaultTurnOn: boolean;
  }
}

export default mapObjectModel;
