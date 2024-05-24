import Service from '../../../api/api-service';
import { ApiUrl } from '../../../api/api-url';
import * as config from '../../../common/config';

const service = new Service();

export const Log_GetListAll = (
  keyword,
  sortExpression = 'raiseDate desc',
  pageIndex = 1,
  pageSize = config.Configs.DefaultPageSize,
  level,
  startDate,
  endDate
) => {
  const params = new URLSearchParams();
  params.append('keyword', keyword);
  params.append('level', level);
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('pageIndex', pageIndex);
  params.append('pageSize', pageSize);
  params.append('sorting', sortExpression);

  return service
    .get(ApiUrl.Log_GetListAll, params)
    .then(
      (res) => res)
    .catch((err) => {
      throw err;
    });
};

export const Log_Delete = (id) => {
  let arr = id.map(x => "input="+ x);
  let params = "";
  if(arr.length > 0)
  {
      params = ""+ arr.toString().replaceAll(",","&")
  }
  return service
    .get(ApiUrl.Log_Delete(params))
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const Log_Detail = (id) => {
  return service
    .get(ApiUrl.Log_Detail(id))
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

