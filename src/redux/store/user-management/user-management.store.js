import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();
const pAHTService = new PAHTService();
export const GetListUserManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", email = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    email && params.append("email", email);
    return service.get(ApiUrl.GetListUserManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailUserManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailUserManagement.trim(), params).then(res => { return res }).catch(err => { throw err });
}

export const CreateUserManagement = (body) => {
    return service.post(ApiUrl.CreateUserManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateUserManagement = (body) => {
    return service.post(ApiUrl.UpdateUserManagement, body).then(res => { return res }).catch(err => { throw err });
}

export const CreateWithMultiRoles = (body) => {
    return service.post(ApiUrl.CreateWithMultiRoles, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateWithMultiRoles = (body) => {
    return service.post(ApiUrl.UpdateWithMultiRoles, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteUserManagement = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.postParams(ApiUrl.DeleteUserManagement, params).then(res => { return res }).catch(err => { throw err });
}
export const GetRoleLookupUserManagement = () => {
    return service.get(ApiUrl.GetRoleLookupUserManagement).then(res => { return res }).catch(err => { throw err });
}
export const ActiveUser = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.postParams(ApiUrl.ActiveUser,params).then(res => { return res }).catch(err => { throw err });
}
export const DeActiveUser = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.postParams(ApiUrl.DeActiveUser,params).then(res => { return res }).catch(err => { throw err });
}
export const ResetPasswordUserManagement = (id,password) => {
    const params = new URLSearchParams();
    params.append("userId", id);
    params.append("Password", password);
    return service.postParams(ApiUrl.ResetPasswordUserManagement,params).then(res => { return res }).catch(err => { throw err });
}
export const GetLookUpReflectionProcessingUnit = () => {
    return pAHTService.get(ApiUrl.GetLookUpReflectionProcessingUnit)
    .then(res => { return res.content }).catch(err => { throw err });
}