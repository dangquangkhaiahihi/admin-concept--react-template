import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListFormTemplate = (
  pageIndex = 1,
  pageSize = 10,
  sortExpression = "",
  title = "",
  consultantCommunityId = null
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  title && params.append("title", title);
  consultantCommunityId !== null &&
    params.append("consultantCommunityId", consultantCommunityId);
  return service
    .get(ApiUrl.GetListFormTemplate, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailFormTemplate = (id) => {
  const params = new URLSearchParams();
  params.append("formTemplateId", id);
  return service
    .get(ApiUrl.GetDetailFormTemplate, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateFormTemplate = (data) => {
  return service
    .post(ApiUrl.CreateFormTemplate, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateFormTemplate = (data) => {
  return service
    .post(ApiUrl.UpdateFormTemplate, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteFormTemplate = (data) => {
  const params = new URLSearchParams();
  params.append("formTemplateId", data.formTemplateId);
  return service
    .get(ApiUrl.DeleteFormTemplate, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookupFormTemplate = () => {
  return service
    .get(ApiUrl.GetLookupFormExample)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
