import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListDepositManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.ClientId && params.append("ClientId", search.ClientId);
    search.Name && params.append("Name", search.Name);
    // search.UserId && params.append("UserId", search.UserId);
    // search.ProvinceId && params.append("ProvinceId", search.ProvinceId);
    // search.StartDate && params.append("StartDate", search.StartDate);
    // search.EndDate && params.append("EndDate", search.EndDate);

    return service.get(ApiUrl.GetListDepositManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailDepositManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailDepositManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateDepositManagement = (body) => {
    return service.post(ApiUrl.CreateDepositManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateDepositManagement = (body) => {
    return service.post(ApiUrl.UpdateDepositManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteDepositManagement = (id) => {
    return service.delete(ApiUrl.DeleteDepositManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}
