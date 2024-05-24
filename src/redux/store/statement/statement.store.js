import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

export const GetListStatement = (
  pageIndex,
  pageSize,
  sortExpression,
  title
) => {
  const params = new URLSearchParams();
  params.append("pageIndex", pageIndex);
  params.append("pageSize", pageSize);
  sortExpression && params.append("sortExpression", sortExpression);
  title && params.append("title", title);
  return service
    .get(ApiUrl.GetListStatement, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailStatement = (id) => {
  const params = new URLSearchParams();
  params.append("planningId", id);
  return service
    .get("/api/admin/Statement/GetStatementByPlanning", params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const GetStatementReport = (id) => {
  const params = new URLSearchParams();
  params.append("planningId", id);
  return service
    .get(ApiUrl.GetStatementReport, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const CreateStatement = (data) => {
  const formData = new FormData();
  data.id && formData.append("id", data.id)
  data.planningId && formData.append("planningId", data.planningId)
  data.title && formData.append("title", data.title)
  data.brief && formData.append("brief", data.brief)
  data.content && formData.append("content", data.content)
  data.numberOfDecisions && formData.append("numberOfDecisions", data.numberOfDecisions)
  data.issuedDate && formData.append("issuedDate", data.issuedDate)
  data.approvalAgency && formData.append("approvalAgency", data.approvalAgency)
  data.statementStatusId && formData.append("statementStatusId", data.statementStatusId)
  data.yearOfStatement && formData.append("yearOfStatement", data.yearOfStatement)
  data.DocumentUploadId && formData.append("DocumentUploadId", data.DocumentUploadId)
  return service
    .post(ApiUrl.CreateStatement, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const UpdateStatement = (data) => {
  const formData = new FormData();
  data.id && formData.append("id", data.id);
  data.planningId && formData.append("planningId", data.planningId);
  data.title && formData.append("title", data.title);
  data.brief && formData.append("brief", data.brief);
  data.content && formData.append("content", data.content);
  data.numberOfDecisions && formData.append("numberOfDecisions", data.numberOfDecisions);
  data.approvalAgency && formData.append("approvalAgency", data.approvalAgency);
  data.issuedDate && formData.append("issuedDate", data.issuedDate);
  data.statementStatusId && formData.append("statementStatusId", data.statementStatusId);
  data.yearOfStatement && formData.append("yearOfStatement", data.yearOfStatement);
  data.DocumentUploadId && formData.append("DocumentUploadId", data.DocumentUploadId)
  return service
    .post(ApiUrl.UpdateStatement, formData)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const DeleteStatement = (id) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return service
    .postParams(ApiUrl.DeleteStatement, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetStatementStatusLookup = () => {
  return service
    .get(ApiUrl.GetStatementStatusLookup)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
