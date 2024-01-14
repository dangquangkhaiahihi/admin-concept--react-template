import { ApiUrl } from "../../../api/api-url";
import Service from "../../../api/api-service";
import NotificationService from "../../../common/notification-service";

const service = new Service();


export const CreateLayerCategory = (data) => {

    return service
        .post(ApiUrl.CreateLayerCategory, data)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const UpdateLayerCategory = (data) => {

    return service
        .post(ApiUrl.UpdateLayerCategory, data)
        .then((res) => {
            //NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const DeleteLayerCategory = (id = '') => {

    return service
        .post(`${ApiUrl.DeleteLayerCategory}/${id}`)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        
};

export const GetDetailLayerCategory = (id = '') => {

    return service
        .get(`${ApiUrl.GetDetailLayerCategory}/${id}`)
        .then((res) => {
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const UpdateLayerCategoryLevel = (data) => {

    return service
        .post(ApiUrl.UpdateLayerCategoryLevel, data)
        .then((res) => {
            //NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const GetLookupLayerCategoryType = (Keyword, PageIndex, PageSize) => {
    const params = new URLSearchParams();
    Keyword && params.append("Keyword", Keyword);
    PageIndex && params.append("PageIndex", PageIndex);
    PageSize && params.append("PageSize", PageSize);
    return service
        .get(ApiUrl.GetLookupLayerCategoryType, params)
        .then((res) => {
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};
