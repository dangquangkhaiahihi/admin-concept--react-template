import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();


export const GetSecurityMatrixDetail = (id) => {
  const params = new URLSearchParams();
  params.append("RoleId", id);
  return service
    .get(ApiUrl.GetSecurityMatrixDetail, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetScreenLookup = () => {
  return service
    .get(ApiUrl.GetScreenLookup)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const GetActionLookup = () => {
  return service
    .get(ApiUrl.GetActionLookup)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const UpdateSecurityMatrix = (data) => {
  if(!data) return;
    return service
    .post(ApiUrl.UpdateSecurityMatrix,data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
