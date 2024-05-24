import ConfigModels from "./config-models";

namespace ListItemsModels {
  export interface ListItemsProps {
    numberCase?:number;
    data: ConfigModels.ObjectOfArray[];
    dataSource?: {
      cols: ConfigModels.ObjectOfColsRaw[];
    };
    setDataSource?: Function;
    setData: Function;
    setSortWidth?: Function;
    dataSourceCols?: ConfigModels.ObjectOfColsRaw[];
    sortWidth?: string;
    tableName?: any;
  }
  export interface ListItemsState {
    listDatas: ConfigModels.ObjectOfArray[];
    checkAll: boolean;
    lockAxis: string;
    dataSource?: {
      cols: ConfigModels.ObjectOfColsRaw[];
    };
    table?: any;
  }
}

export default ListItemsModels;
