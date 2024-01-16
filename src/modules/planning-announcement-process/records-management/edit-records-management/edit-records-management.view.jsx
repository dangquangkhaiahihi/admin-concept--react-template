/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useForm } from "react-hook-form";
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
  Checkbox,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType, MaxSizeImageUpload } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";
import * as appActions from "../../../../core/app.store";
import * as planningAction from "../../../../redux/store/planning/planning.store";
import * as districtAction from "../../../../redux/store/district-management/district.store";
import * as ApprovalAgency from "../../../../redux/store/approval-agency/approval-agency.store";
import * as Investor from "../../../../redux/store/investor/investor.store";
import * as PlanningUnit from "../../../../redux/store/planning-unit/planning-unit.store";
import * as config from "../../../../utils/configuration";
import FileManagement from "../../../../components/file_management/file_management";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { UrlCollection } from "../../../../common/url-collection";
import { regexDecial } from "../../../../common/validateDecimal";
import SunEditor from 'suneditor-react';

const defaultPlace = "Sơn La";
const consultingUnitDefault = "N/A";
const orderDefault = 1;

function EditRecordsManagement(props) {
  const classes = useStyles();
  const { id } = useParams();
  const planningId = id;
  const cgisId = localStorage.getItem("cgisId");
  const { showLoading, isOtherPlanning, isQHT, isQHCC, isQHHTKT } = props;
  const history = useHistory();
  const location = useLocation();

  const [planningModel, setPlanningModel] = useState(null);
  const [planningLookUpModel, setPlanningLookUpModel] = useState([]);
  const [planningStatusModel, setPlanningStatusModel] = useState([]);
  const [planningLevelModel, setPlanningLevelModel] = useState([]);
  const [planningTypeModel, setPlanningTypeModel] = useState([]);
  const [documentTypeModel, setDocumentTypeModel] = useState([]);
  const [approvalAgencyModel, setApprovalAgencyModel] = useState([]);
  const [lookupCommuneModel, setLookupCommuneModel] = useState([]);
  const [approvalAgencyGetLookUp, setApprovalAgencyGetLookUp] = useState([]);
  const [investorModel, setInvestorModel] = useState([]);
  const [planningUnitModel, setPlanningUnitModell] = useState([]);

  const [planningStatus, setPlanningStatus] = useState("");
  const [planningLevel, setPlanningLevel] = useState("");
  const [planningType, setPlanningType] = useState({});
  const [documentType, setDocumentType] = useState("");
  const [approvalAgency, setApprovalAgency] = useState("");
  const [lookupCommune, setLookupCommune] = useState(null);
  const [planningAdjusted, setPlanningAdjusted] = useState({});
  const [planningAgency, setPlanningAgency] = useState({});
  const [investorSelected, setInvestorSelected] = useState({});
  const [planningUnitSelected, setPlanningUnitSelected] = useState({});
  const [isNew, setIsNew] = useState(true);

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
  const [isCheck, setIsCheck] = useState(false);

  const { register, handleSubmit, errors, setValue, clearErrors, setError } =
    useForm({
      mode: "all",
      reValidateMode: "onBlur",
    });

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    onGetLookUpApprovalAgency();
  }, [planningModel]);

  const onGetData = () => {
    showLoading(true);
    Promise.all([
      onGetDetailPlanning(),
      getLookupDistrict(),
      onGetLookUpPlanning(),
      onGetLookUpPlanningStatus(),
      onGetLookUpPlanningLevel(),
      onGetLookUpPlanningType(),
      onGetLookUpDocumentType(),
      getApprovalAgencyLevel(),
      onGetLookUpInvestor(),
      onGetLookUpPlanningUnit(),
    ])
      .then((res) => {
        const [planning, lookupCommune] = res;
        setCommune(lookupCommune.content, planning.content);
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const setCommune = (lookupCommune, planning) => {
    if (!lookupCommune || !planning) return;

    let district =
      planning.communeNames &&
      planning.communeNames.length > 0 &&
      lookupCommune.filter(
        (item) =>
          planning.communeNames.some((name) => name === item.name) === true
      );

    lookupCommune.length > 0 && setLookupCommune(district);

    if (district.length > 0 || lookupCommune.length > 0) {
      setValue("lookupCommuneId", "lookupCommuneId");
      clearErrors("lookupCommuneId");
    } else {
      setValue("lookupCommuneId", "");
      setError("lookupCommuneId", { type: "required" });
    }
  };

  const onGetDetailPlanning = (id = planningId) => {
    return new Promise((resolve, reject) => {
      planningAction.GetDetailPlaning(id).then(
        (res) => {
          if (!res || !res.content) {
            reject(res);
          }
          setIsNew(res?.content?.isNew);
          setPlanningModel(res.content);
          setFiles(res.content.files ? [res.content.files] : []);
          setLookupCommune(res.content.communeIds || []);
          res.content.isCheck && setIsCheck(res.content.isCheck);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        }
      );
    });
  };

  const onGetLookUpPlanning = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanning().then(
        (res) => {
          setPlanningLookUpModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setPlanningStatusModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setPlanningLevelModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setPlanningTypeModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setApprovalAgencyModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setLookupCommuneModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
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
          setDocumentTypeModel(res && res.content);
          resolve(res);
        },
        (err) => {
          reject(err);
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        }
      );
    });
  };

  const onGetLookUpApprovalAgency = async () => {
    showLoading(true);
    try {
      const { content } = await ApprovalAgency.GetLookupApprovalAgency();
      if (content) {
        setApprovalAgencyGetLookUp(content);
        setPlanningAgency(content.find(
          (item) => item.id === planningModel.approvalAgencyId
        ))
      }
      showLoading(false);
    } catch (err) {
      ShowNotification(
        viVN.Errors[err?.errorType],
        NotificationMessageType.Error
      );
      showLoading(false);
    }
  };

  const onGetLookUpInvestor = async () => {
    return new Promise((resolve, reject) => {
      Investor.GetLookupInvestor().then(
        (res) => {
          setInvestorModel(res && res.content);
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
          setPlanningUnitModell(res && res.content);
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

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    showLoading(true);

    let params = {
      Id: planningModel.id || null,
      Name: data.planningName || null,
      PlanningCode: planningModel.planningCode || null,
      Photo: planningModel.photo || null,
      PlanningTypeId: !isOtherPlanning ?
        ((planningType && planningType.id) ||
          planningModel.planningTypeId ||
          null) : 6,
      Place: !isOtherPlanning ? data?.place : defaultPlace,
      DistrictId: planningModel.districtId || null,
      Order: !isOtherPlanning ? parseInt(data?.order) : orderDefault,
      ApprovalAgencyId: planningAgency?.id || null,
      ConsultingUnit: !isOtherPlanning ? data?.consultingUnit : consultingUnitDefault,
      InvestorId: !isOtherPlanning ? investorSelected?.id : investorModel[0]?.id,
      PlanningStatusId:
        (planningStatus && planningStatus.id) ||
        planningModel.planningStatusId ||
        null,
      AgencySubmitted: data.agencySubmitted || null,
      PlanningUnitId: !isOtherPlanning ? planningUnitSelected?.id : planningUnitModel[0]?.id,
      PlanningLevelId: !isOtherPlanning ? ((planningLevel && planningLevel.id) ||
        planningModel.planningLevelId ||
        null) : planningLevelModel[0]?.id,
      Population: parseInt(data.population) || null,
      Acreage: data.acreage || null,
      LandForConstruction: data.landForConstruction || null,
      Report: data.report || null,
      Note: data.note || null,
      Presentation: data.presentation || null,
      Regulation: data.regulation || null,
      DocumentTypeId:
        (documentType && documentType.id) ||
        planningModel.documentTypeId ||
        null,
      ApprovalAgencyLevelId:
        (approvalAgency && approvalAgency.id) ||
        planningModel.approvalAgencyLevelId ||
        null,
      PlanningDistrictIds:
        (lookupCommune &&
          lookupCommune.map((item) => {
            return item.id;
          })) ||
        planningModel?.districtIds,
      isNew: !isOtherPlanning ? isNew : true,
      PlanningAdjustedId: !isNew ? planningAdjusted?.id : null,
      Field: data?.field || null,
      ConstructionGroup: data?.constructionGroup || null,
      IsCheck: isCheck,
      IsCheckDocument : planningModel.isCheckDocument || false,
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
        tifFile: tifFiles && tifFiles[0].fileId,
      };
    }

    if (zipFiles && zipFiles.length > 0) {
      params = {
        ...params,
        shpFile: zipFiles && zipFiles[0].fileId,
      };
    }

    planningAction
      .UpdatePlanning(params)
      .then(
        (res) => {
          // onSuccess();
          history.push({
            pathname: isOtherPlanning ? UrlCollection.OtherPlanning :
              isQHCC ? UrlCollection.PlanningCC :
                isQHHTKT ? UrlCollection.QH_HTKT :
                  UrlCollection.PlanningAnnouncementProcess,
          });
          ShowNotification(
            viVN.Success.EditPlanning,
            NotificationMessageType.Success
          );
        },
        (err) => {
          showLoading(false);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
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
    setIsNew(event.target.value === "true");
  };

  useEffect(() => {
    if (planningUnitModel.length && planningModel?.planningUnitId) {
      setPlanningUnitSelected(planningUnitModel.find(
        (item) => item.id === planningModel.planningUnitId
      ))
    }
  }, [planningUnitModel, planningModel])

  useEffect(() => {
    if (investorModel.length && planningModel?.investorId) {
      setInvestorSelected(investorModel.find(
        (item) => item.id === planningModel.investorId
      ))
    }
  }, [investorModel, planningModel])

  useEffect(() => {
    if (planningLookUpModel.length && planningModel?.planningAdjustedId) {
      setPlanningAdjusted(planningLookUpModel.find(
        (item) => item.id === planningModel.planningAdjustedId
      ))
    }
  }, [planningLookUpModel, planningModel])

  useEffect(() => {
    if (planningTypeModel.length && planningModel?.planningTypeId) {
      setPlanningType(planningTypeModel.find(
        (item) => item.id === planningModel.planningTypeId
      ))
    }
  }, [planningTypeModel, planningModel])

  useEffect(() => {
    if (planningLevelModel.length && planningModel?.planningLevelId) {
      setPlanningLevel(planningLevelModel.find(
        (item) => item.id === planningModel.planningLevelId
      ))
    }
  }, [planningLevelModel, planningModel])

  useEffect(() => {
    if (documentTypeModel.length && planningModel?.documentTypeId) {
      setDocumentType(documentTypeModel.find(
        (item) => item.id === planningModel.documentTypeId
      ))
    }
  }, [documentTypeModel, planningModel])

  useEffect(() => {
    if (planningStatusModel.length && planningModel?.planningStatusId) {
      setPlanningStatus(planningStatusModel.find(
        (item) => item.id === planningModel.planningStatusId
      ))
    }
  }, [planningStatusModel, planningModel])

  const [content, setContent] = useState();

  const onChangeContent = (contentInput) => {
    if (contentInput === '<p><br></p>') {
      setContent('');
    } else {
      setContent(contentInput);
    }
  };

  return (
    <div>
      {planningModel && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            background: "#FFFFFF",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          {isOtherPlanning ?
            <>
              <div className="form-group row">
                {/* mã quy hoạch */}
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">
                    Mã quy hoạch<span className="required"></span>
                  </label>
                  <TextField
                    fullWidth
                    type="text"
                    name="planningCode"
                    defaultValue={planningModel.planningCode}
                    disabled
                    variant="outlined"
                    size="small"
                    inputRef={register({
                      maxLength: 50,
                    })}
                    error={
                      errors.planningCode &&
                      errors.planningCode.type === "maxLength"
                    }
                  />
                  {errors.planningCode &&
                    errors.planningCode.type === "maxLength" && (
                      <span className="error">Tối đa 50 ký tự</span>
                    )}
                </div>
                {/* tạo đồ án */}
                <div className="col-6">
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
                    defaultValue={planningModel.name}
                    error={
                      (errors.planningName &&
                        errors.planningName.type === "required") ||
                      (errors.planningName &&
                        errors.planningName.type === "maxLength")
                    }
                    variant="outlined"
                    size="small"
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
                {/* cấp phê duyệt */}
                {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Cấp phê duyệt<span className="required"></span>
                    </label>
                    {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                      <Autocomplete
                        options={approvalAgencyModel}
                        getOptionLabel={(option) => option.name}
                        defaultValue={approvalAgencyModel.length && approvalAgencyModel.find(
                          (item) => item.id === planningModel.approvalAgencyLevelId
                        )}
                        onChange={(event, newValue) => {
                          setApprovalAgency(newValue);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="approvalAgencyId"
                            inputRef={register({ required: true })}
                            error={
                              errors.approvalAgencyId &&
                              errors.approvalAgencyId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    )}
                    {errors.approvalAgencyId &&
                      errors.approvalAgencyId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
                {/* cơ quan phê duyệt */}
                <div className="col-6">
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
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="planningAgency"
                        inputRef={register({ required: true })}
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
                {/* cơ quan trình */}
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">
                    Cơ quan trình<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({ required: true, maxLength: 300 })}
                    type="text"
                    name="agencySubmitted"
                    defaultValue={planningModel.agencySubmitted}
                    error={
                      (errors.agencySubmitted &&
                        errors.agencySubmitted.type === "required") ||
                      (errors.agencySubmitted &&
                        errors.agencySubmitted.type === "maxLength")
                    }
                    variant="outlined"
                    size="small"
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
                {/* loại hồ sơ */}
                {documentTypeModel && documentTypeModel.length > 0 && (
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Loại hồ sơ<span className="required"></span>
                    </label>

                    {documentTypeModel && documentTypeModel.length > 0 && (
                      <Autocomplete
                        id="documentTypeId"
                        options={documentTypeModel}
                        getOptionLabel={(option) => option.name}
                        value={documentType}
                        onChange={(event, newValue) => {
                          setDocumentType(newValue);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="documentTypeId"
                            inputRef={register({ required: true })}
                            error={
                              errors.documentTypeId &&
                              errors.documentTypeId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    )}
                    {errors.documentTypeId &&
                      errors.documentTypeId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                )}
              </div>
              <div className="form-group row">
                {/* quyết định phê duyệt */}
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">Quyết định phê duyệt</label>
                  <TextField
                    fullWidth
                    type="text"
                    name="report"
                    defaultValue={planningModel.report}
                    variant="outlined"
                    size="small"
                    inputRef={register({ maxLength: 300, required: true })}
                  />
                  {errors.report && errors.report.type === "maxLength" && (
                    <span className="error">Tối đa 300 ký tự</span>
                  )}
                  {errors.report &&
                    errors.report.type === 'required' && (
                      <span className='error'>Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">
                    Diện tích (ha)<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({
                      required: true,
                      pattern: regexDecial,
                    })}
                    type="text"
                    name="acreage"
                    onChange={(e) =>
                      setValue(
                        "acreage",
                        e.target.value.replace(/[^\d.,]/g, "")
                      )
                    }
                    defaultValue={planningModel.acreage}
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
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">
                    Dân số (người)<span className="required"></span>
                  </label>

                  <TextField
                    fullWidth
                    inputRef={register({ required: true })}
                    type="text"
                    name="population"
                    defaultValue={planningModel.population}
                    onChange={(e) =>
                      setValue("population", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    error={
                      errors.population && errors.population.type === "required"
                    }
                    variant="outlined"
                    size="small"
                  />
                  {errors.population && errors.population.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                <div className="col-6">
                  <label className="text-dark text-dark-for-long-label">
                    Huyện / Thành phố<span className="required"></span>
                  </label>
                  {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                    <Autocomplete
                      multiple
                      options={lookupCommuneModel}
                      getOptionLabel={(option) => option.name}
                      defaultValue={lookupCommuneModel.filter((item) => {
                        if (
                          planningModel &&
                          planningModel.districtNames &&
                          planningModel.districtNames.length > 0 &&
                          planningModel.districtNames.some(
                            (name) => name === item.name
                          )
                        ) {
                          return item;
                        }
                      })}
                      onChange={(event, newValue) => {
                        setLookupCommune(newValue);
                        if (newValue.length > 0) {
                          setValue("lookupCommuneId", "11");
                          clearErrors("lookupCommuneId");
                        } else {
                          setValue("lookupCommuneId", "");
                          setError("lookupCommuneId", { type: "required" });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={
                            errors.lookupCommuneId &&
                            errors.lookupCommuneId.type === "required"
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  )}
                  <TextField
                    name="lookupCommuneId"
                    hidden
                    inputRef={register({ required: true })}
                  />
                  {errors.lookupCommuneId &&
                    errors.lookupCommuneId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-6">
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
                    defaultValue={planningModel.landForConstruction}
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Trạng thái<span className="required"></span>
                    </label>

                    <Autocomplete
                      id="planningStatusId"
                      options={planningStatusModel}
                      getOptionLabel={(option) => option.name}
                      value={planningStatus}
                      onChange={(event, newValue) => {
                        setPlanningStatus(newValue);
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningStatusId"
                          inputRef={register({ required: true })}
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
                  {(isQHCC || isOtherPlanning) && planningLevelModel && planningLevelModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp quy hoạch<span className="required"></span>
                      </label>

                      {planningLevelModel && planningLevelModel.length > 0 && (
                        <Autocomplete
                          id="planningLevelId"
                          options={planningLevelModel.filter((item) => {
                            if (item.id === 1 || item.id === 3) return item
                          })}
                          getOptionLabel={(option) => option.name}
                          value={planningLevel}
                          onChange={(event, newValue) => {
                            setPlanningLevel(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningLevelId"
                              inputRef={register({ required: true })}
                              error={
                                errors.planningLevelId &&
                                errors.planningLevelId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.planningLevelId &&
                        errors.planningLevelId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Cấp phê duyệt */}
                  {(isQHCC || isOtherPlanning) && approvalAgencyModel && approvalAgencyModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp phê duyệt<span className="required"></span>
                      </label>
                      {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                        <Autocomplete
                          options={approvalAgencyModel.filter((item) => {
                            if (item.id === 1 || item.id === 3) return item
                          })}
                          getOptionLabel={(option) => option.name}
                          defaultValue={approvalAgencyModel.length && approvalAgencyModel.find(
                            (item) => item.id === planningModel.approvalAgencyLevelId
                          )}
                          onChange={(event, newValue) => {
                            setApprovalAgency(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="approvalAgencyId"
                              inputRef={register({ required: true })}
                              error={
                                errors.approvalAgencyId &&
                                errors.approvalAgencyId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.approvalAgencyId &&
                        errors.approvalAgencyId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* cơ quan phê duyệt */}
                  <div className="col-4">
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningAgency"
                          inputRef={register({ required: true })}
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
                  {/* Mã quy hoạch */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-long-label">
                      Mã quy hoạch<span className="required"></span>
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      name="planningCode"
                      defaultValue={planningModel.planningCode}
                      disabled
                      variant="outlined"
                      size="small"
                      inputRef={register({
                        maxLength: 50,
                      })}
                      error={
                        errors.planningCode &&
                        errors.planningCode.type === "maxLength"
                      }
                    />
                    {errors.planningCode &&
                      errors.planningCode.type === "maxLength" && (
                        <span className="error">Tối đa 50 ký tự</span>
                      )}
                  </div>
                  {/* tên đồ án */}
                  <div className="col-4">
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
                      defaultValue={planningModel.name}
                      error={
                        (errors.planningName &&
                          errors.planningName.type === "required") ||
                        (errors.planningName &&
                          errors.planningName.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                  <div className="col-4">
                    <label className="text-dark text-dark-for-long-label">
                      Địa điểm<span className="required"></span>
                    </label>
                    {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                      <Autocomplete
                        multiple
                        options={lookupCommuneModel}
                        getOptionLabel={(option) => option.name}
                        defaultValue={lookupCommuneModel.filter((item) => {
                          if (
                            planningModel &&
                            planningModel.districtNames &&
                            planningModel.districtNames.length > 0 &&
                            planningModel.districtNames.some(
                              (name) => name === item.name
                            )
                          ) {
                            return item;
                          }
                        })}
                        onChange={(event, newValue) => {
                          setLookupCommune(newValue);
                          if (newValue.length > 0) {
                            setValue("lookupCommuneId", "11");
                            clearErrors("lookupCommuneId");
                          } else {
                            setValue("lookupCommuneId", "");
                            setError("lookupCommuneId", { type: "required" });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              errors.lookupCommuneId &&
                              errors.lookupCommuneId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    )}
                    <TextField
                      name="lookupCommuneId"
                      hidden
                      inputRef={register({ required: true })}
                    />
                    {errors.lookupCommuneId &&
                      errors.lookupCommuneId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  {/* loại quy hoạch */}
                  {planningTypeModel && planningTypeModel.length > 0 && !isOtherPlanning && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-long-label">
                        Loại quy hoạch<span className="required"></span>
                      </label>

                      {planningTypeModel && planningTypeModel.length > 0 && (
                        <Autocomplete
                          options={planningTypeModel}
                          getOptionLabel={(option) => option.name}
                          value={planningType}
                          onChange={(event, newValue) => {
                            setPlanningType(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningTypeId"
                              inputRef={register({ required: true })}
                              error={
                                errors.planningTypeId &&
                                errors.planningTypeId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.planningTypeId &&
                        errors.planningTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Đơn vị lập quy hoạch */}
                  <div className="col-4">
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningUnit"
                          inputRef={register({ required: true })}
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
                  {/* Đơn vị tư vấn */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-long-label">
                      Đơn vị tư vấn<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="consultingUnit"
                      defaultValue={planningModel.consultingUnit}
                      error={
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "required") ||
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                    <label className="text-dark text-dark-for-long-label">
                      Cơ quan trình<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="agencySubmitted"
                      defaultValue={planningModel.agencySubmitted}
                      error={
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "required") ||
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                      <label className="text-dark text-dark-for-long-label">
                        Trạng thái<span className="required"></span>
                      </label>

                      <Autocomplete
                        id="planningStatusId"
                        options={planningStatusModel}
                        getOptionLabel={(option) => option.name}
                        value={planningStatus}
                        onChange={(event, newValue) => {
                          setPlanningStatus(newValue);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningStatusId"
                            inputRef={register({ required: true })}
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
                  {/* Quyết định phê duyệt */}
                  <div className="col-4">
                    <label className="text-dark text-dark-for-long-label">Quyết định phê duyệt</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="report"
                      defaultValue={planningModel.report}
                      variant="outlined"
                      size="small"
                      inputRef={register({ maxLength: 300, required: true })}
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="investor"
                          inputRef={register({ required: true })}
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
                  {/* Loại hồ sơ */}
                  {documentTypeModel && documentTypeModel.length > 0 && (
                    <div className="col-4">
                      <label className="text-dark text-dark-for-long-label">
                        Loại hồ sơ<span className="required"></span>
                      </label>

                      {documentTypeModel && documentTypeModel.length > 0 && (
                        <Autocomplete
                          id="documentTypeId"
                          options={documentTypeModel}
                          getOptionLabel={(option) => option.name}
                          value={documentType}
                          onChange={(event, newValue) => {
                            setDocumentType(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="documentTypeId"
                              inputRef={register({ required: true })}
                              error={
                                errors.documentTypeId &&
                                errors.documentTypeId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.documentTypeId &&
                        errors.documentTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* thứ tự */}
                  <div className="col-4">
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
                      defaultValue={planningModel.order}
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
                    <label className="text-dark text-dark-for-long-label">
                      Diện tích (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      type="text"
                      name="acreage"
                      onChange={(e) =>
                        setValue(
                          "acreage",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      defaultValue={planningModel.acreage}
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
                    <label className="text-dark text-dark-for-long-label">
                      Dân số (người)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="population"
                      defaultValue={planningModel.population}
                      onChange={(e) =>
                        setValue("population", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      error={
                        errors.population && errors.population.type === "required"
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
                      defaultValue={planningModel.landForConstruction}
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
                  <div className="col-4">
                    <label className="text-dark text-dark-for-long-label">Dữ liệu GIS ranh giới quy hoạch (shape file)</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="zipFileName"
                      value={zipName || planningModel.shpName}
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
                    className="col-4"
                    style={{
                      display: "flex",
                      alignItems: "center",

                    }}
                  >
                    <RadioGroup row value={isNew} onChange={handleChangeRaido}>
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

                  {!isNew &&
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
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningAdjustedId"
                              inputRef={register({ required: true })}
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
                  {/* Mã quy hoạch */}
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Mã quy hoạch<span className="required"></span>
                    </label>
                    <TextField
                      fullWidth
                      type="text"
                      name="planningCode"
                      defaultValue={planningModel.planningCode}
                      disabled
                      variant="outlined"
                      size="small"
                      inputRef={register({
                        maxLength: 50,
                      })}
                      error={
                        errors.planningCode &&
                        errors.planningCode.type === "maxLength"
                      }
                    />
                    {errors.planningCode &&
                      errors.planningCode.type === "maxLength" && (
                        <span className="error">Tối đa 50 ký tự</span>
                      )}
                  </div>
                  {/* tên đồ án */}
                  <div className="col-6">
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
                      defaultValue={planningModel.name}
                      error={
                        (errors.planningName &&
                          errors.planningName.type === "required") ||
                        (errors.planningName &&
                          errors.planningName.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                  {/* Trạng thái */}
                  {planningStatusModel && planningStatusModel.length > 0 && isQHHTKT && (
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Trạng thái<span className="required"></span>
                      </label>

                      <Autocomplete
                        id="planningStatusId"
                        options={planningStatusModel}
                        getOptionLabel={(option) => option.name}
                        value={planningStatus}
                        onChange={(event, newValue) => {
                          setPlanningStatus(newValue);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningStatusId"
                            inputRef={register({ required: true })}
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
                  {/* loại quy hoạch */}
                  {planningTypeModel && planningTypeModel.length > 0 && isQHT && (
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Loại quy hoạch<span className="required"></span>
                      </label>

                      {planningTypeModel && planningTypeModel.length > 0 && (
                        <Autocomplete
                          options={planningTypeModel}
                          getOptionLabel={(option) => option.name}
                          value={planningType}
                          onChange={(event, newValue) => {
                            setPlanningType(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningTypeId"
                              inputRef={register({ required: true })}
                              error={
                                errors.planningTypeId &&
                                errors.planningTypeId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.planningTypeId &&
                        errors.planningTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Địa điểm */}
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Địa điểm<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="place"
                      defaultValue={planningModel.place}
                      error={
                        (errors.place && errors.place.type === "required") ||
                        (errors.place && errors.place.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp phê duyệt<span className="required"></span>
                      </label>
                      {approvalAgencyModel && approvalAgencyModel.length > 0 && (
                        <Autocomplete
                          options={approvalAgencyModel}
                          getOptionLabel={(option) => option.name}
                          defaultValue={approvalAgencyModel.length && approvalAgencyModel.find(
                            (item) => item.id === planningModel.approvalAgencyLevelId
                          )}
                          onChange={(event, newValue) => {
                            setApprovalAgency(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="approvalAgencyId"
                              inputRef={register({ required: true })}
                              error={
                                errors.approvalAgencyId &&
                                errors.approvalAgencyId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.approvalAgencyId &&
                        errors.approvalAgencyId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* cấp quy hoạch */}
                  {planningLevelModel && planningLevelModel.length > 0 && (
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Cấp quy hoạch<span className="required"></span>
                      </label>

                      {planningLevelModel && planningLevelModel.length > 0 && (
                        <Autocomplete
                          id="planningLevelId"
                          options={planningLevelModel}
                          getOptionLabel={(option) => option.name}
                          value={planningLevel}
                          onChange={(event, newValue) => {
                            setPlanningLevel(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningLevelId"
                              inputRef={register({ required: true })}
                              error={
                                errors.planningLevelId &&
                                errors.planningLevelId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.planningLevelId &&
                        errors.planningLevelId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                </div>

                <div className="form-group row">
                  {/* cơ quan phê duyệt */}
                  <div className="col-6">
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningAgency"
                          inputRef={register({ required: true })}
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
                  {/* Đơn vị lập quy hoạch */}
                  <div className="col-6">
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="planningUnit"
                          inputRef={register({ required: true })}
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
                  <div className="col-6">
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
                      defaultValue={planningModel.order}
                      error={errors.order && errors.order.type === "required"}
                      variant="outlined"
                      size="small"
                    />
                    {errors.order && errors.order.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {/* Cơ quan trình */}
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Cơ quan trình<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="agencySubmitted"
                      defaultValue={planningModel.agencySubmitted}
                      error={
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "required") ||
                        (errors.agencySubmitted &&
                          errors.agencySubmitted.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                  <div className="col-6">
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
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="investor"
                          inputRef={register({ required: true })}
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
                  {/* Đơn vị tư vấn */}
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Đơn vị tư vấn<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true, maxLength: 300 })}
                      type="text"
                      name="consultingUnit"
                      defaultValue={planningModel.consultingUnit}
                      error={
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "required") ||
                        (errors.consultingUnit &&
                          errors.consultingUnit.type === "maxLength")
                      }
                      variant="outlined"
                      size="small"
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
                  {/* Loại hồ sơ */}
                  {documentTypeModel && documentTypeModel.length > 0 && (
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Loại hồ sơ<span className="required"></span>
                      </label>

                      {documentTypeModel && documentTypeModel.length > 0 && (
                        <Autocomplete
                          id="documentTypeId"
                          options={documentTypeModel}
                          getOptionLabel={(option) => option.name}
                          value={documentType}
                          onChange={(event, newValue) => {
                            setDocumentType(newValue);
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="documentTypeId"
                              inputRef={register({ required: true })}
                              error={
                                errors.documentTypeId &&
                                errors.documentTypeId.type === "required"
                              }
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      )}
                      {errors.documentTypeId &&
                        errors.documentTypeId.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                  )}
                  {/* Quyết định phê duyệt */}
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">Quyết định phê duyệt</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="report"
                      defaultValue={planningModel.report}
                      variant="outlined"
                      size="small"
                      inputRef={register({ maxLength: 300, required: true })}
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Diện tích (ha)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        pattern: regexDecial,
                      })}
                      type="text"
                      name="acreage"
                      onChange={(e) =>
                        setValue(
                          "acreage",
                          e.target.value.replace(/[^\d.,]/g, "")
                        )
                      }
                      defaultValue={planningModel.acreage}
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Dân số (người)<span className="required"></span>
                    </label>

                    <TextField
                      fullWidth
                      inputRef={register({ required: true })}
                      type="text"
                      name="population"
                      defaultValue={planningModel.population}
                      onChange={(e) =>
                        setValue("population", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      error={
                        errors.population && errors.population.type === "required"
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">
                      Huyện / Thành phố<span className="required"></span>
                    </label>
                    {lookupCommuneModel && lookupCommuneModel.length > 0 && (
                      <Autocomplete
                        multiple
                        options={lookupCommuneModel}
                        getOptionLabel={(option) => option.name}
                        defaultValue={lookupCommuneModel.filter((item) => {
                          if (
                            planningModel &&
                            planningModel.districtNames &&
                            planningModel.districtNames.length > 0 &&
                            planningModel.districtNames.some(
                              (name) => name === item.name
                            )
                          ) {
                            return item;
                          }
                        })}
                        onChange={(event, newValue) => {
                          setLookupCommune(newValue);
                          if (newValue.length > 0) {
                            setValue("lookupCommuneId", "11");
                            clearErrors("lookupCommuneId");
                          } else {
                            setValue("lookupCommuneId", "");
                            setError("lookupCommuneId", { type: "required" });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              errors.lookupCommuneId &&
                              errors.lookupCommuneId.type === "required"
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    )}
                    <TextField
                      name="lookupCommuneId"
                      hidden
                      inputRef={register({ required: true })}
                    />
                    {errors.lookupCommuneId &&
                      errors.lookupCommuneId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                  {/* Đất xây dựng */}
                  <div className="col-6">
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
                      defaultValue={planningModel.landForConstruction}
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
                  {planningStatusModel && planningStatusModel.length > 0 && isQHT && (
                    <div className="col-6">
                      <label className="text-dark text-dark-for-long-label">
                        Trạng thái<span className="required"></span>
                      </label>

                      <Autocomplete
                        id="planningStatusId"
                        options={planningStatusModel}
                        getOptionLabel={(option) => option.name}
                        value={planningStatus}
                        onChange={(event, newValue) => {
                          setPlanningStatus(newValue);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="planningStatusId"
                            inputRef={register({ required: true })}
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

                  <div className="col-6">
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
                        errors.field &&
                          errors.field.type === "maxLength"
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 300 }}
                      defaultValue={planningModel.field}
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
                      defaultValue={planningModel.constructionGroup}
                    />
                    {errors.constructionGroup &&
                      errors.constructionGroup.type === "maxLength" && (
                        <span className="error">Tối đa 300 ký tự</span>
                      )}
                  </div>
                </div>

                <div className="form-group row">
                  <div
                    className="col-6"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 25,
                    }}
                  >
                    <RadioGroup row value={isNew} onChange={handleChangeRaido}>
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

                  {!isNew &&
                    planningLookUpModel &&
                    planningLookUpModel.length > 0 && (
                      <div className="col-6">
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
                          }}
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="planningAdjustedId"
                              inputRef={register({ required: true })}
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">File Tif</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="tifFileName"
                      value={tifName || planningModel.tifName}
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
                  <div className="col-6">
                    <label className="text-dark text-dark-for-long-label">File Zip</label>
                    <TextField
                      fullWidth
                      type="text"
                      name="zipFileName"
                      value={zipName || planningModel.shpName}
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
          <div className="form-group">
            <FormControlLabel 
              control={<Checkbox/>}
              label="Kiểm tra"
              checked={isCheck}
              onChange={(e) =>
                setIsCheck(e.target.checked)
              }
              name="isCheck"
            />
          </div>
          <div className="form-group">
            <label className="text-dark text-dark-for-long-label">Ghi chú</label>

            <SunEditor
              enableToolbar={true}
              showToolbar={true}
              imageUploadSizeLimit={MaxSizeImageUpload}
              videoFileInput={false}
              setContents={planningModel.note}
              setOptions={{
                height: 500,
                buttonList: [
                  [
                    'undo',
                    'redo',
                    'font',
                    'fontSize',
                    'formatBlock',
                    'paragraphStyle',
                    'blockquote',
                    'bold',
                    'underline',
                    'italic',
                    'strike',
                    'subscript',
                    'superscript',
                    'fontColor',
                    'hiliteColor',
                    'textStyle',
                    'removeFormat',
                    'outdent',
                    'indent',
                    'align',
                    'horizontalRule',
                    'list',
                    'lineHeight',
                    'table',
                    'link',
                    'fullScreen',
                  ],
                ],
              }}
              onChange={onChangeContent}
              onBlur={(event, editorContents) =>
                onChangeContent(editorContents)
              }
            />

            <TextField
              type='text'
              inputRef={register}
              name='note'
              defaultValue={planningModel.note}
              className='d-none'
              value={content}
            />
          </div>
          <div className="form-group">
            <label className="text-dark text-dark-for-long-label">Thuyết minh</label>

            <textarea
              name="presentation"
              rows="3"
              className="form-control"
              defaultValue={planningModel.presentation}
              ref={register}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="text-dark text-dark-for-long-label">Quy định quản lý theo đồ án</label>

            <textarea
              name="regulation"
              rows="3"
              className="form-control"
              defaultValue={planningModel.regulation}
              ref={register}
            ></textarea>
          </div>
          <div className="form-group">
            <div className="row justify-content-between align-items-end">
              <div className="col-6 col-md-4">
                <label className="text-dark text-dark-for-long-label">
                  Ảnh<span className="required"></span>
                </label>
                {!isShow &&
                  files &&
                  files.length > 0 &&
                  files.map((item) => (
                    <div key={item.fileName} style={{ width: "150px" }}>
                      <img
                        src={config.APIUrlDefault + item.filePreview}
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
                    value={
                      (files && files.length > 0 && files[0].fileName) || ""
                    }
                  />
                  {errors.image && errors.image.type === "required" && (
                    <p className="error">Trường này là bắt buộc</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button
              type="button"
              onClick={() =>
                history.push({
                  pathname: isOtherPlanning ? UrlCollection.OtherPlanning :
                    isQHCC ? UrlCollection.PlanningCC :
                      isQHHTKT ? UrlCollection.QH_HTKT :
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
            {!planningModel.isLock && (
              <Button
                type="submit"
                style={{ margin: "20px 10px 50px 10px" }}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>
            )}
          </div>
        </form>
      )}

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
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
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
)(EditRecordsManagement);
