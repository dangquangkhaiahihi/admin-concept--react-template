import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListClientManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.Name && params.append("Name", search.Name);
    search.PhoneNumber && params.append("PhoneNumber", search.PhoneNumber);
    search.ClientType && params.append("ClientType", search.ClientType);
    search.IsConfirm !== undefined && params.append("IsConfirm", search.IsConfirm);
    search.IsActive !== undefined && params.append("IsActive", search.IsActive);

    return service.get(ApiUrl.GetListClientManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailClientManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailClientManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateClientManagement = (body) => {
    return service.post(ApiUrl.CreateClientManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateClientManagement = (body) => {
    return service.post(ApiUrl.UpdateClientManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteClientManagement = (id) => {
    return service.delete(ApiUrl.DeleteClientManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupClient = () => {
    return service.get(ApiUrl.GetLookupClient).then(res => { return res }).catch(err => { throw err });
}
