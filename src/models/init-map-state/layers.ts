namespace LayerModels {
  export interface LayerModel {
    haveData: boolean;
    id: number;
    layer_categories: layer_categoriesModel[];
    map_id: number;
    name: string;
    type_map: string;
  }

  interface layer_categoriesModel {
    folder_label: string;
    folder_name: string;
    id: number;
    layer_settings: layer_settingsModel[];
    level: number;
    map_setting_id: number;
  }

  export interface layer_settingsModel {
    displayName: any;
    filterName: any;
    geoLayerName: string;
    id: number;
    isCheck: boolean;
    layerCategoryId: number;
    layerType: string;
    level: number;
    maxZoom: number;
    minZoom: number;
    name: string;
    table: string;
    wms: string; // url layer
    wmsExternal: string;
    zIndex: number;
  }
}

export default LayerModels;
