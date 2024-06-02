import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListGroupManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.Name && params.append("Name", search.Name);

    return service.get(ApiUrl.GetListGroupManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailGroupManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailGroupManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateGroupManagement = (body) => {
    return service.post(ApiUrl.CreateGroupManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateGroupManagement = (body) => {
    return service.post(ApiUrl.UpdateGroupManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteGroupManagement = (id) => {
    return service.delete(ApiUrl.DeleteGroupManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupGroup = () => {
    return service.get(ApiUrl.GetLookupGroup).then(res => { return res }).catch(err => { throw err });
}
