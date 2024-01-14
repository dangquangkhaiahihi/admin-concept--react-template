import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();


export const ImportShapeFileStep1 = (data) => {
    if (!data) return;
    const formData = new FormData();
    data.TableName && formData.append("TableName", data.TableName);
    data.file && formData.append("file", data.file);
    return service.post(ApiUrl.Shape_File_Step_1, formData).then(res => { return res }).catch(err => { throw err });
}
export const ImportShapeFileStep2 = (data) => {
    if (!data) return;
    const formData = new FormData();
    data.RootFolderName && formData.append("RootFolderName", data.RootFolderName);
    data.ShpFileName && formData.append("ShpFileName", data.ShpFileName);
    data.TableName && formData.append("TableName", data.TableName);
    return service.post(ApiUrl.Shape_File_Step_2, formData).then(res => { return res }).catch(err => { throw err });
}
export const ImportShapeFileStep3 = (data) => {
    if (!data) return;
    const formData = new FormData();
    data.RootFolderName && formData.append("RootFolderName", data.RootFolderName);
    data.TableName && formData.append("TableName", data.TableName);
    data.PlanningId && formData.append("PlanningId", data.PlanningId);
    data.styleName && formData.append("StyleName", data.styleName);
    console.log(data);
    return service.post(ApiUrl.Shape_File_Step_3, formData).then(res => { return res }).catch(err => { throw err });
}
export const ImportShapeFileStep4 = (data) => {
    if (!data) return;
    const formData = new FormData();
    data.RootFolderName && formData.append("RootFolderName", data.RootFolderName);
    data.TableName && formData.append("TableName", data.TableName);
    data.StyleName && formData.append("StyleName", data.StyleName);
    return service.post(ApiUrl.Shape_File_Step_4, formData).then(res => { return res }).catch(err => { throw err });
}
