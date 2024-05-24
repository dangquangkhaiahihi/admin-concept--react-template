import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import NotificationService from "../../../common/notification-service";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType, } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import { Configs } from "../../../common/config";
const service = new Service();

const LOADALLDOCUMENT = "DOCUMENT/LOADLISTDOCUMENT";
const LOADALLFOLDER = "DOCUMENT/LOADALLFOLDER";
const LOADALLFILE = "DOCUMENT/LOADALLFILE";
const DOCUMENTID = "DOCUMENT/DOCUMENTID";
const DOCUMENTDETAIL = "DOCUMENT/DOCUMENTDETAIL";
const LISTPROVINCE = "DOCUMENT/LISTPROVINCE";
const LISTDISTRICT = "DOCUMENT/LISTDISTRICT";
const LISTCOMMUNE = "DOCUMENT/LISTCOMMUNE";

const loadAllDocumentAction = (data) => ({
    type: LOADALLDOCUMENT,
    data:data,
});

const loadAllFolderAction = (data) => ({
    type: LOADALLFOLDER,
    data:data
});

const loadAllFileAction = (data) => ({
    type: LOADALLFILE,
    data:data
})

const documentDetailAction = (data) => ({
    type: DOCUMENTDETAIL,
    data:data,
})
const listProvinceAction = (data) => ({
    type: LISTPROVINCE,
    data:data,
})
const listDistrictAction = (data) => ({
    type: LISTDISTRICT,
    data: data,
})
const listCommuneAction = (data) => ({
    type: LISTCOMMUNE,
    data: data,
})

const InitState = {
    documentId: 0,
    documentDetail: {},
    listAllDocument: [],
    listAllFolder: [],
    listAllFile: [],
    listFolderIds: [],
    listProvince: [],
    listDistrict: [],
    listCommune: [],
    listBreadCrumbs:[],
    totalItemCount:0,
}

export default function InitDocumentReducer(state = InitState, action) {
    switch (action.type) {
        case LOADALLFOLDER:
            let listIds = [];
            if (action.data) {
                for (let index = 0; index < action.data.length; index++) {
                    listIds.push(`nodeId-${action.data[index].id}`);
                }
            }
            return { ...state, listAllFolder: action.data, listFolderIds: listIds};
        case LOADALLDOCUMENT:
            return { ...state, listAllDocument: action.data };
        case LOADALLFILE:
            return {
                ...state,
                listAllFile: action.data.listAllFile,
                totalItemCount: action.data.totalItemCount,
                listBreadCrumbs: action.data.listBreadCrumbs,
            };
        case DOCUMENTID:
            return { ...state, documentId: action.data };
        case DOCUMENTDETAIL:
            return { ...state, documentDetail: action.data };
        case LISTPROVINCE:
            return { ...state, listProvince: action.data };
        case LISTDISTRICT:
            return { ...state, listDistrict: action.data };
        case LISTCOMMUNE:
            return { ...state, listCommune: action.data };
        default:
            return state;
    }
}

export const CreateFolder = (data) => {
    return (dispatch) => {
        return service
            .post(ApiUrl.CreateFolder, data)
            .then((res) => {
                NotificationService.success("Tạo mới thành công");
                dispatch(GetAllFolder());
                return true;
            })
            .catch((err) => {
                //NotificationService.error(err.errorMessage);
                ShowNotification(
                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                    NotificationMessageType.Error
                );
                return false;
            });
    };
};

export const RenameDocument = (data) => {
    return (dispatch) => {
        return service.post(ApiUrl.ReNameDocument, data)
            .then(res => {
                NotificationService.success("Chỉnh sửa thành công");
                if (data.type===0)
                    dispatch(GetAllFolder());
                else
                    dispatch(GetAllFileByFolder(data.parentId));
                return true;
            })
            .catch(err => {
                ShowNotification(
                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                    NotificationMessageType.Error
                );
                return false;
            });
    }
}

export const DeleteFile=(data, page, rowsPerPage)=>
{
    return (dispatch) => {
        const params = new URLSearchParams();
        params.append("id", data.id);
        return service.postParams(ApiUrl.RemoveDocument, params)
            .then(res => {
                NotificationService.success("Xóa thành công");
                dispatch(GetAllFileByFolder(data.parentId, page, rowsPerPage));
                return true;
            })
            .catch(err => {
                ShowNotification(
                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                    NotificationMessageType.Error
                );
                return false;
            });
    }
}

