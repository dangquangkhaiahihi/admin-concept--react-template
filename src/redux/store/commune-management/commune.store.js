import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
const pAHTService = new PAHTService();

export const GetListCommune = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", name = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    name && params.append("name", name.trim());
    return service.get("/api/admin/Administrative/GetListCommune", params).then((res) => { return res }).catch(err => { throw err });
}
export const GetDetailCommune = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailCommune.trim(), params).then(res => { return res }).catch(err => { throw err });
}
export const GetLookupCommune = () => {
    return service.get(ApiUrl.GetLookupCommune.trim()).then(res => { return res }).catch(err => { throw err });
}

export const CreateCommune = (body) => {
    return service.post(ApiUrl.CreateCommune, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateCommune = (body) => {
    return service.post(ApiUrl.UpdateCommune, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteCommune = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.postParams(ApiUrl.DeleteCommune, params).then(res => { return res }).catch(err => { throw err });
}

export const CreateCommunePaht = (body) => {
    return pAHTService.post(ApiUrl.CreateCommunePaht, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateCommunePaht = (body) => {
    return pAHTService.put(ApiUrl.UpdateCommunePaht, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteCommunePaht = (id) => {
    return pAHTService.put(`${ApiUrl.DeleteCommunePaht}?id=${id}`).then(res => { return res }).catch(err => { throw err });
}