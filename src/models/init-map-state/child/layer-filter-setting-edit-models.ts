import ConfigModels from "./config-models";
import LayerSettingsModels from "../../map-data-model-b/layer-setting-models";

namespace LayerFilterSettingEditModels {
  export interface LayerFilterSettingEditProps {
    dataSource: ConfigModels.SortDataSourceObject;
    sortWidth: string;
    inputSetting: ConfigModels.ObjectOfArray[];
    outputSetting: ConfigModels.ObjectOfArray[];
    setSortWidth: Function;
    setInputSetting: Function;
    setOutputSetting: Function;
  }
  export interface LayerFilterSettingEditState {
    value: number;
  }
}

export default LayerFilterSettingEditModels;
