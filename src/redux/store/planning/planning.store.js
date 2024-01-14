import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListPlanning = (
  pageIndex,
  pageSize,
  sortExpression,
  name,
  type,
  level,
  statusId,
  planningunit,
  investor,
  approvalAgency,
  district,
  isQHHTKT = false, 
  isOtherPlanning = false,
  isQHT = false,
  isQHCC = false,
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  isQHHTKT && params.append("planningTypeId", 5);
  isOtherPlanning && params.append("planningTypeId", 6);
  //isQHT && params.append("planningLevelId", 2);
  sortExpression && params.append("sorting", sortExpression);
  name && params.append("planningName", name);
  type && params.append("planningTypeId", type);
  level && params.append("planningLevelId", level);
  statusId && params.append("planningStatusId", statusId);
  planningunit && params.append("planningUnitId", planningunit);
  investor && params.append("investorId", investor);
  approvalAgency && params.append("approvalAgencyId", approvalAgency);
  district && params.append("DistrictId", district);
  isQHCC && params.append("planningLevelId", 0);
  return service
    .get(ApiUrl.GetListPlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailPlaning = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.GetDetailPlaning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpPlanning = () => {
  return service
    .get(ApiUrl.GetLookUpPlanning)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpPlanningStatus = () => {
  return service
    .get(ApiUrl.GetLookUpPlanningStatus)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpPlanningLevel = () => {
  return service
    .get(ApiUrl.GetLookUpPlanningLevel)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpPlanningType = () => {
  return service
    .get(ApiUrl.GetLookUpPlanningType)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookUpDocumentType = () => {
  return service
    .get(ApiUrl.GetLookUpDocumentType)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookupLayerByPlanningId = (id) => {
  const params = new URLSearchParams();
  params.append("planningId", id);
  return service
    .get(ApiUrl.GetLookupLayerByPlanningId, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreatePlanning = (data) => {
  const formData = new FormData();

  data.Name && formData.append("Name", data.Name);
  data.PlanningCode && formData.append("PlanningCode", data.PlanningCode);
  data.DocumentUploadId &&
    formData.append("DocumentUploadId", data.DocumentUploadId);
  data.PlanningTypeId && formData.append("PlanningTypeId", data.PlanningTypeId);
  data.Place && formData.append("Place", data.Place);
  data.Order && formData.append("Order", data.Order);
  data.ApprovalAgencyId && formData.append("ApprovalAgencyId", data.ApprovalAgencyId);
  data.ConsultingUnit && formData.append("ConsultingUnit", data.ConsultingUnit);
  data.InvestorId && formData.append("InvestorId", data.InvestorId);
  data.PlanningStatusId &&
    formData.append("PlanningStatusId", data.PlanningStatusId);
  data.AgencySubmitted &&
    formData.append("AgencySubmitted", data.AgencySubmitted);
  data.PlanningUnitId && formData.append("PlanningUnitId", data.PlanningUnitId);
  data.PlanningLevelId &&
    formData.append("PlanningLevelId", data.PlanningLevelId);
  data.Population && formData.append("Population", data.Population);
  data.Acreage && formData.append("Acreage", data.Acreage);
  data.LandForConstruction &&
    formData.append("LandForConstruction", data.LandForConstruction);
  data.Report && formData.append("Report", data.Report);
  data.Note && formData.append("Note", data.Note);
  data.DocumentTypeId && formData.append("DocumentTypeId", data.DocumentTypeId);
  data.PlanningDistrictIds.length > 0 &&
    data.PlanningDistrictIds.map((item) =>
      formData.append("PlanningDistrictIds", item)
    );
  data.ApprovalAgencyLevelId &&
    formData.append("ApprovalAgencyLevelId", data.ApprovalAgencyLevelId);
  data.tifFile && formData.append("tifId", data.tifFile);
  data.shpFile && formData.append("shpId", data.shpFile);
  data.isNew && formData.append("IsNew", data.isNew);
  data.PlanningAdjustedId &&
    formData.append("PlanningAdjustedId", data.PlanningAdjustedId);

  return service
    .post(ApiUrl.CreatePlanning, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdatePlanning = (data) => {
  const formData = new FormData();
  data.Id && formData.append("Id", data.Id);
  data.Name && formData.append("Name", data.Name);
  data.PlanningCode && formData.append("PlanningCode", data.PlanningCode);
  data.DocumentUploadId &&
    formData.append("DocumentUploadId", data.DocumentUploadId);
  data.PlanningTypeId && formData.append("PlanningTypeId", data.PlanningTypeId);
  data.Place && formData.append("Place", data.Place);
  data.Order && formData.append("Order", data.Order);
  data.ApprovalAgencyId && formData.append("ApprovalAgencyId", data.ApprovalAgencyId);
  data.ConsultingUnit && formData.append("ConsultingUnit", data.ConsultingUnit);
  data.InvestorId && formData.append("InvestorId", data.InvestorId);
  data.PlanningStatusId &&
    formData.append("PlanningStatusId", data.PlanningStatusId);
  data.AgencySubmitted &&
    formData.append("AgencySubmitted", data.AgencySubmitted);
  data.PlanningUnitId && formData.append("PlanningUnitId", data.PlanningUnitId);
  data.PlanningLevelId &&
    formData.append("PlanningLevelId", data.PlanningLevelId);
  data.Population && formData.append("Population", data.Population);
  data.Acreage && formData.append("Acreage", data.Acreage);
  data.LandForConstruction &&
    formData.append("LandForConstruction", data.LandForConstruction);
  data.Report && formData.append("Report", data.Report);
  data.Note && formData.append("Note", data.Note);
  data.DocumentTypeId && formData.append("DocumentTypeId", data.DocumentTypeId);
  data.PlanningDistrictIds &&
    data.PlanningDistrictIds.length > 0 &&
    data.PlanningDistrictIds.map((item) =>
      formData.append("DistrictIds", item)
    );
  data.ApprovalAgencyLevelId &&
    formData.append("ApprovalAgencyLevelId", data.ApprovalAgencyLevelId);
  data.tifFile && formData.append("tifId", data.tifFile);
  data.shpFile && formData.append("shpId", data.shpFile);
  data.isNew && formData.append("IsNew", data.isNew);
  data.PlanningAdjustedId &&
    formData.append("PlanningAdjustedId", data.PlanningAdjustedId);

  return service
    .post(ApiUrl.UpdatePlanning, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeletePlanning = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.DeletePlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const LockPlanning = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.LockPlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const UnLockPlanning = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.UnLockPlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const ApprovalAgencyLevel = () => {
  return service
    .get(ApiUrl.ApprovalAgencyLevel)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const PlanningRelationshipType = () => {
  return service
    .get(ApiUrl.PlanningRelationshipType)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const PlanningRelationshipTypeById = (id) => {
  const params = new URLSearchParams();
  params.append("planningId", id);
  return service
    .get(ApiUrl.PlanningRelationshipTypeById, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const PlanningApprovedById = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.PlanningApprovedById, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetLookupDistrict = () => {
  return service
    .get(ApiUrl.GetLookupDistrict)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const GetLookupCommune = () => {
  return service
    .get(ApiUrl.GetLookupCommune)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const PutPlanningReletionship = (requestBody, planningId) => {
  const params = new URLSearchParams();
  params.append("planningId", planningId);
  return service
    .put(ApiUrl.PutPlanningRelationship, requestBody, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetAllBoundaries = () => {
  return service
    .get(ApiUrl.GetAllBoundaries)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const CheckExistedPlanning = (planningCode) => {
  const params = new URLSearchParams();
  params.append("planningCode", planningCode);
  return service
    .get(ApiUrl.CheckExistedPlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
