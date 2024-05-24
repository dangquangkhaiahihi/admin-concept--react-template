import LayerCategoryModels from './layer-category-models';
import BaseMapModels from './base-map-models';

namespace MapSettingModels {
  export interface MapSettingModel {
    id: string;
    map_id: number;
    type_map: string; 
    name: string;
    layer_categories: LayerCategoryModels.LayerCategoryModel[];
    base_maps: BaseMapModels.BaseMapModel[];
  }
}

export default MapSettingModels;
