import LayerSettingsModels from './layer-setting-models';

namespace LayerCategoryModels {
  export interface LayerCategoryModel {
    id: number;
    folder_label: string;
    folder_name: string;
    level: number;
    map_setting_id: number;
    layer_settings: LayerSettingsModels.LayerSettingsModel[];
  }
}

export default LayerCategoryModels;
