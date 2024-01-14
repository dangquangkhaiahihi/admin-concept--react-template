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
    const res = await service.get(ApiUrl.AnalysisGetListAll, params);
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
      ApiUrl.AnalysisGetDetail.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const UpdateAnalysis = async (body) => {
  try {
    const res = await service.post(ApiUrl.AnalysisUpdate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const DeleteAnalysis = async (id) => {
  try {
    const res = await service.postParams(
      ApiUrl.AnalysisDelete.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const CreateAnalysis = async (body) => {
  try {
    const res = await service.post(ApiUrl.AnalysisCreate, body);
    return res;
  } catch (err) {
    throw err;
  }
}


