import ConfigModels from "./config-models";
import LayerSettingsModels from "../../map-data-model-b/layer-setting-models";

namespace LayerInfomationViewEditModels {
  export interface LayerInfomationViewEditProps {
    table: string,
    viewDetail: ConfigModels.ObjectOfArray[];
    tooltip: ConfigModels.ObjectOfArray[];
    popup: ConfigModels.ObjectOfArray[];
    dataSource: ConfigModels.SortDataSourceObject;
    setTooltip: (data: ConfigModels.ObjectOfArray[]) => any;
    setViewDetail: (data: ConfigModels.ObjectOfArray[]) => any;
    setPopup: (data: ConfigModels.ObjectOfArray[]) => any;
    setDataSource: (data: ConfigModels.SortDataSourceObject) => any;
  }
  export interface LayerInfomationViewEditState {
    //dataSource: ConfigModels.SortDataSourceObject;
    value: number;
    // pgTable: ConfigModels.ObjectOfArray[];
    // newViewDetail:ConfigModels.ObjectOfArray[];
    // newValueTooltip: ConfigModels.ObjectOfArray[],
    // newValuePopup: ConfigModels.ObjectOfArray[],
  }
}

export default LayerInfomationViewEditModels;
