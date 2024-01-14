import { ApiUrl } from "../../../api/api-url";
import Service from "../../../api/api-service";
import NotificationService from "../../../common/notification-service";

const service = new Service();


export const CreateBaseMap = (data) => {
    
    return service
        .post(ApiUrl.CreateBaseMap, data)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const UpdateBaseMap = (data) => {
    return service
        .post(ApiUrl.UpdateBaseMap, data)
        .then((res) => {
            //NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const DeleteBasemap = (Id) => {
    return service
        .post(`${ApiUrl.DeleteBaseMap}${Id}` )
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const UpdateMap = (data) => {
    return service
        .put(ApiUrl.UpdateMap, data)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const InitMap = (id) => {
    return service
        .get(`${ApiUrl.InitMap}?planningId=${id}`)
        .then((res) => {
            NotificationService.success("Khởi tạo map thành công");
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};
