import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetListLinkGroup = (
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
    .get(ApiUrl.GetListLinkGroup, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailLinkGroup = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.GetDetailLinkGroup, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateLinkGroup = (body) => {
  return service
    .post(ApiUrl.CreateLinkGroup, body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateLinkGroup = (body) => {
  return service
    .post(ApiUrl.UpdateLinkGroup, body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteLinkGroup = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.DeleteLinkGroup, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
