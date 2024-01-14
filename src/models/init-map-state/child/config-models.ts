
namespace ConfigModels {
  export interface StandardColsDisplay {
    col: string,
    alias: string,
    index: number,
    kieu: string,
  }
  export interface SortDataSourceObject {
    cols: ObjectOfColsRaw[];
  }
  export interface ObjectOfArray {
    column_name: string;
    data_type: string;
    label: string;
    checked: boolean;
    type_display?:string;
  }
  export interface DataSourceObject {
    tableName: string;
    cols: any; // fix late
    wms: string;
    style: string;
    wmsParameters: string;
    wms_external: boolean;
  }
  export interface LayerSettingObject {
    layerName: string;
    minZoom: number;
    maxZoom: number;
    zIndex: number;
    defaultTurnOn: boolean;
  }
  export interface DisplayInformationSettingObject {
    viewDetail: ObjectOfArray[];
    tooltip: ObjectOfArray[];
    popup: ObjectOfArray[];
  }
  export interface ObjectFilterArray {
    col: string;
    alias: string;
    kieu: string;
    type_display?:string;
  }
  export interface ObjectOfColsRaw {
    column_name: string;
    data_type: string;
    label: string;
    type_display?:string;
  }
  export interface MapSettingObject {
    id: number;
    map_id: number;
    name: string;
    type_map: string;
    layer_categories: any;
    base_maps: any;
  }
  export interface FilterStandardObjec {
    in: ObjectFilterArray[],
    order: string,
    out: ObjectFilterArray[],
  }
  export interface FilterObject {
    input: ObjectOfArray[],
    output: ObjectOfArray[],
    sortKeyword: string,
  }
    export interface PgTable {
    // column_name: string;
    // data_type: string;
    col: string;
    kieu: string;
    typeDisplay: any;
    alias: string;
    index: number;
  }
}

export default ConfigModels;
