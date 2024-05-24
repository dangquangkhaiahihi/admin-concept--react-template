import { ApiUrl } from "../../../api/api-url";
import Service from "../../../api/api-service";
import NotificationService from "../../../common/notification-service";

const service = new Service();


export const ActiveMapById = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service
        .get(ApiUrl.ActiveMapById, params)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};
export const DeActiveMapById = (id) => {
    const params = new URLSearchParams();
    params.append("id", id);
    return service
        .get(ApiUrl.DeactiveMapById, params)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};