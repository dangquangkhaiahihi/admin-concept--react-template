import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetListAll = async (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sort = "",
  keyword = ""
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  params.append("sort", sort);
  params.append("keyword", keyword);
  try {
    const res = await service.get(ApiUrl.ApprovalAgencyGetListAll, params);
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetDetail = async (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  try {
    const res = await service.get(
      ApiUrl.ApprovalAgencyGetDetail.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const UpdateApprovalAgency = async (body) => {
  try {
    const res = await service.post(ApiUrl.ApprovalAgencyUpdate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const DeleteApprovalAgency = async (id) => {
  try {
    const res = await service.postParams(
      ApiUrl.ApprovalAgencyDelete.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const CreateApprovalAgency = async (body) => {
  try {
    const res = await service.post(ApiUrl.ApprovalAgencyCreate, body);
    return res;
  } catch (err) {
    throw err;
  }
}
export const GetLookUpApprovalAgency = () => {
  return service
    .get(ApiUrl.ApprovalAgencyGetLookUp)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpApprovalAgencyLv = (id) => {
  return service
    .get(`${ApiUrl.ApprovalAgencyGetLookUp}?level=${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookupApprovalAgency = async (id) => {
  try {
    const res = await service.get(
      id
      ? ApiUrl.ApprovalAgencyGetLookupWithId.replace("{id}", id)
        : ApiUrl.ApprovalAgencyGetLookup
    );
    return res;
  } catch (err) {
    throw err;
  }
};
