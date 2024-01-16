/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import {
  DialogActions,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Typography,
  IconButton,
  makeStyles,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as appActions from "../../../../core/app.store";
import * as planningAction from "../../../../redux/store/planning/planning.store";
import * as districtAction from "../../../../redux/store/district-management/district.store";
import * as ApprovalAgency from "../../../../redux/store/approval-agency/approval-agency.store";
import * as Investor from "../../../../redux/store/investor/investor.store";
import * as PlanningUnit from "../../../../redux/store/planning-unit/planning-unit.store";

import {
  NotificationMessageType,
  changeAlias,
  APIUrlDefault,
} from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import FileManagement from "../../../../components/file_management/file_management";
import { UrlCollection } from "../../../../common/url-collection";
import { parseDecimal, regexDecial } from "../../../../common/validateDecimal";

const defaultPlace = "Sơn La";
const consultingUnitDefault = "N/A";
const orderDefault = 1;

function AddRecordsManagement(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { onClose, onSuccess, showLoading, isOtherPlanning, isQHCC, isQHHTKT } = props;
  const cgisId = localStorage.getItem("cgisId");

  const [planningLookUpModel, setPlanningLookUpModel] = useState(null);
  const [planningStatusModel, setPlanningStatusModel] = useState([]);
  const [planningLevelModel, setPlanningLevelModel] = useState([]);
  const [planningTypeModel, setPlanningTypeModel] = useState([]);
  const [documentTypeModel, setDocumentTypeModel] = useState([]);
  const [approvalAgencyModel, setApprovalAgencyModel] = useState([]);
  const [approvalAgencyGetLookUp, setApprovalAgencyGetLookUp] = useState([]);
  const [investorModel, setInvestorModel] = useState([]);
  const [planningUnitModel, setPlanningUnitModell] = useState([]);
  const [lookupCommuneModel, setLookupCommuneModel] = useState([]);
  const [planningStatus, setPlanningStatus] = useState("");
  const [planningLevel, setPlanningLevel] = useState("");
  const [planningType, setPlanningType] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [approvalAgency, setApprovalAgency] = useState("");
  const [lookupCommune, setLookupCommune] = useState(null);
  const [recordsManagementData, setRecordsManagementData] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const txtPlanningCode = document.getElementById("txtPlanningCode");
  const [isExistPlanningCode, setIsExistPlanningCode] = useState(false);
  const [planningAdjusted, setPlanningAdjusted] = useState("");
  const [planningAgency, setPlanningAgency] = useState("");
  const [investorSelected, setInvestorSelected] = useState("");
  const [planningUnitSelected, setPlanningUnitSelected] = useState("");

  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);
  const [tifFiles, setTifFiles] = useState([]);
  const [tifFilesTemp, setTifFilesTemp] = useState([]);
  const [isShowTif, setShowTif] = useState(false);
  const [zipFiles, setZipFiles] = useState([]);
  const [zipFilesTemp, setZipFilesTemp] = useState([]);
  const [isShowZip, setShowZip] = useState(false);
  const [tifName, setTifName] = useState(null);
  const [zipName, setZipName] = useState(null);
  const [valueRadio, setValueRadio] = useState(true);

  const { register, handleSubmit, errors, setValue, clearErrors, setError } =
    useForm({
      mode: "all",
      reValidateMode: "onBlur",
    });

  useEffect(() => {
    onGetData();
  }, []);

  const onGetData = () => {
    showLoading(true);
    Promise.all([
      onGetLookUpPlanning(),
      onGetLookUpPlanningStatus(),
      onGetLookUpPlanningLevel(),
      onGetLookUpPlanningType(),
      onGetLookUpDocumentType(),
      getApprovalAgencyLevel(),
      getLookupDistrict(),
      onGetLookUpApprovalAgency(),
      onGetLookUpInvestor(),
      onGetLookUpPlanningUnit(),
    ])
      .then((res) => {
        const [
          planningLookUp,
          status,
          level,
          type,
          documentType,
          approvalAgency,
          lookupCommune,
          approvalAgencyLookUp,
          investorLookUp,
          planningUnitLookUp,
        ] = res;
        planningLookUp &&
          planningLookUp.content &&
          setPlanningLookUpModel(planningLookUp.content);
        status && status.content && setPlanningStatusModel(status.content);
        level && level.content && setPlanningLevelModel(level.content);
        type && type.content && setPlanningTypeModel(type.content);
        documentType &&
          documentType.content &&
          setDocumentTypeModel(documentType.content);
        approvalAgency &&
          approvalAgency.content &&
          setApprovalAgencyModel(approvalAgency.content);
        lookupCommune &&
          lookupCommune.content &&
          setLookupCommuneModel(lookupCommune.content);
        approvalAgencyLookUp?.content &&
          setApprovalAgencyGetLookUp(approvalAgencyLookUp?.content);
        investorLookUp?.content && setInvestorModel(investorLookUp?.content);
        planningUnitLookUp?.content &&
          setPlanningUnitModell(planningUnitLookUp?.content);
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const onGetLookUpPlanning = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanning().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpPlanningStatus = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningStatus().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpPlanningLevel = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningLevel().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const getApprovalAgencyLevel = () => {
    return new Promise((resolve, reject) => {
      planningAction.ApprovalAgencyLevel().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const getLookupDistrict = () => {
    return new Promise((resolve, reject) => {
      districtAction.GetLookupDistrict().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpPlanningType = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningType().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpDocumentType = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpDocumentType().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onConfirm = (data) => {
    if (!data) {
      return;
    } else if (isExistPlanningCode) {
      if (txtPlanningCode) txtPlanningCode.focus();
      return;
    } else {
      setRecordsManagementData(data);
      showLoading(true);

      let params = {
        Name: data?.planningName || null,
        PlanningCode: data?.planningCode || null,
        Place: !isOtherPlanning || !isQHCC? data?.place : defaultPlace,
        PlanningTypeId: !isOtherPlanning ? (planningType.id || null) : 6,
        Order: !isOtherPlanning ? parseInt(data?.order) : orderDefault,
        ApprovalAgencyId: !isOtherPlanning ? planningAgency?.id : null,
        ConsultingUnit: !isOtherPlanning ? data?.consultingUnit : consultingUnitDefault,
        InvestorId: !isOtherPlanning ? investorSelected?.id : investorModel[0]?.id,
        PlanningStatusId: planningStatus.id || null,
        AgencySubmitted: data?.agencySubmitted || null,
        PlanningUnitId: !isOtherPlanning ? planningUnitSelected?.id : planningUnitModel[0]?.id,
        PlanningLevelId: isOtherPlanning || isQHCC ? planningLevel.id : 2,
        Population: parseInt(data?.population) || null,
        Acreage: parseDecimal(data?.acreage) || null,
        LandForConstruction: parseDecimal(data?.landForConstruction) || null,
        Report: data?.report || null,
        Note: data?.note || null,
        Presentation: data?.presentation || null,
        Regulation: data?.regulation || null,
        DocumentTypeId: documentType.id || null,
        PlanningDistrictIds:
          (lookupCommune &&
            lookupCommune.length > 0 &&
            lookupCommune.map((item) => {
              return item.id;
            })) ||
          null,
        ApprovalAgencyLevelId: isQHCC ? (approvalAgency?.id || null) : 2,
        PlanningAdjustedId: !valueRadio ? planningAdjusted?.id : null,
        isNew: !isOtherPlanning ? valueRadio : true,
        Field: data?.field || null,
        ConstructionGroup: data?.constructionGroup || null,
      };

      if (files && files.length > 0) {
        params = {
          ...params,
          DocumentUploadId: files && files[0].fileId,
        };
      }

      if (tifFiles && tifFiles.length > 0) {
        params = {
          ...params,
          tifFile: tifFiles[0].fileId,
        };
      }

      if (zipFiles && zipFiles.length > 0) {
        params = {
          ...params,
          shpFile: zipFiles[0].fileId,
        };
      }

      planningAction
        .CreatePlanning(params)
        .then(
          (res) => {
            showLoading(false);
            ShowNotification(
              viVN.Success.AddPlanning,
              NotificationMessageType.Success
            );
            history.push({
              pathname: isOtherPlanning ? UrlCollection.OtherPlanning:  
                  isQHCC? UrlCollection.PlanningCC :
                  isQHHTKT? UrlCollection.QH_HTKT:
                  UrlCollection.PlanningAnnouncementProcess,
            });
          },
          (err) => {
            showLoading(false);
            ShowNotification(
              viVN.Errors[(err && err.errorType) || "UnableHandleException"],
              NotificationMessageType.Error
            );
          }
        )
        .catch((err) => {
          showLoading(false);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        });
    }
  };

  const onGetLookUpApprovalAgency = (id) => {
    return new Promise((resolve, reject) => {
      ApprovalAgency.GetLookupApprovalAgency(id).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpInvestor = () => {
    return new Promise((resolve, reject) => {
      Investor.GetLookupInvestor().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onGetLookUpPlanningUnit = () => {
    return new Promise((resolve, reject) => {
      PlanningUnit.GetLookupPlanningUnit().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onAddData = (isOldPlan) => {
    if (isExistPlanningCode) {
      if (txtPlanningCode) txtPlanningCode.focus();
      return;
    }

    showLoading(true);

    let params = {
      Name: recordsManagementData.planningName || null,
      PlanningCode: recordsManagementData.planningCode || null,
      PlanningTypeId: !isOtherPlanning ? (planningType.id || null) : 6,
      Place: recordsManagementData.place || defaultPlace,
      Order: parseInt(recordsManagementData.order) || orderDefault,
      PlanningAgency: planningAgency?.name || null,
      ConsultingUnit: recordsManagementData.consultingUnit || consultingUnitDefault,
      Investor: investorSelected?.name || null,
      PlanningStatusId: planningStatus.id || null,
      AgencySubmitted: recordsManagementData.agencySubmitted || null,
      PlanningUnit: planningUnitSelected?.name || null,
      PlanningLevelId: planningLevel.id || null,
      Population: parseInt(recordsManagementData.population) || null,
      Acreage: parseDecimal(recordsManagementData.acreage) || null,
      LandForConstruction: parseDecimal(recordsManagementData.landForConstruction) || null,
      Report: recordsManagementData.report || null,
      Note: recordsManagementData.note || null,
      DocumentTypeId: documentType.id || null,
      ApprovalAgencyLevelId: approvalAgency.id || null,
      PlanningDistrictIds:
        (lookupCommune &&
          lookupCommune.length > 0 &&
          lookupCommune.map((item) => {
            return item.id;
          })) ||
        null,
      isOldPlan: isOldPlan || null,
      isNew: valueRadio,
      PlanningAdjustedId: !valueRadio ? planningAdjusted?.id : null,
    };

    if (files && files.length > 0) {
      params = {
        ...params,
        DocumentUploadId: files && files[0].fileId,
      };
    }

    if (tifFiles && tifFiles.length > 0) {
      params = {
        ...params,
        tifFile: tifFiles[0].fileId,
      };
    }

    if (zipFiles && zipFiles.length > 0) {
      params = {
        ...params,
        shpFile: zipFiles[0].fileId,
      };
    }

    planningAction
      .CreatePlanning(params)
      .then(
        (res) => {
          showLoading(false);
          onSuccess();
        },
        (err) => {
          showLoading(false);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        }
      )
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      });
  };

  let timeout = 0;
  const handleCheckCodeExist = (event) => {
    let value = event;

    if (!value) {
      setError("planningCode", { type: "required" });
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        CheckExistedPlanning(value);
      }, 100);
    }
  };

  const CheckExistedPlanning = (planningCode) => {
    planningAction
      .CheckExistedPlanning(planningCode)
      .then((res) => {
        if (res && res.content && res.content.status) {
          clearErrors("planningCode");
          setIsExistPlanningCode(false);
        } else {
          setError("planningCode", { type: "validate" });
          setIsExistPlanningCode(true);
        }
      })
      .catch((err) => {
        setError("planningCode", { type: "validate" });
        setIsExistPlanningCode(true);
      });
  };

  const onOpenSelectTifFile = () => {
    setShowTif(true);
    setTifFilesTemp(tifFiles);
  };

  const onCloseSelectTifFile = () => {
    setShowTif(false);
    setTifFiles(tifFilesTemp);
  };

  const onSaveSelectTifFile = () => {
    setShowTif(false);
    setTifName(tifFiles[0].fileName);
  };

  const onOpenSelectZipFile = () => {
    setShowZip(true);
    setZipFilesTemp(zipFiles);
    setZipName(null);
  };

  const onCloseSelectZipFile = () => {
    setShowZip(false);
    setZipFiles(zipFilesTemp);
  };

  const onSaveSelectZipFile = () => {
    setShowZip(false);
    setZipName(zipFiles[0].fileName);
  };

  const onOpenSelectFile = () => {
    setShow(true);
    setFilesTemp(files);
  };

  const onCloseSelectFile = () => {
    setShow(false);
    setFiles(filesTemp);
  };

  const onSaveSelectFile = () => {
    setShow(false);
  };

  const handleChangeRaido = (event) => {
    setValueRadio(event.target.value === "true" ? true : false);
  };

  const onGetapprovalAgencyGetLookUpFilter = async (id) => {
    showLoading(true);
    try {
      const { content } = await onGetLookUpApprovalAgency(id);
      content && setApprovalAgencyGetLookUp(content);
      showLoading(false);
    } catch (err) {
      showLoading(false);
      ShowNotification(
        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
        NotificationMessageType.Error
      );
    }
  };

  return (
    <div>
      {
        <form
          onSubmit={handleSubmit(onConfirm)}
          style={{
            background: "#FFFFFF",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          {isOtherPlanning ?
            <>
              <div className="form-group row">
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Mã quy hoạch<span className="required"></span>
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    name="planningCode"
                    inputRef={register({
                      required: true,
                      maxLength: 50,
                      validate: handleCheckCodeExist,
                    })}
                    inputProps={{ maxLength: 50 }}
                    onChange={(e) => {
                      setValue("planningCode", changeAlias(e.target.value), {
                        shouldDirty: true,
                      });
                    }}
                    id="txtPlanningCode"
                    error={
                      (errors.planningCode &&
                        errors.planningCode.type === "required") ||
                      (errors.planningCode &&
                        errors.planningCode.type === "maxLength") ||
                      (errors.planningCode &&
                        errors.planningCode.type === "validate")
                    }
                    variant="outlined"
                    size="small"
                  />
                  {errors.planningCode &&
                    errors.planningCode.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  {errors.planningCode &&
                    errors.planningCode.type === "maxLength" && (
                      <span className="error">Tối đa 50 ký tự</span>
                    )}
                  {errors.planningCode &&
                    errors.planningCode.type === "validate" && (
                      <span className="error">Mã quy hoạch đã tồn tại</span>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Tên quy hoạch<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({
                      required: true,
                      maxLength: 300,
                    })}
                    type="text"
                    name="planningName"
                    error={
                      (errors.planningName &&
                        errors.planningName.type === "required") ||
                      (errors.planningName &&
                        errors.planningName.type === "maxLength")
                    }
                    variant="outlined"
                    size="small"
                    inputProps={{ maxLength: 300 }}
                  />
                  {errors.planningName &&
                    errors.planningName.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  {errors.planningName &&
                    errors.planningName.type === "maxLength" && (
                      <span className="error">Tối đa 300 ký tự</span>
                    )}
                </div>
              </div>
              <div className="form-group row">
                {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Cấp phê duyệt<span className="required"></span>
                    </label>
                    <Autocomplete
                      options={approvalAgencyModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={approvalAgency}
                      onChange={(event, newValue) => {
                        setApprovalAgency(newValue);
                        onGetapprovalAgencyGetLookUpFilter(newValue?.id);
                        setValue("approvalAgencyId", newValue?.id)
                        clearErrors("approvalAgencyId");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="approvalAgencyId"
                          {...register('approvalAgencyId', { required: true })}
                          error={
                            errors.approvalAgencyId &&
                            errors.approvalAgencyId.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.approvalAgencyId &&
                      errors.approvalAgencyId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Cơ quan phê duyệt
                    <span className="required"></span>
                  </label>
                  <Autocomplete
                    options={approvalAgencyGetLookUp}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={planningAgency}
                    onChange={(event, newValue) => {
                      setPlanningAgency(newValue);
                      setValue("planningAgency", newValue?.id)
                      clearErrors("planningAgency");
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="planningAgency"
                        {...register('planningAgency', { required: true })}
                        error={
                          errors.planningAgency &&
                          errors.planningAgency.type === "required"
                        }
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                  {errors.planningAgency &&
                    errors.planningAgency.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Cơ quan trình<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({ required: true, maxLength: 300 })}
                    type="text"
                    name="agencySubmitted"
                    error={
                      (errors.agencySubmitted &&
                        errors.agencySubmitted.type === "required") ||
                      (errors.agencySubmitted &&
                        errors.agencySubmitted.type === "maxLength")
                    }
                    variant="outlined"
                    size="small"
                    inputProps={{ maxLength: 300 }}
                  />
                  {errors.agencySubmitted &&
                    errors.agencySubmitted.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  {errors.agencySubmitted &&
                    errors.agencySubmitted.type === "maxLength" && (
                      <span className="error">Tối đa 300 ký tự</span>
                    )}
                </div>
                {documentTypeModel && documentTypeModel.length > 0 && (
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Loại hồ sơ<span className="required"></span>
                    </label>

                    <Autocomplete
                      options={documentTypeModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={documentType}
                      onChange={(event, newValue) => {
                        setDocumentType(newValue);
                        setValue("documentTypeId", newValue?.id)
                        clearErrors("documentTypeId");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="documentTypeId"
                          {...register('documentTypeId', { required: true })}
                          error={
                            errors.documentTypeId &&
                            errors.documentTypeId.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.documentTypeId &&
                      errors.documentTypeId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
              </div>
              <div className="form-group row">
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">Quyết định phê duyệt<span className="required" /></label>
                  <TextField
                    fullWidth
                    type="text"
                    name="report"
                    variant="outlined"
                    size="small"
                    inputRef={register({ maxLength: 300, required: true })}
                    error={errors.report && errors.report.type === "required"}
                    inputProps={{ maxLength: 300 }}
                  />
                  {errors.report && errors.report.type === "maxLength" && (
                    <span className="error">Tối đa 300 ký tự</span>
                  )}
                  {errors.report &&
                    errors.report.type === 'required' && (
                      <span className='error'>Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Diện tích (ha)<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({
                      required: true,
                      pattern: regexDecial,
                    })}
                    onChange={(e) =>
                      setValue(
                        "acreage",
                        e.target.value.replace(/[^\d.,]/g, "")
                      )
                    }
                    type="text"
                    name="acreage"
                    error={
                      errors.acreage &&
                      (errors.acreage.type === "required" ||
                        errors.acreage.type === "pattern")
                    }
                    variant="outlined"
                    size="small"
                  />
                  {errors.acreage && errors.acreage.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.acreage && errors.acreage.type === "pattern" && (
                    <span className="error">
                      Chỉ có thể nhập số hoặc số thập phân
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Dân số (người)<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({ required: true })}
                    type="text"
                    name="population"
                    error={
                      errors.population && errors.population.type === "required"
                    }
                    onChange={(e) =>
                      setValue(
                        "population",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                    variant="outlined"
                    size="small"
                  />
                  {errors.population && errors.population.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Huyện / Thành phố<span className="required"></span>
                    </label>
                    <Autocomplete
                      multiple
                      options={lookupCommuneModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      onChange={(event, newValue) => {
                        setLookupCommune(newValue);
                        if (newValue.length > 0) {
                          setValue("lookupDistrictId", "11");
                          clearErrors("lookupDistrictId");
                        } else {
                          setValue("lookupDistrictId", "");
                          setError("lookupDistrictId", { type: "required" });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={
                            errors.lookupDistrictId &&
                            errors.lookupDistrictId.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    <TextField
                      name="lookupDistrictId"
                      hidden
                      inputRef={register({ required: true })}
                    />
                    {errors.lookupDistrictId &&
                      errors.lookupDistrictId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
              </div>
              <div className="form-group row">
                <div className="col-lg-6 mb-3">
                  <label className="text-dark text-dark-for-long-label">
                    Đất xây dựng (ha)<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({
                      required: true,
                      pattern: regexDecial,
                    })}
                    onChange={(e) =>
                      setValue(
                        "landForConstruction",
                        e.target.value.replace(/[^\d.,]/g, "")
                      )
                    }
                    type="text"
                    name="landForConstruction"
                    error={
                      errors.landForConstruction &&
                      (errors.landForConstruction.type === "required" ||
                        errors.landForConstruction.type === "pattern")
                    }
                    variant="outlined"
                    size="small"
                  />
                  {errors.landForConstruction &&
                    errors.landForConstruction.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  {errors.landForConstruction &&
                    errors.landForConstruction.type === "pattern" && (
                      <span className="error">
                        Chỉ có thể nhập số hoặc số thập phân
                      </span>
                    )}
                </div>
                {planningStatusModel && planningStatusModel.length > 0 && (
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Trạng thái<span className="required"></span>
                    </label>

                    <Autocomplete
                      options={planningStatusModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={planningStatus}
                      onChange={(event, newValue) => {
                        setPlanningStatus(newValue);
                        setValue("planningStatusId", newValue?.id)
                        clearErrors("planningStatusId");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningStatusId"
                          {...register('planningStatusId', { required: true })}
                          error={
                            errors.planningStatusId &&
                            errors.planningStatusId.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.planningStatusId &&
                      errors.planningStatusId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
              </div>
            </>
            : isQHCC ?
              <>
                <div className="form-group row">
                  {/* cấp quy hoạch */}
                  {planningLevelModel && planningLevelModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Cấp quy hoạch<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningLevelModel.filter((item) => {
                          if(item.id === 1 || item.id === 3) return item
                        })}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningLevel}
                        onChange={(event, newValue) => {
                          setPlanningLevel(newValue);
                          setValue("planningLevelId", newValue?.id)
                          clearErrors("planningLevelId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningLevelId"
                            {...register('planningLevelId', { required: true })}
                            error={
                              errors.planningLevelId &&
                              errors.planningLevelId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningLevelId &&
                        errors.planningLevelId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Cấp phê duyệt */}
                  {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Cấp phê duyệt<span className="required"></span>
                      </label>
                      <Autocomplete
                        options={approvalAgencyModel.filter((item) => {
                          if(item.id === 1 || item.id === 3) return item
                        })}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={approvalAgency}
                        onChange={(event, newValue) => {
                          setApprovalAgency(newValue);
                          onGetapprovalAgencyGetLookUpFilter(newValue?.id);
                          setValue("approvalAgencyId", newValue?.id)
                          clearErrors("approvalAgencyId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="approvalAgencyId"
                            {...register('approvalAgencyId', { required: true })}
                            error={
                              errors.approvalAgencyId &&
                              errors.approvalAgencyId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.approvalAgencyId &&
                        errors.approvalAgencyId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* cơ quan phê duyệt */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Cơ quan phê duyệt
                      <span className="required"></span>
                    </label>
                    <Autocomplete
                      options={approvalAgencyGetLookUp}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={planningAgency}
                      onChange={(event, newValue) => {
                        setPlanningAgency(newValue);
                        setValue("planningAgency", newValue?.id)
                        clearErrors("planningAgency");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningAgency"
                          {...register('planningAgency', { required: true })}
                          error={
                            errors.planningAgency &&
                            errors.planningAgency.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.planningAgency &&
                      errors.planningAgency.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>
                
                <div className="form-group row">
                  {/* mã qh */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Mã quy hoạch<span className="required"></span>
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      name="planningCode"
                      inputRef={register({
                        required: true,
                        maxLength: 50,
                        validate: handleCheckCodeExist,
                      })}
                      inputProps={{ maxLength: 50 }}
                      onChange={(e) => {
                        setValue("planningCode", changeAlias(e.target.value), {
                          shouldDirty: true,
                        });
                      }}
                      id="txtPlanningCode"
                      error={
                        (errors.planningCode &&
                          errors.planningCode.type === "required") ||
                        (errors.planningCode &&
                          errors.planningCode.type === "maxLength") ||
                        (errors.planningCode &&
                          errors.planningCode.type === "validate")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.planningCode &&
                      errors.planningCode.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.planningCode &&
                      errors.planningCode.type === "maxLength" && (
                        <span className="error">Tối đa 50 ký tự</span>
                      )}
                    {errors.planningCode &&
                      errors.planningCode.type === "validate" && (
                        <span className="error">Mã quy hoạch đã tồn tại</span>
                      )}
                  </div>
                  {/* Tên đồ án */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Tên đồ án QH<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        maxLength: 300,
                      })}
                      type="text"
                      name="planningName"
                      error={
                        (errors.planningName &&
                          errors.planningName.type === "required") ||
                        (errors.planningName &&
                          errors.planningName.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.planningName &&
                      errors.planningName.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.planningName &&
                      errors.planningName.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                  {/* huyện thành phố */}
                  {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Địa điểm<span className="required"></span>
                      </label>
                      <Autocomplete
                        multiple
                        options={lookupCommuneModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        onChange={(event, newValue) => {
                          setLookupCommune(newValue);
                          if (newValue.length > 0) {
                            setValue("lookupDistrictId", "11");
                            clearErrors("lookupDistrictId");
                          } else {
                            setValue("lookupDistrictId", "");
                            setError("lookupDistrictId", { type: "required" });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              errors.lookupDistrictId &&
                              errors.lookupDistrictId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <TextField
                        name="lookupDistrictId"
                        hidden
                        inputRef={register({ required: true })}
                      />
                      {errors.lookupDistrictId &&
                        errors.lookupDistrictId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                </div>

                <div className="form-group row">
                  {/* loại quy hoạch */}
                  {planningTypeModel && planningTypeModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Loại quy hoạch<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningTypeModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningType}
                        onChange={(event, newValue) => {
                          setPlanningType(newValue);
                          setValue("planningTypeId", newValue?.id)
                          clearErrors("planningTypeId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningTypeId"
                            {...register('planningTypeId', { required: true })}
                            error={
                              errors.planningTypeId &&
                              errors.planningTypeId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningTypeId &&
                        errors.planningTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* đơn vị lập quy hoạch */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Đơn vị lập quy hoạch<span className="required"></span>
                    </label>
                    <Autocomplete
                      options={planningUnitModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={planningUnitSelected}
                      onChange={(event, newValue) => {
                        setPlanningUnitSelected(newValue);
                        setValue("planningUnit", newValue?.id)
                        clearErrors("planningUnit");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningUnit"
                          {...register('planningUnit', { required: true })}
                          error={
                            errors.planningUnit &&
                            errors.planningUnit.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.planningUnit &&
                      errors.planningUnit.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                  {/* đơn vị tư vấn */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Đơn vị tư vấn<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="consultingUnit"
                      error={
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "required") ||
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.consultingUnit &&
                      errors.consultingUnit.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.consultingUnit &&
                      errors.consultingUnit.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* Cơ quan trình */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Cơ quan trình<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="agencySubmitted"
                      error={
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "required") ||
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.agencySubmitted &&
                      errors.agencySubmitted.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.agencySubmitted &&
                      errors.agencySubmitted.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                  {/* Trạng thái */}
                  {planningStatusModel && planningStatusModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Trạng thái<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningStatusModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningStatus}
                        onChange={(event, newValue) => {
                          setPlanningStatus(newValue);
                          setValue("planningStatusId", newValue?.id)
                          clearErrors("planningStatusId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningStatusId"
                            {...register('planningStatusId', { required: true })}
                            error={
                              errors.planningStatusId &&
                              errors.planningStatusId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningStatusId &&
                        errors.planningStatusId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* quyết định phê duyệt */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">Quyết định phê duyệt<span className="required" /></label>
                    <TextField
                      fullWidth
                      type="text"
                      name="report"
                      variant="outlined"
                      size="small"
                      inputRef={register({ maxLength: 300, required: true })}
                      error={errors.report && errors.report.type === "required"}
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.report && errors.report.type === "maxLength" && (
                      <span className="error">Tối đa 300 ký tự</span>
                    )}
                    {errors.report &&
                      errors.report.type === 'required' && (
                        <span className='error'>Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* Chủ đầu tư */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Chủ đầu tư<span className="required"></span>
                    </label>
                    <Autocomplete
                      options={investorModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={investorSelected}
                      onChange={(event, newValue) => {
                        setInvestorSelected(newValue);
                        setValue("investor", newValue?.id)
                        clearErrors("investor");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="investor"
                          {...register('investor', { required: true })}
                          error={
                            errors.investor && errors.investor.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.investor && errors.investor.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {/* loại hồ sơ */}
                  {documentTypeModel && documentTypeModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-longer-label">
                        Loại hồ sơ<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={documentTypeModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={documentType}
                        onChange={(event, newValue) => {
                          setDocumentType(newValue);
                          setValue("documentTypeId", newValue?.id)
                          clearErrors("documentTypeId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="documentTypeId"
                            {...register('documentTypeId', { required: true })}
                            error={
                              errors.documentTypeId &&
                              errors.documentTypeId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.documentTypeId &&
                        errors.documentTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* thứ tự */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Thứ tự<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="order"
                      onChange={(e) =>
                        setValue("order", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      error={errors.order && errors.order.type === "required"}
                      variant="outlined"
                      size="small"
                    />
                    {errors.order && errors.order.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* diện tích */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Diện tích (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      onChange={(e) =>
                        setValue(
                          "acreage",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      type="text"
                      name="acreage"
                      error={
                        errors.acreage &&
                        (errors.acreage.type === "required" ||
                          errors.acreage.type === "pattern")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.acreage && errors.acreage.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.acreage && errors.acreage.type === "pattern" && (
                      <span className="error">
                        Chỉ có thể nhập số hoặc số thập phân
                      </span>
                    )}
                  </div>
                  {/* dân số */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Dân số (người)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="population"
                      error={
                        errors.population && errors.population.type === "required"
                      }
                      onChange={(e) =>
                        setValue(
                          "population",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.population && errors.population.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {/* Đất xây dựng */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-longer-label">
                      Đất xây dựng (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      onChange={(e) =>
                        setValue(
                          "landForConstruction",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      type="text"
                      name="landForConstruction"
                      error={
                        errors.landForConstruction &&
                        (errors.landForConstruction.type === "required" ||
                          errors.landForConstruction.type === "pattern")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.landForConstruction &&
                      errors.landForConstruction.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.landForConstruction &&
                      errors.landForConstruction.type === "pattern" && (
                        <span className="error">
                          Chỉ có thể nhập số hoặc số thập phân
                        </span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* file Zip */}
                  <div className="col-lg-4">
                    <label className="text-dark text-dark-for-long-label">Dữ liệu GIS ranh giới quy hoạch (shape file)</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="shpName"
                      value={zipName}
                      placeholder="Hãy tải file zip lên."
                      disabled
                      variant="outlined"
                      size="small"
                    />
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onOpenSelectZipFile}
                      >
                        Chọn file
                      </Button>
                    </div>
                  </div>
                  <div
                    className="col-lg-4"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      
                    }}
                  >
                    <RadioGroup row value={valueRadio} onChange={handleChangeRaido}>
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Quy hoạch mới"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Quy hoạch điều chỉnh"
                      />
                    </RadioGroup>
                  </div>

                  {!valueRadio &&
                    planningLookUpModel &&
                    planningLookUpModel.length > 0 && (
                      <div className="col-4">
                        <label className="text-dark text-dark-for-long-label">
                          Tên các quy hoạch
                          <span className="required" />
                        </label>

                        <Autocomplete
                          options={planningLookUpModel}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.name
                          }
                          value={planningAdjusted}
                          onChange={(event, newValue) => {
                            setPlanningAdjusted(newValue);
                            setValue("planningAdjustedId", newValue?.id)
                            clearErrors("planningAdjustedId");
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningAdjustedId"
                              {...register('planningAdjustedId', { required: true })}
                              error={
                                errors.planningAdjustedId &&
                                errors.planningAdjustedId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                        {errors.planningAdjustedId &&
                          errors.planningAdjustedId.type === "required" && (
                            <span className="error">Trường này là bắt buộc</span>
                          )}
                      </div>
                    )}
                </div>
              </>
              :
              <>
                <div className="form-group row">
                  {/* mã qh */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Mã quy hoạch<span className="required"></span>
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      name="planningCode"
                      inputRef={register({
                        required: true,
                        maxLength: 50,
                        validate: handleCheckCodeExist,
                      })}
                      inputProps={{ maxLength: 50 }}
                      onChange={(e) => {
                        setValue("planningCode", changeAlias(e.target.value), {
                          shouldDirty: true,
                        });
                      }}
                      id="txtPlanningCode"
                      error={
                        (errors.planningCode &&
                          errors.planningCode.type === "required") ||
                        (errors.planningCode &&
                          errors.planningCode.type === "maxLength") ||
                        (errors.planningCode &&
                          errors.planningCode.type === "validate")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.planningCode &&
                      errors.planningCode.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.planningCode &&
                      errors.planningCode.type === "maxLength" && (
                        <span className="error">Tối đa 50 ký tự</span>
                      )}
                    {errors.planningCode &&
                      errors.planningCode.type === "validate" && (
                        <span className="error">Mã quy hoạch đã tồn tại</span>
                      )}
                  </div>
                  {/* Tên đồ án */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Tên đồ án QH<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        maxLength: 300,
                      })}
                      type="text"
                      name="planningName"
                      error={
                        (errors.planningName &&
                          errors.planningName.type === "required") ||
                        (errors.planningName &&
                          errors.planningName.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.planningName &&
                      errors.planningName.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.planningName &&
                      errors.planningName.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* loại quy hoạch */}
                  {planningTypeModel && planningTypeModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Loại quy hoạch<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningTypeModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningType}
                        onChange={(event, newValue) => {
                          setPlanningType(newValue);
                          setValue("planningTypeId", newValue?.id)
                          clearErrors("planningTypeId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningTypeId"
                            {...register('planningTypeId', { required: true })}
                            error={
                              errors.planningTypeId &&
                              errors.planningTypeId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningTypeId &&
                        errors.planningTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                    {/* Địa điểm */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Địa điểm<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="place"
                      error={
                        (errors.place && errors.place.type === "required") ||
                        (errors.place && errors.place.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.place && errors.place.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.place && errors.place.type === "maxLength" && (
                      <span className="error">Tối đa 300 ký tự</span>
                    )}
                  </div>
                </div>
                
                <div className="form-group row">
                  {/* Cấp phê duyệt */}
                  {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp phê duyệt<span className="required"></span>
                      </label>
                      <Autocomplete
                        options={approvalAgencyModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={approvalAgency}
                        onChange={(event, newValue) => {
                          setApprovalAgency(newValue);
                          onGetapprovalAgencyGetLookUpFilter(newValue?.id);
                          setValue("approvalAgencyId", newValue?.id)
                          clearErrors("approvalAgencyId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="approvalAgencyId"
                            {...register('approvalAgencyId', { required: true })}
                            error={
                              errors.approvalAgencyId &&
                              errors.approvalAgencyId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.approvalAgencyId &&
                        errors.approvalAgencyId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Cấp quy hoạch */}
                  {planningLevelModel && planningLevelModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp quy hoạch<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningLevelModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningLevel}
                        onChange={(event, newValue) => {
                          setPlanningLevel(newValue);
                          setValue("planningLevelId", newValue?.id)
                          clearErrors("planningLevelId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningLevelId"
                            {...register('planningLevelId', { required: true })}
                            error={
                              errors.planningLevelId &&
                              errors.planningLevelId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningLevelId &&
                        errors.planningLevelId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                </div>

                <div className="form-group row">
                  {/* cơ quan phê duyệt */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Cơ quan phê duyệt
                      <span className="required"></span>
                    </label>
                    <Autocomplete
                      options={approvalAgencyGetLookUp}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={planningAgency}
                      onChange={(event, newValue) => {
                        setPlanningAgency(newValue);
                        setValue("planningAgency", newValue?.id)
                        clearErrors("planningAgency");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningAgency"
                          {...register('planningAgency', { required: true })}
                          error={
                            errors.planningAgency &&
                            errors.planningAgency.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.planningAgency &&
                      errors.planningAgency.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                        {/* đơn vị lập quy hoạch */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Đơn vị lập quy hoạch<span className="required"></span>
                    </label>
                    <Autocomplete
                      options={planningUnitModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={planningUnitSelected}
                      onChange={(event, newValue) => {
                        setPlanningUnitSelected(newValue);
                        setValue("planningUnit", newValue?.id)
                        clearErrors("planningUnit");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningUnit"
                          {...register('planningUnit', { required: true })}
                          error={
                            errors.planningUnit &&
                            errors.planningUnit.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.planningUnit &&
                      errors.planningUnit.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* thứ tự */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Thứ tự<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="order"
                      onChange={(e) =>
                        setValue("order", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      error={errors.order && errors.order.type === "required"}
                      variant="outlined"
                      size="small"
                    />
                    {errors.order && errors.order.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {/* Cơ quan trình */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Cơ quan trình<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="agencySubmitted"
                      error={
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "required") ||
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.agencySubmitted &&
                      errors.agencySubmitted.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.agencySubmitted &&
                      errors.agencySubmitted.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* Chủ đầu tư */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Chủ đầu tư<span className="required"></span>
                    </label>
                    <Autocomplete
                      options={investorModel}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={investorSelected}
                      onChange={(event, newValue) => {
                        setInvestorSelected(newValue);
                        setValue("investor", newValue?.id)
                        clearErrors("investor");
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="investor"
                          {...register('investor', { required: true })}
                          error={
                            errors.investor && errors.investor.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    {errors.investor && errors.investor.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {/* đơn vị tư vấn */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Đơn vị tư vấn<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="consultingUnit"
                      error={
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "required") ||
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.consultingUnit &&
                      errors.consultingUnit.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.consultingUnit &&
                      errors.consultingUnit.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* loại hồ sơ */}
                  {documentTypeModel && documentTypeModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Loại hồ sơ<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={documentTypeModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={documentType}
                        onChange={(event, newValue) => {
                          setDocumentType(newValue);
                          setValue("documentTypeId", newValue?.id)
                          clearErrors("documentTypeId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="documentTypeId"
                            {...register('documentTypeId', { required: true })}
                            error={
                              errors.documentTypeId &&
                              errors.documentTypeId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.documentTypeId &&
                        errors.documentTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* quyết định phê duyệt */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">Quyết định phê duyệt<span className="required" /></label>
                    <TextField
                      fullWidth
                      type="text"
                      name="report"
                      variant="outlined"
                      size="small"
                      inputRef={register({ maxLength: 300, required: true })}
                      error={errors.report && errors.report.type === "required"}
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.report && errors.report.type === "maxLength" && (
                      <span className="error">Tối đa 300 ký tự</span>
                    )}
                    {errors.report &&
                      errors.report.type === 'required' && (
                        <span className='error'>Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* diện tích */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Diện tích (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      onChange={(e) =>
                        setValue(
                          "acreage",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      type="text"
                      name="acreage"
                      error={
                        errors.acreage &&
                        (errors.acreage.type === "required" ||
                          errors.acreage.type === "pattern")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.acreage && errors.acreage.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.acreage && errors.acreage.type === "pattern" && (
                      <span className="error">
                        Chỉ có thể nhập số hoặc số thập phân
                      </span>
                    )}
                  </div>
                  {/* dân số */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Dân số (người)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="population"
                      error={
                        errors.population && errors.population.type === "required"
                      }
                      onChange={(e) =>
                        setValue(
                          "population",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.population && errors.population.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* huyện thành phố */}
                  {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Huyện / Thành phố<span className="required"></span>
                      </label>
                      <Autocomplete
                        multiple
                        options={lookupCommuneModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        onChange={(event, newValue) => {
                          setLookupCommune(newValue);
                          if (newValue.length > 0) {
                            setValue("lookupDistrictId", "11");
                            clearErrors("lookupDistrictId");
                          } else {
                            setValue("lookupDistrictId", "");
                            setError("lookupDistrictId", { type: "required" });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              errors.lookupDistrictId &&
                              errors.lookupDistrictId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <TextField
                        name="lookupDistrictId"
                        hidden
                        inputRef={register({ required: true })}
                      />
                      {errors.lookupDistrictId &&
                        errors.lookupDistrictId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Đất xây dựng */}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Đất xây dựng (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      onChange={(e) =>
                        setValue(
                          "landForConstruction",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      type="text"
                      name="landForConstruction"
                      error={
                        errors.landForConstruction &&
                        (errors.landForConstruction.type === "required" ||
                          errors.landForConstruction.type === "pattern")
                      }
                      variant="outlined"
                      size="small"
                    />
                    {errors.landForConstruction &&
                      errors.landForConstruction.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.landForConstruction &&
                      errors.landForConstruction.type === "pattern" && (
                        <span className="error">
                          Chỉ có thể nhập số hoặc số thập phân
                        </span>
                      )}
                  </div>

                </div>
                <div className="form-group row">
                  {/* Trạng thái */}
                  {planningStatusModel && planningStatusModel.length > 0 && (
                    <div className="col-lg-6 mb-3">
                      <label className="text-dark text-dark-for-long-label">
                        Trạng thái<span className="required"></span>
                      </label>

                      <Autocomplete
                        options={planningStatusModel}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        value={planningStatus}
                        onChange={(event, newValue) => {
                          setPlanningStatus(newValue);
                          setValue("planningStatusId", newValue?.id)
                          clearErrors("planningStatusId");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningStatusId"
                            {...register('planningStatusId', { required: true })}
                            error={
                              errors.planningStatusId &&
                              errors.planningStatusId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {errors.planningStatusId &&
                        errors.planningStatusId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Lĩnh vực
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        maxLength: 300,
                      })}
                      type="text"
                      name="field"
                      error={
                        (errors.field &&
                          errors.field.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.field &&
                      errors.field.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">
                      Nhóm công trình
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        maxLength: 300,
                      })}
                      type="text"
                      name="constructionGroup"
                      error={
                        (errors.constructionGroup &&
                          errors.constructionGroup.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                    />
                    {errors.constructionGroup &&
                      errors.constructionGroup.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>
                <div className="form-group row">
                  <div
                    className="col-lg-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 25,
                    }}
                  >
                    <RadioGroup row value={valueRadio} onChange={handleChangeRaido}>
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Quy hoạch mới"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Quy hoạch điều chỉnh"
                      />
                    </RadioGroup>
                  </div>

                  {!valueRadio &&
                    planningLookUpModel &&
                    planningLookUpModel.length > 0 && (
                      <div className="col-lg-6 mb-3">
                        <label className="text-dark text-dark-for-long-label">
                          Tên các quy hoạch
                          <span className="required" />
                        </label>

                        <Autocomplete
                          options={planningLookUpModel}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.name
                          }
                          value={planningAdjusted}
                          onChange={(event, newValue) => {
                            setPlanningAdjusted(newValue);
                            setValue("planningAdjustedId", newValue?.id)
                            clearErrors("planningAdjustedId");
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningAdjustedId"
                              {...register('planningAdjustedId', { required: true })}
                              error={
                                errors.planningAdjustedId &&
                                errors.planningAdjustedId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                        {errors.planningAdjustedId &&
                          errors.planningAdjustedId.type === "required" && (
                            <span className="error">Trường này là bắt buộc</span>
                          )}
                      </div>
                    )}
                </div>

                <div className="form-group row">
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">File Tif</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="tifName"
                      value={tifName}
                      placeholder="Hãy tải file tif lên."
                      disabled
                      variant="outlined"
                      size="small"
                    />
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onOpenSelectTifFile}
                      >
                        Chọn file Tif
                      </Button>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="text-dark text-dark-for-long-label">File Zip</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="shpName"
                      value={zipName}
                      placeholder="Hãy tải file zip lên."
                      disabled
                      variant="outlined"
                      size="small"
                    />
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onOpenSelectZipFile}
                      >
                        Chọn file zip
                      </Button>
                    </div>
                  </div>
                </div>
              </>


          }
          <div className="form-group row">
            <div className="col-12">
              <label className="text-dark text-dark-for-long-label">Ghi chú</label>
              <textarea
                name="note"
                rows="3"
                className="form-control"
                ref={register}
              ></textarea>
            </div>
          </div>
          <div className="form-group">
            <label className="text-dark text-dark-for-long-label">Thuyết minh</label>

            <textarea
              name="presentation"
              rows="3"
              className="form-control"
              ref={register}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="text-dark text-dark-for-long-label">Quy định quản lý theo đồ án</label>

            <textarea
              name="regulation"
              rows="3"
              className="form-control"
              ref={register}
            ></textarea>
          </div>
          <div className="form-group row">
            <div className="col-12">
              <label className="text-dark text-dark-for-long-label">
                Ảnh<span className="required"></span>
              </label>
              {!isShow &&
                files &&
                files.length > 0 &&
                files.map((item) => (
                  <div key={item.fileName} style={{ width: "150px" }}>
                    <img
                      src={APIUrlDefault + item.filePreview}
                      alt={item.fileName}
                      className="img-fluid mb-2"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                ))}
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenSelectFile}
                >
                  Chọn file
                </Button>
                <TextField
                  inputRef={register({ required: true })}
                  type="hidden"
                  name="image"
                  value={(files && files.length > 0 && files[0].fileName) || ""}
                />
                {errors.image && errors.image.type === "required" && (
                  <p className="error">Trường này là bắt buộc</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button
              type="button"
              onClick={() =>
                history.push({
                  pathname: isOtherPlanning ? UrlCollection.OtherPlanning:  
                  isQHCC? UrlCollection.PlanningCC :
                  isQHHTKT? UrlCollection.QH_HTKT:
                  UrlCollection.PlanningAnnouncementProcess,
                  state: {
                    currentPage: location.state?.currentPage,
                    pageSizeDefault: location.state?.pageSizeDefault,
                    title: location.state?.title,
                    typeSelected: location.state?.typeSelected,
                    levelSelected: location.state?.levelSelected,
                    statusIdSelected: location.state?.statusIdSelected,
                    planningUnitSelected: location.state?.planningUnitSelected,
                    investorSelected: location.state?.investorSelected,
                    approvalAgencySelected: location.state?.approvalAgencySelected,
                    districtSelected: location.state?.districtSelected
                  }
                })
              }
              style={{ margin: "20px 10px 50px 10px" }}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Thoát
            </Button>
            <Button
              type="submit"
              style={{ margin: "20px 10px 50px 10px" }}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Lưu
            </Button>
          </div>
        </form>
      }
      {isShow && (
        <Dialog
          onClose={onCloseSelectFile}
          open={isShow}
          fullWidth={true}
          maxWidth="md"
          className="dialog-preview-form"
        >
          <DialogTitle disableTypography>
            <Typography variant="h6">Quản lý file</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onCloseSelectFile}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              files={files}
              setFiles={setFiles}
              acceptedFiles={["jpeg", "png", "jpg", "gif"]}
              filterExtension={"png"}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Thoát
            </Button>
            {files && files.length > 0 && (
              <Button
                type="button"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSaveSelectFile}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {isShowTif && (
        <Dialog
          onClose={onCloseSelectTifFile}
          open={isShowTif}
          fullWidth={true}
          maxWidth="md"
          className="dialog-preview-form"
        >
          <DialogTitle disableTypography>
            <Typography variant="h6">Quản lý file</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onCloseSelectTifFile}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              files={tifFiles}
              setFiles={setTifFiles}
              acceptedFiles={["tif"]}
              isShowLeft={false}
              isShowAddFolder={false}
              isShowDownload={true}
              typeFile={"TIF"}
              cgisId={cgisId}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectTifFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            {tifFiles && tifFiles.length > 0 && tifFiles !== tifFilesTemp && (
              <Button
                type="button"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSaveSelectTifFile}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {isShowZip && (
        <Dialog
          onClose={onCloseSelectZipFile}
          open={isShowZip}
          fullWidth={true}
          maxWidth="md"
          className="dialog-preview-form"
        >
          <DialogTitle disableTypography>
            <Typography variant="h6">Quản lý file</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onCloseSelectZipFile}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              files={zipFiles}
              setFiles={setZipFiles}
              acceptedFiles={["zip"]}
              isShowLeft={false}
              isShowAddFolder={false}
              isShowDownload={true}
              typeFile={"ZIP"}
              cgisId={cgisId}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectZipFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            {zipFiles && zipFiles.length > 0 && zipFiles !== zipFilesTemp && (
              <Button
                type="button"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSaveSelectZipFile}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
      {openConfirmDialog && (
        <Dialog onClose={onClose} open={openConfirmDialog}>
          <DialogTitle onClose={onClose}>
            <Typography variant="h6">{"Xác nhận"}</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <h6>Bạn có muốn tạo dự án với trạng thái dự án cũ hay không?</h6>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              startIcon={<CloseIcon />}
              onClick={() => onAddData(true)}
            >
              Không
            </Button>
            <Button
              type="button"
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => onAddData(false)}
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRecordsManagement);
