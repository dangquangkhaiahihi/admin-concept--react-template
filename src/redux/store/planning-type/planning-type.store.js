import Service from "../../../api/api-service";
import PAHTService from "../../../api/api-service-custom";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config"

const service = new Service();

export const GetListPlanningType = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "", keyword = "", parentId = "") => {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    sortExpression && params.append("sort", sortExpression);
    keyword && params.append("keyword", keyword.trim());
    parentId && params.append("parentId", parentId);
    return service.get(ApiUrl.GetListPlanningType, params).then((res) => { return res }).catch(err => { throw err });
}
export const GetDetailPlanningType = (id) => {
    // const params = new URLSearchParams();
    // params.append("id", id);
    return service.get(ApiUrl.GetDetailPlanningType + '/' + id).then(res => { return res }).catch(err => { throw err });
}

export const CreatePlanningType = (body) => {
    console.log("đasadasdsadas",body);
    let formData = new FormData();
    body.name && formData.append('Name', body.name);
    body.parentId && formData.append('ParentId', body.parentId);
    body.orderBy && formData.append('OrderBy', body.orderBy);

    return service.post(ApiUrl.CreatePlanningType, formData).then(res => { return res }).catch(err => { throw err });
}

export const UpdatePlanningType = (body) => {
    let formData = new FormData();
    body.Name && formData.append('Name', body.Name);
    body.ParentId && formData.append('ParentId', body.ParentId);
    formData.append('Id', body.Id);
    body.OrderBy && formData.append('OrderBy', body.OrderBy);
    formData.append('Address', body.Address);
    body.csdlqG_Id && formData.append('CSDLQG_Id', body.csdlqG_Id);
    
    return service.post(ApiUrl.UpdatePlanningType, formData).then(res => { return res }).catch(err => { throw err });
}

export const DeletePlanningType = (id) => {
    // const params = new URLSearchParams();
    // params.append("Id", id);
    return service.postParams(ApiUrl.DeletePlanningType + '/' + id).then(res => { return res }).catch(err => { throw err });
}