export const CreateFile = (data) => {
    return (dispatch) => {
        const fromData = new FormData();
        if (!data) return;
        data.districtId && fromData.append("DistrictId", data.districtId);
        data.communeId && fromData.append("CommuneId", data.communeId);
        data.provinceId && fromData.append("ProvinceId", data.provinceId);
        data.Ordinal && fromData.append("Ordinal", data.Ordinal);
        data.ParentId && fromData.append("ParentId", data.ParentId);
        data.TypeId && fromData.append("TypeId", data.TypeId);
        data.files && data.files.map(item => fromData.append("files", item));
        console.log(data);
        return service.post(ApiUrl.CreateFile, fromData)
            .then(res => {
                if (res.content.status) {
                    NotificationService.success("Tạo mới thành công");
                    dispatch(GetAllFileByFolder(data.ParentId));
                    return true;
                }
                else {
                    NotificationService.error(res.err);
                    return false;
                }
                
            })
            .catch(err => {
                NotificationService.error(err.errorMessage);
                return false;
            });
    };
};

export const GetAllFileByFolder = (parentId, pageIndex=Configs.DefaultPageIndex, pageSize=Configs.DefaultPageSize) =>
//{
    (dispatch) => {
        const params = new URLSearchParams();
        params.append("parentId", parentId);
        params.append("pageIndex", pageIndex);
        params.append("pageSize", pageSize);
        service
            .get(ApiUrl.GetDocumentByFolder, params)
            .then((res) => {
                if (!res.err && res.content) {
                    dispatch(
                        loadAllFileAction({
                            listAllFile: res.content.documents.items,
                            totalItemCount: res.content.documents.totalItemCount,
                            listBreadCrumbs: res.content.breadCrums,
                        }
                        )
                    );
                } else {
                    //   console.log("Error:" + res.err);
                }
            })
            .catch((err) => {
                throw err;
            });
    };
//};

export const GetAllFileAndFolder = (parentId) =>
//{
    (dispatch) => {
        const params = new URLSearchParams();
        params.append("parentId", parentId);
        service
            .get(ApiUrl.GetAllFileByFolder, params)
            .then((res) => {
                if (!res.err && res.content) {
                    dispatch(
                        loadAllDocumentAction(
                            res.content
                        )
                    );
                } else {
                    //   console.log("Error:" + res.err);
                }
            })
            .catch((err) => {
                throw err;
            });
    };
//};

export const SaveCurrentData = (data) => 
    (dispatch) => {
        dispatch(documentDetailAction(data));
    };

export const GetAllFolder = () =>
//{
    (dispatch) => {
        console.log();
        service
            .get(ApiUrl.GetAllFolder)
            .then((res) => {
                if (!res.err && res.content) {
                    dispatch(
                        loadAllFolderAction(
                            res.content
                        )
                    );
                } else {
                    //   console.log("Error:" + res.err);
                }
            })
            .catch((err) => {
                throw err;
            });
    };
//};

export const RemoveDocument = (id) => {
    return (dispatch) => {
        const params = new URLSearchParams();
        params.append("id", id);
        return service.postParams(ApiUrl.RemoveDocument, params)
            .then(res => {
                NotificationService.success("Xóa thành công");
                dispatch(GetAllFolder());
                return true;
            })
            .catch(err => {
                ShowNotification(
                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                    NotificationMessageType.Error
                );
                return false;
            });
    }
}

export const GetLookupProvince = () => {
    return (dispatch) => {
        return service.get(ApiUrl.GetLookupProvince).then(res => {
            dispatch(listProvinceAction(res.content));
        }).catch(err => { throw err });
    }
}

export const GetLookupDistrict = () => {
    return (dispatch) => {
        //const params = new URLSearchParams();
        //params.append("provinceId", id);
        return service.get(ApiUrl.GetDistrictByProvinceId).then(res => {
            dispatch(listDistrictAction(res.content));
        }).catch(err => { throw err });
    }
}

export const GetLookupCommune = (id) => {
    return (dispatch) => {
        const params = new URLSearchParams();
        params.append("districtId", id);
        return service.get(ApiUrl.GetCommuneByDistrictId, params).then(res => {
            dispatch(listCommuneAction(res.content));
        }).catch(err => { throw err });
    }
}