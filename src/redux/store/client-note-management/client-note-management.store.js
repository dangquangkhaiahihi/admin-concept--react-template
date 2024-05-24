import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListClientNoteManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.Note && params.append("Note", search.Note);
    search.ClientId && params.append("ClientId", search.ClientId);
    search.UserId && params.append("UserId", search.UserId);

    return service.get(ApiUrl.GetListClientNoteManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailClientNoteManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailClientNoteManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateClientNoteManagement = (body) => {
    return service.post(ApiUrl.CreateClientNoteManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateClientNoteManagement = (body) => {
    return service.post(ApiUrl.UpdateClientNoteManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteClientNoteManagement = (id) => {
    return service.delete(ApiUrl.DeleteClientNoteManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupClientNote = () => {
    return service.get(ApiUrl.GetLookupClientNote).then(res => { return res }).catch(err => { throw err });
}
