import LayerSettingsModels from "../../map-data-model-b/layer-setting-models";
import ConfigModels from "./config-models";

namespace ModalEditLayerModels {
  export interface ModalEditLayerState {
    layerData: LayerSettingsModels.LayerSettingsModel;
    value: number;
    hasSave: boolean;
    dataSource: ConfigModels.SortDataSourceObject;
    viewDetail: ConfigModels.ObjectOfArray[];
    tooltip: ConfigModels.ObjectOfArray[];
    popup: ConfigModels.ObjectOfArray[];
    inputSetting: ConfigModels.ObjectOfArray[];
    outputSetting: ConfigModels.ObjectOfArray[];
    sortWidth: string;
  }
  export interface ModalEditLayerProps {
    layerData: LayerSettingsModels.LayerSettingsModel;
    setLayerData: Function;
    closeModal: Function;
  }
}

export default ModalEditLayerModels;
