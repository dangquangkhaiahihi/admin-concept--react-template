import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetAllDocumentByPlanning = (planningId, parentId) => {
    const params = new URLSearchParams();
    params.append("planningId", planningId);
    params.append("parentId", parentId);
    return service.get(ApiUrl.GetAllDocumentByPlanning, params).then(res => { return res }).catch(err => { throw err });
}

export const CreateFolder = (data) => {
    return service.post(ApiUrl.CreateFolder, data).then(res => { return res }).catch(err => { throw err });
}
export const RenameDocument = (data) => {
    return service.post(ApiUrl.ReNameDocument, data).then(res => { return res }).catch(err => { throw err });
}
export const CreateFile = (data) => {
    const fromData = new FormData();
    if (!data) return;
    data.Ordinal && fromData.append("Ordinal", data.Ordinal);
    data.ParentId && fromData.append("ParentId", data.ParentId);
    data.TypeId && fromData.append("TypeId", data.TypeId);
    data.PlanningId && fromData.append("PlanningId", data.PlanningId);
    data.files && data.files.map(item => fromData.append("files",item));
    return service.post(ApiUrl.CreateFile, fromData).then(res => { return res }).catch(err => { throw err });
}
export const RemoveDocument = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.postParams(ApiUrl.RemoveDocument, params).then(res => { return res }).catch(err => { throw err });
}

export const DownloadFile = (id) => {
    const params = new URLSearchParams();
    params.set('id', id);
    return service.getBinary(ApiUrl.DownloadFile, params).then(response => { return response }).catch(error => { return error });
}