import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
export const GetListLandTypeDetail = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", name = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    name && params.append("name", name.trim());
    return service.get(ApiUrl.GetListLandTypeDetail, params).then((res) => { return res }).catch(err => { throw err });
}
export const GetLandTypeDetailById = (id) => {
    const params = new URLSearchParams();
    params.append("landTypeDetailId", id);
    return service.get(ApiUrl.GetLandTypeDetailById.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const GetLookupProvince = () => {
    return service.get(ApiUrl.GetLookupProvince).then(res => { return res }).catch(err => { throw err });
}

export const CreateLandTypeDetail = (body) => {
    return service.post(ApiUrl.CreateLandTypeDetail, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateLandTypeDetail = (body) => {
    return service.post(ApiUrl.UpdateLandTypeDetail, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteLandTypeDetail = (id) => {
    const body = { id: id }
    return service.post(ApiUrl.DeleteLandTypeDetail, body).then(res => { return res }).catch(err => { throw err });
}