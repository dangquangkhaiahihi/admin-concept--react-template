import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListEmailTemplates = (
  pageIndex = 1,
  pageSize = 10,
  sortExpression = "",
  code = "",
  title = ""
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  code && params.append("code", code);
  title && params.append("title", title);
  return service
    .get(ApiUrl.GetListEmailTemplates, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailEmailTemplate = (code) => {
  const params = new URLSearchParams();
  params.append("code", code);
  return service
    .get(ApiUrl.GetDetailEmailTemplate, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateEmailTemplate = (data) => {
  return service
    .post(ApiUrl.CreateEmailTemplate, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateEmailTemplate = (data) => {
  return service
    .post(ApiUrl.UpdateEmailTemplate, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteEmailTemplate = (data) => {
  return service
    .post(ApiUrl.DeleteEmailTemplate, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
