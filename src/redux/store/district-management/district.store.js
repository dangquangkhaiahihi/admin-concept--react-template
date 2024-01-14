import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
const pAHTService = new PAHTService();

export const GetListDistrict = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", name = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    name && params.append("name", name.trim());
    return service.get(ApiUrl.GetListDistrict, params).then((res) => { return res }).catch(err => { throw err });
}
export const GetDetailDistrict = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailDistrict, params).then(res => { return res }).catch(err => { throw err });
}

export const CreateDistrict = (body) => {
    return service.post(ApiUrl.CreateDistrict, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateDistrict = (body) => {
    return service.post(ApiUrl.UpdateDistrict, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteDistrict = (id) => {
    const params = new URLSearchParams();
    params.append("Id", id);
    return service.postParams(ApiUrl.DeleteDistrict, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDistrictByProvinceId = (id) => {
    const params = new URLSearchParams();
    params.append("provinceId", id);
    return service.get(ApiUrl.GetDistrictByProvinceId, params).then(res => { return res }).catch(err => { throw err });
}
export const GetLookupDistrict = () => {
    return service.get(ApiUrl.GetLookupDistrict.trim()).then(res => { return res }).catch(err => { throw err });
}

export const CreateDistrictPaht = (body) => {
    return pAHTService.post(ApiUrl.CreateDistrictPaht, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateDistrictPaht = (body) => {
    return pAHTService.put(ApiUrl.UpdateDistrictPaht, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteDistrictPaht = (id) => {
    return pAHTService.put(`${ApiUrl.DeleteDistrictPaht}?id=${id}`).then(res => { return res }).catch(err => { throw err });
}