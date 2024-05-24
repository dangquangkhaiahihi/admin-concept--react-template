import MapSettingModels from "./map-setting-models";

namespace MapDataModels {
  export interface MapDataModels {
    center: string; 
    extent: string; 
    id: number;
    "map_planning-relationship": any[];
    max_zoom: number;
    min_zoom: number;
    name: string;
    planing_id: string;
    projection: string;
    z_index: number;
    zoom: number;
    map_setting: MapSettingModels.MapSettingModel[];
  }
}

export default MapDataModels;
