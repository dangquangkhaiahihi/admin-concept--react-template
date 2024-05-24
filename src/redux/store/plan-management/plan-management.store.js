import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListPlanManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.name && params.append("name", search.name);
    search.endDate && params.append("endDate", search.endDate);
    search.created_date && params.append("created_date", search.created_date);

    return service.get(ApiUrl.GetListPlanManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailPlanManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailPlanManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreatePlanManagement = (body) => {
    return service.post(ApiUrl.CreatePlanManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdatePlanManagement = (body) => {
    return service.post(ApiUrl.UpdatePlanManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeletePlanManagement = (id) => {
    return service.delete(ApiUrl.DeletePlanManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}