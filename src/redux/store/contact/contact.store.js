import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListContactManagement = (pageIndex = 1, pageSize = 10, sortExpression = "", userName = "", sendFrom = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    userName && params.append("name", userName);
    sendFrom && params.append("sendFrom", sendFrom);
    return service.get(ApiUrl.GetListContactManagement, params).then((response) => {
        return response;
    }).catch((err) => {
        throw err;
    })
}
export const GetContactDetailByCode = (code) => {
    const params = new URLSearchParams();
    params.append("id", code);
    return service.get(ApiUrl.GetContactDetail, params).then((res) => { return res }).catch((err) => { throw err })
}
export const GetDetailEmailTemplate = () => {
    const params = new URLSearchParams();
    params.append("code", "REPLYCONTACT");
    return service.get(ApiUrl.GetDetailEmailTemplate, params).then((res) => { return res }).catch((err) => { throw err })
}
export const ReplyUserContactByEmail = (data) => {
    if (!data) return;
    return service.post(ApiUrl.ReplyUserContactByEmail, data).then((res) => { return res }).catch((err) => { throw err })
}