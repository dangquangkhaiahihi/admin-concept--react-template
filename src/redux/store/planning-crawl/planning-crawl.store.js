import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
const service = new Service();
export const CrawlData = async () => {
  try {
    const res = await service.get(
      ApiUrl.PlanningCrawlData
    );
    return res;
  } catch (err) {
    throw err;
  }
};
export const Sync = async (data) => {
  try {
    let formData = new FormData();
    data && formData.append("crawlId", data);
    const res = await service.post(ApiUrl.PlanningSyncDown, formData);
    return res;
  } catch (err) {
    throw err;
  }
};


