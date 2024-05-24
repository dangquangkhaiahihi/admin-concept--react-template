import { ApiUrl } from "../../../api/api-url";
import * as MappingData from "./mapping-data";
import Service from "../../../api/api-service";
import {
  AddOneSlotToLoadingQueue,
  RemoveOneSlotToLoadingQueue,
} from "../loading/loading.store";
import NotificationService from "../../../common/notification-service";
import CreateDefaultMapData from "./default-map-data";
import * as Config from "../../../utils/configuration";

const service = new Service();

const BASEMAPTYPE = "MAP";
const LAYERTYPE = "LAYER";

const SAVELOADINGDATASTATE = "INITMAP/SAVELOADINGDATASTATE";
const SAVEARRAYDATASOURCE = "INITMAP/SAVEARRAYDATASOURCE";
const SAVEALLBASEMAPDEFAULT = "INITMAP/SAVEALLBASEMAPDEFAULT";
const SAVEMAPSETTING = "INITMAP/SAVEMAPSETTING";
const SAVEBASEMAPS = "INITMAP/BASEMAP";
const SAVELAYERS = "INITMAP/LAYERS";
const UPDATEOPENSETTINGGENERALMODAL = "INITMAP/UPDATEOPENSETTINGGENERALMODAL";
const SAVEDEFAULTCORDINATE = "INITMAP/SAVEDEFAULTCORDINATE";

const createSaveMapSettingAction = (data) => ({
  type: SAVEMAPSETTING,
  data: data,
});
const createSaveBaseMapsAction = (data) => ({ type: SAVEBASEMAPS, data: data });
const createSaveLayers = (data) => ({ type: SAVELAYERS, data: data });
const createUpdateOpenSettingGeneralModal = (data) => ({
  type: UPDATEOPENSETTINGGENERALMODAL,
  data: data,
});
const createSaveAllBaseMapFromApi = (data) => ({
  type: SAVEALLBASEMAPDEFAULT,
  data: data,
});
const createSaveArrayDataSoucre = (data) => ({
  type: SAVEARRAYDATASOURCE,
  data: data,
});
const createSaveLoadingDataState = (data) => ({
  type: SAVELOADINGDATASTATE,
  data: data,
});
const createDefaultCordinateState = (data) => ({
  type: SAVEDEFAULTCORDINATE,
  data: data,
});

export const UpdateMapSetting = (mapSettingNew) => (dispatch) =>
  dispatch(createSaveMapSettingAction(mapSettingNew));
export const UpdateBaseMap = (basemap) => (dispatch) =>
  dispatch(createSaveBaseMapsAction(basemap));
export const UpdateLayer = (layers) => (dispatch) =>
  dispatch(createSaveLayers(layers));
export const UpdateOpenGeneralSettingModal = (data) => (dispatch) =>
  dispatch(createUpdateOpenSettingGeneralModal(data));

