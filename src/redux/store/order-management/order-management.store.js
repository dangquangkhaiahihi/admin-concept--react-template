import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListOrderManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", search = {}) => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    search.ClientId && params.append("ClientId", search.ClientId);
    search.UserName && params.append("UserName", search.UserName);
    // search.ProvinceId && params.append("ProvinceId", search.ProvinceId);
    // search.StartDate && params.append("StartDate", search.StartDate);
    // search.EndDate && params.append("EndDate", search.EndDate);

    return service.get(ApiUrl.GetListOrderManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailOrderManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailOrderManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateOrderManagement = (body) => {
    return service.post(ApiUrl.CreateOrderManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateOrderManagement = (body) => {
    return service.post(ApiUrl.UpdateOrderManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteOrderManagement = (id) => {
    return service.delete(ApiUrl.DeleteOrderManagement.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupOrder = () => {
    return service.get(ApiUrl.GetLookupOrder).then(res => { return res }).catch(err => { throw err });
}
