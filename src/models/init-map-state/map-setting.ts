namespace MapSettingModels {
  export interface MapSettingModel {
    center: [number, number];
    extent: [number, number, number, number];
    haveData: boolean;
    id: number;
    max_zoom: number;
    min_zoom: number;
    name: string;
    planing_id: number;
    projection: string;
    z_index: number;
    zoom: number;
  }
}

export default MapSettingModels;