export const PostCreateMap = (data) => {
  return (dispatch) => {
    data["created_by"] = "doducbinh"; // will delete later
    data["created_date"] = "2015-03-25"; // will delete later
    dispatch(AddOneSlotToLoadingQueue);
    return service
      .post(ApiUrl.CreateMap, data)
      .then((res) => {
        NotificationService.success("Tạo mới thành công");
        return true;
      })
      .catch((err) => {
        NotificationService.error(err.errorMessage);
        return false;
      })
      .finally(() => {
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};

export const PutUpdateMap = (data) => {
  return (dispatch) => {
    data["created_by"] = "doducbinh"; // will delete later
    data["created_date"] = "2015-03-25"; // will delete later
    data["modified_by"] = "doducbinh"; // will delete later
    data["modified_date"] = "2020-08-06T09:05:50.568Z"; // will delete later
    dispatch(AddOneSlotToLoadingQueue);

    return service
      .put(ApiUrl.UpdateMap + `?id=${data.id}`, data)
      .then((res) => {
        NotificationService.success("Cập nhật dữ liệu thành công");
        return true;
      })
      .catch((err) => {
        NotificationService.error(err.errorMessage);
        return false;
      })
      .finally(() => {
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};

export const GetAllBaseMap = () => {
  return (dispatch) => {
    dispatch(AddOneSlotToLoadingQueue);
    service
      .get(ApiUrl.GetAllBaseMapSetting, "")
      .then((res) => {
        if (!res.err && res.content) {
          dispatch(
            createSaveAllBaseMapFromApi(
              MappingData.MappingBaseMapArrayDefault(res.content)
            )
          );
        } else {
          //   console.log("Error:" + res.err);
        }
        return res;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};

export const GetListDataSource = () => {
  return (dispatch) => {
    dispatch(AddOneSlotToLoadingQueue);
    service
      .get(ApiUrl.GetPgSchema, "")
      .then((res) => {
        if (!res.err && res.content) {
          dispatch(
            createSaveArrayDataSoucre(
              MappingData.MappingListDataSource(res.content)
            )
          );
        } else {
          //   console.log("Error:" + res.err);
        }
        return res;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};

export const UpdateDefaultMapData = (planingId, mapId = null) => {
  return (dispatch, getState) => {
    dispatch(GetDefaultCordinate());
    const defaulCordinate = getState().initMap.defaultCordinate;
    const DefaultMapData = CreateDefaultMapData(planingId, mapId, defaulCordinate);
    console.log(DefaultMapData)
    dispatch(createSaveLoadingDataState(false));
    dispatch(
      createSaveMapSettingAction(
        MappingData.MappingSettingMapData(DefaultMapData)
      )
    );
    DefaultMapData.map_setting.map((mapsetting) => {
      if (mapsetting.type_map != BASEMAPTYPE)
        dispatch(createSaveLayers(MappingData.MappingLayersData(mapsetting)));
      else
        dispatch(
          createSaveBaseMapsAction(MappingData.MappingBaseMapData(mapsetting))
        );
    });
    dispatch(createSaveLoadingDataState(true));
  };
};

export const GetMapDetailById = (mapId, planingId) => {
  return (dispatch) => {
    dispatch(AddOneSlotToLoadingQueue);
    dispatch(createSaveLoadingDataState(false));
    const params = new URLSearchParams();
    params.append("id", mapId);
    params.append("planningId", planingId);
    params.append("planningId", planingId);
    return service
      .get(ApiUrl.GetMapById, params)
      .then((res) => {
        if (!res.err && res.content) {
          dispatch(
            createSaveMapSettingAction(
              MappingData.MappingSettingMapData(res.content)
            )
          );
          res.content.map_setting.map((mapsetting) => {
            if (mapsetting.type_map != BASEMAPTYPE)
              dispatch(
                createSaveLayers(MappingData.MappingLayersData(mapsetting))
              );
            else
              dispatch(
                createSaveBaseMapsAction(
                  MappingData.MappingBaseMapData(mapsetting)
                )
              );
          });
        } else {
          //   console.log("Error:" + res.err);
        }
        return res;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        dispatch(createSaveLoadingDataState(true));
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};
export const GetMapAnalysisById = (mapId, analysisId) => {
  return (dispatch) => {
    dispatch(AddOneSlotToLoadingQueue);
    dispatch(createSaveLoadingDataState(false));
    const params = new URLSearchParams();
    params.append("analysisId", analysisId);
    params.append("mapId", mapId);
    return service
      .get(ApiUrl.GetMapAnalysisById, params)
      .then((res) => {
        if (!res.err && res.content) {
          dispatch(
            createSaveMapSettingAction(
              MappingData.MappingSettingMapData(res.content)
            )
          );
          res.content.map_setting.map((mapsetting) => {
            if (mapsetting.type_map != BASEMAPTYPE)
              dispatch(
                createSaveLayers(MappingData.MappingLayersData(mapsetting))
              );
            else
              dispatch(
                createSaveBaseMapsAction(
                  MappingData.MappingBaseMapData(mapsetting)
                )
              );
          });
        } else {
          //   console.log("Error:" + res.err);
        }
        return res;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        dispatch(createSaveLoadingDataState(true));
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};
export const GetDefaultCordinate = () => {
  return (dispatch) => {
    var defaultCordinate = Config.getCookies(Config.DefaultCordinate);
    if (defaultCordinate) {
      dispatch(
        createDefaultCordinateState(
          defaultCordinate
        )
      );
    }
    else {
      service
        .get(ApiUrl.GetDefaultCordinate)
        .then((res) => {
          if (!res.err && res.content) {
            defaultCordinate = {
              zoom: res.content.zoom,
              min_zoom: res.content.minzoom,
              max_zoom: res.content.maxzoom,
              extent: res.content.extent[0] + "," + res.content.extent[1] + "," + res.content.extent[2] + "," + res.content.extent[3],
              center: res.content.center[0] + "," + res.content.center[1],
            };
            Config.setCookies(Config.DefaultCordinate, defaultCordinate);
            dispatch(
              createDefaultCordinateState(
                defaultCordinate
              )
            );
          } else {
            console.log('notok')
               console.log("Error:" + res.err);
          }
          return res;
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
        });
    }

  };
};

export const UpdateDefaultCordinate = (data) => {
  return (dispatch) => {
    return service
      .post(ApiUrl.UpdateDefaultCordinate, data)
      .then((res) => {
        NotificationService.success("Cập nhật thành công");
        var defaultCordinate = {
          zoom: data.zoom,
          min_zoom: data.minzoom,
          max_zoom: data.maxzoom,
          extent: data.leftExtentX + "," + data.leftExtentY + "," + data.rightExtentX + "," + data.rightExtentY,
          center: data.centerLng + "," + data.centerLat,
        };
        Config.setCookies(Config.DefaultCordinate, defaultCordinate);
        return true;
      })
      .catch((err) => {
        NotificationService.error(err.errorMessage);
        return false;
      })
      .finally(() => {
        dispatch(RemoveOneSlotToLoadingQueue);
      });
  };
};

const InitState = {
  hasLoadingData: false,

  arrayDataSource: [],

  isOpenSettingGeneralModal: false,

  mapSetting: {
    haveData: false,
  },

  baseMaps: {
    haveData: false,
    base_maps: [],
  },

  layers: {
    haveData: false,
    layer_categories: [],
  },

  listBaseMapDefault: [],
  defaultCordinate: {
    zoom: 0,
    min_zoom: 0,
    max_zoom: 0,
    extent: "",
    center: "",
  }
};

export default function InitMapReducer(state = InitState, action) {
  switch (action.type) {
    case SAVELOADINGDATASTATE:
      return { ...state, hasLoadingData: action.data };
    case SAVEBASEMAPS:
      return { ...state, baseMaps: action.data };
    case SAVEMAPSETTING:
      return { ...state, mapSetting: action.data };
    case SAVELAYERS:
      return { ...state, layers: action.data };
    case UPDATEOPENSETTINGGENERALMODAL:
      return { ...state, isOpenSettingGeneralModal: action.data };
    case SAVEALLBASEMAPDEFAULT:
      return { ...state, listBaseMapDefault: action.data };
    case SAVEARRAYDATASOURCE:
      return { ...state, arrayDataSource: action.data };
    case SAVEDEFAULTCORDINATE:
      return { ...state, defaultCordinate: action.data };
    default:
      return state;
  }
}
