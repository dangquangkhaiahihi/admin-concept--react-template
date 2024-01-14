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
    const res = await service.get(ApiUrl.InvestorGetListAll, params);
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetDetail = async (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  try {
    const res = await service.get(ApiUrl.InvestorGetDetail.replace("{id}", id));
    return res;
  } catch (err) {
    throw err;
  }
};

export const UpdateInvestor = async (body) => {
  try {
    const res = await service.post(ApiUrl.InvestorUpdate, body);
    return res;
  } catch (err) {
    throw err;
  }
};

export const DeleteInvestor = async (id) => {
  try {
    const res = await service.postParams(
      ApiUrl.InvestorDelete.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const CreateInvestor = async (body) => {
  try {
    const res = await service.post(ApiUrl.InvestorCreate, body);
    return res;
  } catch (err) {
    throw err;
  }
}
export const GetLookUpInvestor = () => {
  return service
    .get(ApiUrl.InvestorGetLookUp)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookupInvestor= async () => {
  try {
    const res = await service.get(ApiUrl.InvestorGetLookup);
    return res;
  } catch (err) {
    throw err;
  }
};
