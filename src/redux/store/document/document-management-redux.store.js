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

export const CreateFolder = (data) => {
    return service
        .post(ApiUrl.CreateFolder, data)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

export const CreateFile = (data) => {
    const fromData = new FormData();
    if (!data) return;
    fromData.append("parentId", data.parentId);
    fromData.append("uploadFolderPath", data.uploadFolderPath);
    data.uploadFile &&
        data.uploadFile.forEach(
            (item) => item && fromData.append("uploadFile", item)
        );
    data.planningId && fromData.append("PlanningId", data.planningId);
    return service
        .post(ApiUrl.CreateFile, fromData)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

export const RenameDocument = (data) => {
    const params = new URLSearchParams();
    if (!data) return;
    data.documentId && params.append("documentId", data.documentId);
    data.newFileName && params.append("newFileName", data.newFileName);
    return service.postParams(ApiUrl.ReNameDocument, params).then(res => { return res }).catch(err => { throw err });
}
export const SetDocumentStatus = (data) => {
    if (!data) return;
    return service.post(ApiUrl.SetDocumentStatus, data).then(res => { return res }).catch(err => { throw err });
}

export const RemoveDocument = (data) => {
    return service.post(ApiUrl.RemoveDocument, data).then(res => { return res }).catch(err => { throw err });
}

export const DocumentManagementMoveDocument = (data) => {
    return service
        .post(ApiUrl.MoveDocument, data)
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
            .get(ApiUrl.SearchDocument, params)
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

export const DocumentDownload = (data,callback) => {
    if(!data) return;
    return service.postBinary(ApiUrl.DownloadDocument, data,null,callback).then((res) => { return res }).catch(err => { throw err })
}


const InitState = {
    documentList: [],
    documentSearch: [],
    isSearch: false,
};

export default function DocumentManagementReducer(state = InitState, action) {
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
            return state;
    }
}