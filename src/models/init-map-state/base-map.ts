namespace BaseMapModels {
  export interface BaseMapModel {
    base_maps: base_mapsModel[];
    haveData: boolean;
    id: number;
    map_id: number;
    name: string;
    MAP: string;
    type_map: string;
  }

  export interface base_mapsModel {
    baseMapSettingModel: baseMapSettingModelModel;
    base_map_setting_id: number;
    id: number;
    map_setting_id: number;
    name: string;
    url: string;
    view_default: boolean;
    z_index: number;
  }

  interface baseMapSettingModelModel {
    id: number;
    layer_type: string;
    name: string;
    status: boolean;
    url: string;
  }
}

export default BaseMapModels;
