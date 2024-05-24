import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();

export const GetStatisticsOfObjects = async (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sort = "",
  Year = "",
  PlanningTypeId = "",
  ObjType = "dat",
  ObjKind= "",
  DistrictId= ""
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  params.append("sort", sort);
  
  Year && params.append("Year", Year);
  PlanningTypeId && params.append("PlanningTypeId", PlanningTypeId);
  ObjType && params.append("ObjType", ObjType);
  ObjKind && params.append("ObjKind", ObjKind);
  DistrictId && params.append("DistrictId", DistrictId);
  try {
    const res = await service.get(ApiUrl.GetStatisticsOfObjects, params);
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetYearStatement = () => {
  return service
    .get(ApiUrl.GetYearStatement)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpObjectKind = () => {
  return service
    .get(ApiUrl.GetLookUpObjectKind)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetObjectGeogisOnMap = async (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  Year = "",
  PlanningTypeId = "",
  ObjType = "dat",
  ObjKind= "",
  DistrictId= ""
) => {
  const params = new URLSearchParams();
  params.append("PageIndex", pageIndex);
  params.append("PageSize", pageSize);
  
  Year && params.append("Year", Year);
  PlanningTypeId && params.append("PlanningTypeId", PlanningTypeId);
  ObjType && params.append("ObjType", ObjType);
  ObjKind && params.append("ObjKind", ObjKind);
  DistrictId && params.append("DistrictId", DistrictId);
  try {
    const res = await service.get(ApiUrl.GetObjectGeogisOnMap, params);
    return res;
  } catch (err) {
    throw err;
  }
};