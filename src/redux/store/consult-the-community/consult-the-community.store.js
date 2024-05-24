import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListConsultCommunity = (
  pageIndex,
  pageSize,
  sortExpression,
  data
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  data && data.planning && params.append("planning", data.planning);
  data && data.title && params.append("title", data.title);
  data && data.status && params.append("status", data.status);
  data && data.hotNew && params.append("hotNew", data.hotNew);
  data && data.startTime && params.append("startTime", data.startTime);
  data && data.endTime && params.append("endTime", data.endTime);
  return service
    .get(ApiUrl.GetListConsultCommunity, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailConsultCommunity = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.GetDetailConsultCommunity, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetConsultCommunityByPlanning = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .get(ApiUrl.GetConsultCommunityByPlanning, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetConsultCommunityStatusLookup = (id) => {
  return service
    .get(ApiUrl.GetConsultCommunityStatusLookup)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateConsultCommunity = (data) => {
  let formData = new FormData();
  data.title && formData.append("Title", data.title);
  data.startTime && formData.append("StartTime", data.startTime);
  data.endTime && formData.append("EndTime", data.endTime);
  data.isHotNew && formData.append("IsHotNew", data.isHotNew);
  data.statusId && formData.append("StatusId", data.statusId);
  data.order && formData.append("Order", data.order);
  data.content && formData.append("Content", data.content);
  data.formOpinion && formData.append("FormOpinion", data.formOpinion);
  data.planningId && formData.append("PlanningId", data.planningId);
  data.formTemplateStringModel &&
    formData.append("FormTemplateStringModel", data.formTemplateStringModel);
  data.documentUploadId &&
    formData.append("DocumentUploadId", data.documentUploadId);
  data.typeId &&
    formData.append("typeId", data.typeId);
  data.documents &&
    data.documents.map((item) => {    
      formData.append("Documents", item.fileId);  
    })
  return service
    .post(ApiUrl.CreateConsultCommunity, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateConsultCommunity = (data) => {
  let formData = new FormData();
  data.id && formData.append("Id", data.id);
  data.title && formData.append("Title", data.title);
  data.startTime && formData.append("StartTime", data.startTime);
  data.endTime && formData.append("EndTime", data.endTime);
  data.isHotNew && formData.append("IsHotNew", data.isHotNew);
  data.statusId && formData.append("StatusId", data.statusId);
  data.order && formData.append("Order", data.order);
  data.content && formData.append("Content", data.content);
  data.formOpinion && formData.append("FormOpinion", data.formOpinion);
  data.planningId && formData.append("PlanningId", data.planningId);
  data.file && formData.append("file", data.file);
  data.formTemplateStringModel &&
    formData.append("FormTemplateStringModel", data.formTemplateStringModel);
  data.isDeleteFile && formData.append("IsDeleteFile", data.isDeleteFile);
  data.documentUploadId &&
    formData.append("DocumentUploadId", data.documentUploadId);
  data.documents &&
  data.documents.map((item) => {    
    formData.append("Documents", item.fileId);  
  })
    
  return service
    .post(ApiUrl.UpdateConsultCommunity, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteConsultCommunity = (id, formTemplateId) => {
  const params = new URLSearchParams();
  id && params.append("ConsultId", id);
  id && params.append("FormTemplateId", formTemplateId);
  return service
    .postParams(ApiUrl.DeleteConsultCommunity, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailFeedback = (
  templateId,
  pageIndex,
  pageSize,
  sortExpression,
  name,
  phoneNumber,
  email
) => {
  const params = new URLSearchParams();
  templateId && params.append("templateId", templateId);
  pageIndex && params.append("pageIndex", pageIndex);
  pageSize && params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  name && params.append("name", name);
  phoneNumber && params.append("phoneNumber", phoneNumber);
  email && params.append("email", email);

  return service
    .get(ApiUrl.GetDetailFeedback, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const SaveReply = (data) => {
  return service
    .post(ApiUrl.SaveReply, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const ExportConsultantList = (data) => {
  const params = new URLSearchParams();
  data.templateId && params.append("templateId", data.templateId);
  data.pageIndex && params.append("pageIndex", data.pageIndex);
  data.pageSize && params.append("pageSize", data.pageSize);
  return service
    .postBinary(ApiUrl.ExportConsultantList, null, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
