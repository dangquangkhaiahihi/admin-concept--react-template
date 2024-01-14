import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetListServiceLink = (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sortExpression = "",
  name = ""
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  name && params.append("name", name.trim());
  return service
    .get(ApiUrl.GetListServiceLink, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailServiceLink = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.GetDetailServiceLink, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateServiceLink = (body) => {
  return service
    .post(ApiUrl.CreateServiceLink, body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateServiceLink = (body) => {
  return service
    .post(ApiUrl.UpdateServiceLink, body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteServiceLink = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.DeleteServiceLink, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const GetLookupLinkGroup = () => {
  return service
    .get(ApiUrl.GetLookupLinkGroup)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
