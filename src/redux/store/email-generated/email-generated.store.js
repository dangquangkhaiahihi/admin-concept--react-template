import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListEmailGenerated = (pageIndex = 1, pageSize = 10, sortExpression = "", title = "") => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  title && params.append("title", title);
  return service.get(ApiUrl.GetListEmailGenerated, params).then(res => { return res }).catch(err => { throw err });
}
export const GetDetailEmailGenerated = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service.get(ApiUrl.GetDetailEmailGenerated, params).then(res => { return res }).catch(err => { throw err });
}