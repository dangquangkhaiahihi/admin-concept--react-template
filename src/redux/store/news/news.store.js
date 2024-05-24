import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListAll = (categoryId,title="",isHot=undefined, isFeature=undefined,isDelete=undefined,status=undefined,
    pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "modifiedDate desc",
    isQHT = false, isQHCC = false, isQHHTKT = false) => {
    const params = new URLSearchParams();
    isQHT && params.append('categoryId', 1); 
    isQHCC && params.append('categoryId', 3); 
    isQHHTKT && params.append('categoryId', 2); 
    //params.append('categoryId', categoryId);
    params.append('isHot', isHot);
    params.append('isFeature', isFeature);
    params.append('isDelete', isDelete);
    params.append('status', status);
    params.append('pageIndex',pageIndex);
    params.append('pageSize',pageSize);
    params.append('sorting',sortExpression);
    title && params.append('title',title);
    return service.get(ApiUrl.News_GetListAll,params).then(res => { return res }).catch(err => { throw err });
}

export const GetDetailNews = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service.get(ApiUrl.News_GetDetail.replace("{id}",id)).then(res => { return res }).catch(err => { throw err });
}

export const CreateNews = (body) => {
    return service.post(ApiUrl.News_Create, body).then(res => { return res }).catch(err => { throw err });
}

export const UpdateNews = (body) => {
    return service.post(ApiUrl.News_Update, body).then(res => { return res }).catch(err => { throw err });
}

export const DeleteNews = (id, xmin) => {
    //const params = new URLSearchParams();
    //params.append("id",id);
    return service.postParams(ApiUrl.News_Delete + "/" + id + "/" + xmin).then(res => { return res }).catch(err => { throw err });
}

export const EmptyTrash = () => {
    return service.post(ApiUrl.News_EmptyTrash).then(res => { return res }).catch(err => { throw err });
}

export const RestoreNews = (id) => {
    return service.postParams(ApiUrl.News_Restore.replace("{id}", id)).then(res => { return res }).catch(err => { throw err });
}