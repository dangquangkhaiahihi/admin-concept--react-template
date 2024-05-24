import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetAllLogHistory = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", action = "", userName = "", description = "",createDate = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sortExpression", sortExpression);
    action && params.append("actions", action);
    userName && params.append("userName", userName.trim());
    description && params.append("description", description.trim());
    createDate && params.append("createDate", createDate);
    return service.get(ApiUrl.GetAllLogHistory, params).then((res) => { return res }).catch(err => { throw err });
}




