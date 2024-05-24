namespace BaseMapModels {
  export interface BaseMapModel {
    base_map_setting_id: number;
    id: number;
    map_setting_id: number;
    url: string;
    view_default: boolean;
    z_index: 0;
    name: string;
    baseMapSettingModel: BaseMapModelBaseMapSettingModel;
  }

  export interface BaseMapModelBaseMapSettingModel {
    id: number;
    layer_type: string;
    status: boolean;
    url: string;
  }
}

export default BaseMapModels;
