import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
export const GetListLandType = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", name = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    name && params.append("name", name.trim());
    return service.get(ApiUrl.GetListLandType, params).then((res) => { return res }).catch(err => { throw err });
}
export const GetLandTypeById = (id) => {
    const params = new URLSearchParams();
    params.append("landTypeId", id);
    return service.get(ApiUrl.GetLandTypeById.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const LookupLandType = () => {
    return service.get(ApiUrl.LookupLandType).then(res => { return res }).catch(err => { throw err });
}

export const CreateLandType = (body) => {
    return service.post(ApiUrl.CreateLandType, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateLandType = (body) => {
    return service.post(ApiUrl.UpdateLandType, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteLandType = (id) => {
    const body = { id: id }
    return service.post(ApiUrl.DeleteLandType, body).then(res => { return res }).catch(err => { throw err });
}