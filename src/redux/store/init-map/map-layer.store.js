import { ApiUrl } from "../../../api/api-url";
import Service from "../../../api/api-service";
import NotificationService from "../../../common/notification-service";

const service = new Service();


export const CreateLayer = (data) => {

    return service
        .post(ApiUrl.CreateLayer, data)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
            return res
        })
        .catch((err) => {
            NotificationService.error(err.errorMessage);
            return false;
        });
};

export const UpdateLayer = (data) => {

    return service
        .post(ApiUrl.UpdateLayer, data)
        .then((res) => {
            //NotificationService.success("Cập nhật thành công");
        })
        
};

export const DeleteLayer = (id = '') => {

    return service
        .post(`${ApiUrl.DeleteLayer}/${id}`)
        .then((res) => {
            NotificationService.success("Cập nhật thành công");
        })
        
};

export const UpdateLayerLevel = async (data) => {

    try {
        const res = await service
            .post(ApiUrl.UpdateLayerLevel, data);
        //NotificationService.success("Cập nhật thành công");
    } catch (err) {
        NotificationService.error(err.errorMessage);
        return false;
    }
};

export const autoCuPlanning = async (layerCategoryId, planningId) => {

    try {
        const res = await service
            .post(`${ApiUrl.AutoCuPlanning}?layerCategoryId=${layerCategoryId}&planningId=${planningId}`);
        console.log('autoCuPlanning');
    } catch (err) {
        return false;
    }
}