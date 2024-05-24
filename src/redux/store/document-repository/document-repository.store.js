import { Map } from "immutable";
import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

const GET_ALL_DOCUMENTS_BY_PARENT_ID = "GET_ALL_DOCUMENTS_BY_PARENT_ID";
const SEARCH_DOCUMENT = "SEARCH_DOCUMENT";

export const onGetAllDocumentByParentId = (documentList, isSearch = false) => ({
  type: GET_ALL_DOCUMENTS_BY_PARENT_ID,
  documentList,
  isSearch,
});

export const onSearchDocument = (documentSearch, isSearch = true) => ({
  type: SEARCH_DOCUMENT,
  documentSearch,
  isSearch,
});

export const DocumentRepositoryGetAllDocumentByParentId = (parentId = 0, type = null, showUI) => {
  return (dispatch) => {
    const params = new URLSearchParams();
    params.append("parentId", parentId);
    if (!!type) {
      params.append("type", type);
    }
          showUI && params.append("showUI", showUI);
    return service
      .get(ApiUrl.DocumentRepositoryGetAllDocumentByParentId, params)
      .then((res) => {
        let _dataList = (res && res.content) || [];
        dispatch(onGetAllDocumentByParentId(_dataList));
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};
export const GetAllDocumentByPlanningId = (planningId, parentId = 0) => {
  return (dispatch) => {
    const params = new URLSearchParams();
    params.append("parentId", parentId);
    params.append("planningId", planningId);
    return service
      .get(ApiUrl.GetAllDocumentByPlanning, params)
      .then((res) => {
        let _dataList = (res && res.content) || [];
        dispatch(onGetAllDocumentByParentId(_dataList));
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const DocumentRepositoryCreateFolder = (data) => {
  return service
    .post(ApiUrl.DocumentRepositoryCreateFolder, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DocumentRepositoryUploadDocument = (data) => {
  const fromData = new FormData();
  fromData.append("parentId", data.parentId);
    fromData.append("uploadFolderPath", data.uploadFolderPath);
    data.districtId && fromData.append("districtId", data.districtId);
    fromData.append("showUI", data.showUi);
  data.uploadFile &&
    data.uploadFile.forEach(
      (item) => item && fromData.append("uploadFile", item)
    );
  return service
    .post(ApiUrl.DocumentRepositoryUploadDocument, fromData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DocumentRepositoryDownloadDocument = (listItemPaths, callback) => {
  if (!listItemPaths) return;
  return service.postBinary(ApiUrl.DownloadDocument, listItemPaths, null, callback).then((res) => { return res }).catch(err => { throw err });
};

export const DocumentRepositoryRenameDocument = (data) => {
  const params = new URLSearchParams();
  params.append("documentId", data.documentId);
    params.append("newFileName", data.newFileName);
    data.title && params.append("title", data.title);
    data.districtId && params.append("districtId", data.districtId);
  return service
    .postParams(ApiUrl.DocumentRepositoryRenameDocument, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DocumentRepositoryDeleteDocument = (data) => {
  return service
    .post(ApiUrl.DocumentRepositoryDeleteDocument, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DocumentRepositoryMoveDocument = (data) => {
  return service
    .post(ApiUrl.DocumentRepositoryMoveDocument, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DocumentRepositorySearchDocument = (data) => {
  return (dispatch) => {
    const params = new URLSearchParams();
    params.append("parentId", data.parentId);
    params.append("fileName", data.fileName);
    return service
      .get(ApiUrl.DocumentRepositorySearchDocument, params)
      .then((res) => {
        let _dataList = (res && res.content) || [];
        dispatch(onSearchDocument(_dataList));
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const DocumentRepositoryGetParentDocumentById = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.DocumentRepositoryGetParentDocumentById, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const initialState = Map({
  documentList: [],
  documentSearch: [],
  isSearch: false,
}).toJS();

export default function DocumentRepositoryReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_ALL_DOCUMENTS_BY_PARENT_ID:
      return {
        ...state,
        documentList: action.documentList,
        isSearch: false,
      };
    case SEARCH_DOCUMENT:
      return {
        ...state,
        documentSearch: action.documentSearch,
        isSearch: true,
      };
    default:
      return { ...state };
  }
}
