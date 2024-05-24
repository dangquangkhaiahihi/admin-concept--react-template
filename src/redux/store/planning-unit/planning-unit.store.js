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
    const res = await service.get(ApiUrl.PlanningUnitGetListAll, params);
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
      ApiUrl.PlanningUnitGetDetail.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const UpdatePlanning = async (body) => {
  try {
    const res = await service.post(ApiUrl.PlanningUnitUpdate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const DeletePlanning = async (id) => {
  try {
    const res = await service.postParams(
      ApiUrl.PlanningUnitDelete.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const CreatePlanning = async (body) => {
  try {
    const res = await service.post(ApiUrl.PlanningUnitCreate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetLookupPlanningUnit = async () => {
  try {
    const res = await service.get(ApiUrl.PlanningUnitGetLookUp);
    return res;
  } catch (error) {
    throw error;
  }
};

export const GetLookUpPlanningUnit = () => {
  return service
    .get(ApiUrl.PlanningUnitGetLookUp)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
