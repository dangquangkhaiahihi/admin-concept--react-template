import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListHomePage = (pageIndex=1,pageSize=config.Configs.DefaultPageSize,sortExpression="order asc",title="") => {
    const params = new URLSearchParams();
    params.append('pageIndex',pageIndex);
    params.append('pageSize',pageSize);
    params.append('sortExpression',sortExpression);
    title && params.append('title',title);
    return service.get(ApiUrl.GetListHomePage,params).then(res => { return res }).catch(err => { throw err });
}

export const GetDetailHomePage = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.GetDetailHomePage, params).then(res => { return res }).catch(err => { throw err });
}

export const CreateHomePage = (body) => {
    return service.post(ApiUrl.CreateHomePage, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateHomePage = (body) => {
    return service.post(ApiUrl.UpdateHomePage, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteHomePage = (id) => {
    const params = new URLSearchParams();
    params.append("id",id);
    return service.postParams(ApiUrl.DeleteHomePage, params).then(res => { return res }).catch(err => { throw err });
}