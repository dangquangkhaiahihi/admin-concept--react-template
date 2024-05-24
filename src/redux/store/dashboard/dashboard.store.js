import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetPlanningConsultantingStatistics = (payload) => {
    return service.post(ApiUrl.GetPlanningConsultantingStatistics, payload).then(res => { return res }).catch(err => { throw err });
}

export const GetPlanningStatistics = (payload) => {
    return service.post(ApiUrl.GetPlanningStatistics, payload).then(res => { return res }).catch(err => { throw err });
}

export const GetPlanningByUnitStatistics = (payload) => {
    return service.post(ApiUrl.GetPlanningByUnitStatistics, payload).then(res => { return res }).catch(err => { throw err });
}

export const GetPlanningCoverageStatistics = (payload, planningTypeId) => {
    return service.post(ApiUrl.GetPlanningCoverageStatistics+`?planningTypeId=${planningTypeId}`, payload).then(res => { return res }).catch(err => { throw err });
}

export const GetAreaOfLandStatistics = (payload) => {
    return service.post(ApiUrl.GetAreaOfLandStatistics, payload).then(res => { return res }).catch(err => { throw err });
}

export const GetPlanningByTypeStatistics = (payload) => {
    return service.post(ApiUrl.GetPlanningByTypeStatistics, payload).then(res => { return res }).catch(err => { throw err });
}