import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();
export const GetListRoleManagement = (pageIndex = 1, pageSize = 10, sortExpression = "",code="", name="") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    code && params.append("code", code);
    name && params.append("name", name);
    return service.get(ApiUrl.GetListRoleManagement, params).then((res) => { return res }).catch((err) => { throw err });
}
export const GetDetailRoleManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailRoleManagement, params).then(res => { return res }).catch((err) => { throw err });
}
export const CreateRoleManagement = (data) => {
    return service.post(ApiUrl.CreateRoleManagement, data).then((res) => { return res }).catch(err => { throw err });
}
export const UpdateRoleManagement = (data) => {
    return service.post(ApiUrl.UpdateRoleManagement, data).then((res) => { return res }).catch(err => { throw err });
}
export const DeleteRoleManagement = (data) => {
    const params = new URLSearchParams();
    params.append("id", data);
    return service.postParams(ApiUrl.DeleteRoleManagement, params).then((res) => { return res }).catch(err => { throw err });
}