import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import * as config from "../../../common/config";

const service = new Service();


export const CheckLogin = async (
  userName = "",
  passWord = "",
  isRemember = true,
) => {
  const params = new URLSearchParams();
  params.append("userName", userName);
  params.append("passWord", passWord);
  params.append("isRemember", isRemember);
  try {
    const res = await service.post(ApiUrl.PlanningSyncCheckLogin, params);
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetListPlanningSyncUp = async (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sort = "",
  keyword = "",
  status = null,
  isSuccess = null
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  params.append("sort", sort);
  params.append("keyword", keyword);
  params.append("status", status);
  params.append("isSuccess", isSuccess);
  try {
    const res = await service.get(ApiUrl.GetListPlanningSyncUp, params);
    return res;
  } catch (err) {
    throw err;
  }
};
export const GetListPlanningSyncDown = async (
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  sort = "",
  keyword = "",
  status = null
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  params.append("sort", sort);
  params.append("keyword", keyword);
  params.append("status", status);
  try {
    const res = await service.get(ApiUrl.GetListPlanningSyncDown, params);
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
      ApiUrl.PlanningSyncGetDetail.replace("{id}", id)
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const Sync = async (data) => {
  try {
    let formData = new FormData();
    data.planningId && formData.append("PlanningId", data.planningId);
    const res = await service.post(ApiUrl.PlanningSync, formData);
    return res;
  } catch (err) {
    throw err;
  }
};
export const SyncMany = async (data) => {
  try {
    let formData = new FormData();

    data.planningId &&
    data.planningId.map((item) => {    
      formData.append("PlanningId", item);  
    })

    const res = await service.post(ApiUrl.PlanningSyncMany, formData);
    return res;
  } catch (err) {
    throw err;
  }
};
export const Update = async (data) => {
  try {
    let formData = new FormData();
    data.planningId && formData.append("PlanningId", data.planningId);
    data.banVeHienTrang && data.banVeHienTrang.map((item) => {    
      formData.append("BanVeHienTrang", item.fileId);  
    })
    data.BanVeDinhHuongPhatTrienKhongGian && data.BanVeDinhHuongPhatTrienKhongGian.map((item) => {    
      formData.append("BanVeDinhHuongPhatTrienKhongGian", item.fileId);  
    })
    data.BanVeQuyHoachGiaoThong && data.BanVeQuyHoachGiaoThong.map((item) => {    
      formData.append("BanVeQuyHoachGiaoThong", item.fileId);  
    })
    data.BanVeQuyHoachSuDungDat && data.BanVeQuyHoachSuDungDat.map((item) => {    
      formData.append("BanVeQuyHoachSuDungDat", item.fileId);  
    })
    data.BanVeTongHopDuongDayDuongOng && data.BanVeTongHopDuongDayDuongOng.map((item) => {    
      formData.append("BanVeTongHopDuongDayDuongOng", item.fileId);  
    })
    const res = await service.post(ApiUrl.PlanningSyncUpdate, formData);
    return res;
  } catch (err) {
    throw err;
  }
};
export const RemoveConection = async () => {
  try {
    const res = await service.delete(
      ApiUrl.PlanningSyncRemoveConection
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const GetStatisticPlanningSyncUp = async () => {
  try {
    const res = await service.get(ApiUrl.StatisticPlanningSyncUp);
    return res;
  } catch (err) {
    throw err;
  }
};