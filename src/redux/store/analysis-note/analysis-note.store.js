import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetListAll = async (
  analysisId,
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sort = ""
) => {
  const params = new URLSearchParams();
  params.append("analysisId", analysisId);
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  params.append("sort", sort);
  try {
    const res = await service.get(ApiUrl.AnalysisNoteGetListAll, params);
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
      ApiUrl.AnalysisNoteGetDetail.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const UpdateAnalysisNote = async (body) => {
  try {
    const res = await service.post(ApiUrl.AnalysisNoteUpdate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const DeleteAnalysisNote = async (id) => {
  try {
    const res = await service.postParams(
      ApiUrl.AnalysisNoteDelete.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const CreateAnalysisNote = async (body) => {
  try {
    const res = await service.post(ApiUrl.AnalysisNoteCreate, body);
    return res;
  } catch (err) {
    throw err;
  }
}


