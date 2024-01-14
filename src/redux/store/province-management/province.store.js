import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
const pAHTService = new PAHTService();
export const GetListProvince = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", name = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    name && params.append("name", name.trim());
    return service.get(ApiUrl.GetListProvince, params).then((res) => { return res }).catch(err => { throw err });
}
export const GetDetailProvince = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailProvince.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupProvince = () => {
    return service.get(ApiUrl.GetLookupProvince).then(res => { return res }).catch(err => { throw err });
}

export const CreateProvince = (body) => {
    return service.post(ApiUrl.CreateProvince, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateProvince = (body) => {
    return service.post(ApiUrl.UpdateProvince, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteProvince = (id) => {
    const params = new URLSearchParams();
    params.append("ProvinceId", id);
    return service.postParams(ApiUrl.DeleteProvince, params).then(res => { return res }).catch(err => { throw err });
}

export const CreateProvincePaht = (body) => {
    return pAHTService.post(ApiUrl.CreateProvincePaht, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateProvincePaht = (body) => {
    return pAHTService.put(ApiUrl.UpdateProvincePaht, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteProvincePaht = (id) => {
    return pAHTService.put(`${ApiUrl.DeleteProvincePaht}?id=${id}`).then(res => { return res }).catch(err => { throw err });
}