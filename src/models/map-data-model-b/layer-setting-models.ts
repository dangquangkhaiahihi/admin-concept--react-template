namespace LayerSettingsModels {
  export interface LayerSettingsModel {
    geoLayerName: string;
    id: number;
    isCheck: boolean;
    layerType: string;
    layerCategoryId: number;
    level: number;
    maxZoom: number;
    minZoom: number;
    name: string;
    table: string;
    wms: string;
    wmsExternal: boolean;
    zindex: number;
    displayName: LayerSettingsDisplayModel;
    filterName: LayerSettingsFilterModel;
      documentUploadId: number | undefined;
      filesName: Files;
  }

    export interface Files {
        fileName: string;
        fileType: string;
        filePreview: string;
        fileSize: number;
        fileId: number;
    }

  export interface LayerSettingsFilterModel {
    order: string; 
    in: LayerSettingsFilterInModel[];
    out: LayerSettingsFilterInModel[];
  }

  export interface LayerSettingsFilterInModel {
    col: string; 
    alias: string; 
    kieu: string;
    type_display?: string;
  }

  export interface LayerSettingsDisplayModel {
    viewdetail: LayerSettingsDisplayViewdetailModel;
    popup: LayerSettingsDisplayViewdetailModel;
    tooltip: LayerSettingsDisplayViewdetailModel;
    cols: LayerSettingsDisplayColModel[];
  }

  export interface LayerSettingsDisplayColModel {
    col: string; 
    alias: string; 
    index: number;
    kieu: string;
  }

  export interface LayerSettingsDisplayViewdetailModel {
    use: boolean;
    cols: string[];
  }
}

export default LayerSettingsModels;
