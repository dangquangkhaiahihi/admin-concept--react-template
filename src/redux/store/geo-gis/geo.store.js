import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();
export const UpdateGeogisColumnData = async (body) => {
  try {
    return await service
      .post(ApiUrl.UpdateGeogisColumnData, body)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    throw err;
  }
};
