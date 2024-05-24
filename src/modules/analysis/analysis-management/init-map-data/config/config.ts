import ConfigModels from "../../../../../models/init-map-state/child/config-models";
import LayerSettingsModels from "../../../../../models/map-data-model-b/layer-setting-models";
import LayerCategoryModels from "../../../../../models/map-data-model-b/layer-category-models";
import { Circle, Fill, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import { Feature } from "ol";

export function CreateDataSourceObject(
  tableName = null,
  cols = null,
  wms = null,
  style = null,
  wmsParameters = null,
  wms_external = false
): ConfigModels.DataSourceObject {
  return {
    tableName: tableName || "",
    cols: ExchangeColsDataSoure(cols),
    wms: wms || "",
    style: style || "",
    wmsParameters: wmsParameters || "",
    wms_external: wms_external,
  };
}

export function ExchangeColsDataSoure(cols: any): any[] {
  const result: any[] = [];
  if (cols) cols.map((col: any) => result.push({ ...col, label: col.label }));
  return result;
}

export function CreateLayerSettingObject(
  layerName: string = "",
  minZoom: number = 0,
  maxZoom: number = 20,
  zIndex: number = 1,
  defaultTurnOn: boolean = false
): ConfigModels.LayerSettingObject {
  return {
    layerName: layerName,
    minZoom: minZoom,
    maxZoom: maxZoom,
    zIndex: zIndex,
    defaultTurnOn: defaultTurnOn,
  };
}

export function CreateListPropertyFromDataSourec(
  dataSource: any
): ConfigModels.ObjectOfArray[] {
  const result: ConfigModels.ObjectOfArray[] = [];
  dataSource.cols.map((cols: any) =>
    result.push(
      CreateObjectOfArrayListItem(
        cols.column_name,
        cols.data_type,
        cols.label,
        cols.checked
      )
    )
  );
  return result;
}

export function CreateLayerDisplayInfomationSettingObjectDefault(
  dataSource: any
) {
  return {
    viewDetail: CreateListPropertyFromDataSourec(dataSource),
    tooltip: CreateListPropertyFromDataSourec(dataSource),
    popup: CreateListPropertyFromDataSourec(dataSource),
  };
}

export function CreateUpdateLayerDisplayInfomationSettingObject(
  viewDetail: ConfigModels.ObjectOfArray[],
  tooltip: ConfigModels.ObjectOfArray[],
  popup: ConfigModels.ObjectOfArray[]
): ConfigModels.DisplayInformationSettingObject {
  return {
    viewDetail: viewDetail,
    tooltip: tooltip,
    popup: popup,
  };
}

export function CreateLayerFilterObjectDefault(dataSource: any) {
  return {
    input: CreateListPropertyFromDataSourec(dataSource),
    output: CreateListPropertyFromDataSourec(dataSource),
    sortKeyword: "",
  };
}

export function CreateUpdateLayerFilterObject(
  input: ConfigModels.ObjectOfArray[],
  output: ConfigModels.ObjectOfArray[],
  sortKeyword: string
): ConfigModels.FilterObject {
  return {
    input: input,
    output: output,
    sortKeyword: sortKeyword,
  };
}

export function MergeLayerPropertyToStandardObject(
  layerCategoryId: any,
  dataSource: any,
  layerSetting: any,
  layerViewSetting: any,
  layerFilterSetting: any
) {
  return {
    displayName: MergeLayerDisplayStandardData(dataSource, layerViewSetting),
    filterName: MergeFilterStandardData(layerFilterSetting),
    geoLayerName: layerSetting.layerName,
    // id: 0,
    //isCheck: layerSetting.defaultTurnOn,
    layerCategoryId: layerCategoryId,
    layerType: "wms",
    level: 1,
    maxZoom: layerSetting.maxZoom,
    minZoom: layerSetting.minZoom,
    name: layerSetting.layerName,
    table: dataSource.tableName,
    wms: dataSource.wms,
    wmsExternal: dataSource.wms_external,
    zindex: layerSetting.zIndex,
  };
}

export function MergeFilterStandardData(
  layerFilterSetting: ConfigModels.FilterObject
): ConfigModels.FilterStandardObjec {
  function CollectCheckedColumn(
    listData: ConfigModels.ObjectOfArray[]
  ): ConfigModels.ObjectFilterArray[] {
    const result: ConfigModels.ObjectFilterArray[] = [];
    listData.map((data) => {
      if (data.checked)
        result.push(
          CreateStandardObjectOfFilterArray(
            data.column_name,
            data.label,
            data.data_type,
            data.type_display
          )
        );
    });
    return result;
  }
  return {
    in: CollectCheckedColumn(layerFilterSetting.input),
    order: layerFilterSetting.sortKeyword,
    out: CollectCheckedColumn(layerFilterSetting.output),
  };
}

export function MergeLayerDisplayStandardData(
  dataSource: ConfigModels.SortDataSourceObject,
  layerViewSetting: ConfigModels.DisplayInformationSettingObject
) {
  function CollectCheckedColumn(
    listData: ConfigModels.ObjectOfArray[]
  ): string[] {
    const result: string[] = [];
    listData.map((data) => {
      if (data.checked) {
        result.push(data.column_name);
        return;
      }
    });
    return result;
  }
  const ViewDetail = CollectCheckedColumn(layerViewSetting.viewDetail);
  const Tooltip = CollectCheckedColumn(layerViewSetting.tooltip);
  const Popup = CollectCheckedColumn(layerViewSetting.popup);
  const cols: ConfigModels.StandardColsDisplay[] = [];
  dataSource.cols.map((col, index: number) =>
    cols.push({
      col: col.column_name,
      alias: col.label,
      index: index,
      kieu: col.data_type,
    })
  );
  return {
    viewdetail: {
      cols: ViewDetail,
      use: ViewDetail.length > 0 ? true : false,
    },
    cols: cols,
    popup: {
      cols: Popup,
      use: Popup.length > 0 ? true : false,
    },
    tooltip: {
      cols: Tooltip,
      use: Tooltip.length > 0 ? true : false,
    },
  };
}

export const getTableNameFormUrl = (urlWms: string) => {
  const StringArray = urlWms.split(":");
  return StringArray.pop();
};

export const CreateDefaultDisplayStandardObjec = (dataSourceCols: any): any => {
  const cols: any[] = [];
  dataSourceCols.map((col: any, index: number) =>
    cols.push({
      col: col.column_name,
      alias: col.label,
      index: index,
      kieu: col.data_type,
    })
  );
  return {
    viewdetail: {
      use: false,
      cols: [],
    },
    popup: {
      use: false,
      cols: [],
    },
    tooltip: {
      use: false,
      cols: [],
    },
    cols: cols,
  };
};

export const ConvertDisplayStandardPropertyToControlForm = (
  propertyCols: string[],
  dataSourceCols: LayerSettingsModels.LayerSettingsDisplayColModel[]
): ConfigModels.ObjectOfArray[] => {
  const ListChecked: ConfigModels.ObjectOfArray[] = [];
  const ListUnChecked: ConfigModels.ObjectOfArray[] = [];
  const isColumnSelected = (
    col: LayerSettingsModels.LayerSettingsDisplayColModel
  ) => {
    let checked = false;
    propertyCols.map((column) => {
      if (col.col === column) {
        checked = true;
        return;
      }
    });
    return checked;
  };
  const sortListChecked = () => {
    const result: ConfigModels.ObjectOfArray[] = [];
    propertyCols.map((column) => {
      ListChecked.map((data) => {
        if (data.column_name === column) {
          result.push({ ...data });
          return;
        }
      });
    });
    return result;
  };
  dataSourceCols.map((dataCols) => {
    if (isColumnSelected(dataCols))
      ListChecked.push(
        CreateObjectOfArrayListItem(
          dataCols.col,
          dataCols.kieu,
          dataCols.alias,
          true
        )
      );
    else
      ListUnChecked.push(
        CreateObjectOfArrayListItem(
          dataCols.col,
          dataCols.kieu,
          dataCols.alias,
          false
        )
      );
  });
  return [...sortListChecked(), ...ListUnChecked];
};

export const ConvertFilterStandardPropertyToControlForm = (
  propertyCols: LayerSettingsModels.LayerSettingsFilterInModel[],
  dataSourceCols: ConfigModels.ObjectOfColsRaw[]
): ConfigModels.ObjectOfArray[] => {
  const isColsHasChecked = (col: ConfigModels.ObjectOfColsRaw) => {
    let result = -1;
    propertyCols.map((colChecked, index: number) => {
      if (colChecked.col === col.column_name) {
        result = index;
        return;
      }
    });
    return result;
  };
  const ListChecked: ConfigModels.ObjectOfArray[] = [];
  const ListUnChecked: ConfigModels.ObjectOfArray[] = [];
  dataSourceCols.map((dataCols) => {
    const indexChecked = isColsHasChecked(dataCols);
    if (indexChecked != -1) {
      const ColChecked = propertyCols[indexChecked];
      ListChecked.push(
        CreateFilterAtomObjectFromLayerStandardData(
          ColChecked.col,
          ColChecked.alias,
          ColChecked.kieu,
          true,
          ColChecked.type_display || ""
        )
      );
    } else {
      ListUnChecked.push(
        CreateFilterAtomObjectFromLayerStandardData(
          dataCols.column_name,
          dataCols.column_name,
          dataCols.data_type,
          false,
          dataCols.type_display || ""
        )
      );
    }
  });
  return [...ListChecked, ...ListUnChecked];
};

export const ConvertStandardDataDisplayProperyToControlDataSource = (
  standardData: LayerSettingsModels.LayerSettingsDisplayModel
) => {
  const cols: ConfigModels.ObjectOfColsRaw[] = [];
  standardData.cols.map((col) =>
    cols.push(CreateObjectOfColsOfTableRaw(col.col, col.alias, col.kieu))
  );
  return { cols: cols };
};

export const ConverDataFromStoreToCreateMapUpdateObject = (
  initMapState: any
) => {
  const mapSetting = initMapState.mapSetting;
  const BaseMap = initMapState.baseMaps;
  const Layers = initMapState.layers;
  function ConverMapSettingArrayElement(
    id: number,
    map_id: number,
    name: string,
    type_map: string,
    layer_categories: LayerCategoryModels.LayerCategoryModel[] = [],
    base_maps: any[] = []
  ): ConfigModels.MapSettingObject {
    layer_categories.map((layerGroup, index) => {
      layerGroup.level = index;
    });
    return {
      id: id,
      map_id: map_id,
      name: name,
      type_map: type_map,
      layer_categories: layer_categories,
      base_maps: base_maps,
    };
  }
  return {
    id: mapSetting.id,
    planing_id: mapSetting.planing_id,
    name: mapSetting.name,
    z_index: mapSetting.z_index,
    zoom: mapSetting.zoom,
    min_zoom: mapSetting.min_zoom,
    max_zoom: mapSetting.max_zoom,
    projection: mapSetting.projection,
    extent: mapSetting.extent.join(),
    center: mapSetting.center.join(),
    is_active: mapSetting.is_active,
    map_setting: [
      ConverMapSettingArrayElement(
        BaseMap.id,
        BaseMap.map_id,
        BaseMap.name,
        BaseMap.type_map,
        [],
        BaseMap.base_maps
      ),
      ConverMapSettingArrayElement(
        Layers.id,
        Layers.map_id,
        Layers.name,
        Layers.type_map,
        Layers.layer_categories,
        []
      ),
    ],
  };
};

//--- create atom object

const CreateFilterAtomObjectFromLayerStandardData = (
  colName: string,
  colLabel: string,
  colType: string,
  checked: boolean,
  type_display: string
): ConfigModels.ObjectOfArray => ({
  column_name: colName,
  data_type: colType,
  label: colLabel,
  checked: checked,
  type_display,
});

const CreateObjectOfColsOfTableRaw = (
  name: string,
  label: string,
  type: string
): ConfigModels.ObjectOfColsRaw => ({
  column_name: name,
  data_type: type,
  label: label,
});

const CreateStandardObjectOfFilterArray = (
  columnName: string,
  columnLabel: string,
  columnType: string,
  columnTypeDisplay?: string
): ConfigModels.ObjectFilterArray => ({
  col: columnName,
  alias: columnLabel,
  kieu: columnType,
  type_display: columnTypeDisplay,
});

const CreateObjectOfArrayListItem = (
  colName: string,
  dataType: string,
  colLabel: string,
  checked: boolean = false
): ConfigModels.ObjectOfArray => ({
  column_name: colName,
  data_type: dataType,
  label: colLabel,
  checked: checked,
});

export const VectorImageLayerClassName = (layerId: number) =>
  `vector-image-layer-${layerId}`;

export function AddLabelValueToListLayers(
  listLayer: LayerSettingsModels.LayerSettingsModel[]
){
  const result: any = [];
  listLayer.map((layerObject) =>
    result.push({
      ...layerObject,
      label: layerObject.name,
      value: String(layerObject.id),
      opacity: "100",
    })
  );
  return result;
}

export function ConvertColsDataDetailViewToStandardData(
  cols: LayerSettingsModels.LayerSettingsDisplayColModel[]
): any {
  const result: any = {};
  cols.map((col) => {
    result[col.col] = col.alias;
  });
  return result;
}


export const Highlight_Feature_Style: any = (_feature: Feature) => {
  const _defaultWidth = 3;
  const _PolygonStyle = new Style({
    stroke: new Stroke({
      color: "rgba(0,230,241,1)",
      width: _defaultWidth,
    }),
    fill: new Fill({
      color: "rgba(223,16, 188,1)",
    }),
  });
  const _PointStyle = new Style({
    image: new Circle({
      radius: _defaultWidth * 2,
      fill: new Fill({
        color: "blue",
      }),
      stroke: new Stroke({
        color: "white",
        width: _defaultWidth / 2,
      }),
    }),
    zIndex: Infinity,
  });
  switch (true) {
    case _feature.getGeometry() instanceof Point:
      return _PointStyle;
    default:
      return _PolygonStyle;
  }
};

export const TileLayerClassName = (layerId: number) => `title-layer-${layerId}`;
