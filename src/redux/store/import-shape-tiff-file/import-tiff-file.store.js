import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const ImportTiffFile = (data) => {
  if (!data) return;
  const formData = new FormData();
  data.TiffName && formData.append("TiffName", data.TiffName);
  data && formData.append("file", data.file);
  return service
    .post(ApiUrl.Import_Tiff_File, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

