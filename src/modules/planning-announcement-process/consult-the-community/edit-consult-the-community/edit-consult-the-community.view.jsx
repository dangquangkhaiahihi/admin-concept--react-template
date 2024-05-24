/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dateformat from "dateformat";

import * as consultTheCommunityAction from "../../../../redux/store/consult-the-community/consult-the-community.store";
import * as opinionFormAction from "../../../../redux/store/opinion-form/opinion-form.store";
import * as appActions from "../../../../core/app.store";
import viLocale from "date-fns/locale/vi";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Checkbox,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import FormTemplateComponent from "../form-template/form-template.view";
import FileManagement from "../../../../components/file_management/file_management";

import * as viVN from "../../../../language/vi-VN.json";
import { NotificationMessageType, MaxSizeImageUpload, APIUrlDefault } from "../../../../utils/configuration";
import ShowNotification from "../../../../components/react-notifications/react-notifications";

import "./edit-consult-the-community.scss";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  accordionSummary: {
    minHeight: "50px !important",
    borderBottom: "1px solid #e3e6f0",
    height: 50,
    paddingLeft: 0,
  },
  accordionHeading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    marginTop: 2,
  },
}));

function EditConsultTheCommunity(props) {
  const classes = useStyles();
  const { showLoading, isOpen, onClose, onSuccess, consultCommunityId, typeId } = props;

  //--- Variables
  const [content, setContent] = useState();
  const [statusId, setStatusId] = useState(null);
  const [hotNew, setHotNew] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [consultCommunityModel, setConsultCommunityModel] = useState(null);
  const [statusLookUpModel, setStatusLookUpModel] = useState(null);
  const [formTemplateLookUpModel, setFormTemplateLookUpModel] = useState([]);
  const [isShowFormTemplate, setShowFormTemplate] = useState(false);
  const [formTemplateModel, setFormTemplateModel] = useState(null);
  const [formTemplateStringModel, setFormTemplateStringModel] = useState("");
  const [statusLookUpSelected, setStatusLookUpSelected] = useState({});

  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentsTemp, setDocumentsTemp] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);
  const [isDocumentShow, setDocumentShow] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [consultLock, setConsultLock] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm({ mode: "all", reValidateMode: "onBlur" });

  useEffect(() => {
    onGetData();
  }, []);

  const onGetData = () => {
    showLoading(true);
    Promise.all([
      onGetDetailConsultCommunity(),
      onGetConsultCommunityStatusLookup(),
      GetLookupFormTemplate(),
    ])
      .then((res) => {
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
        onClose && onClose();
      });
  };

  const onGetDetailConsultCommunity = (id = consultCommunityId) => {
    return new Promise((resolve, reject) => {
      consultTheCommunityAction.GetDetailConsultCommunity(id).then(
        (res) => {
          if (res && res.content) {
            console.log('onGetDetailConsultCommunity', res.content);
            setConsultCommunityModel(res.content);
            setStartDate(res.content.startTime);
            setEndDate(res.content.endTime);
            setHotNew(res.content.isHotNew);
            setStatusId(res.content.statusId);
            res.content.isLock && setConsultLock(res.content.isLock);
            res.content.files && setFiles([res.content.files]);
            res.content.documentFiles && setFileSelected(res.content.documentFiles);
          }
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

  const onGetConsultCommunityStatusLookup = () => {
    return new Promise((resolve, reject) => {
      consultTheCommunityAction.GetConsultCommunityStatusLookup().then(
        (res) => {
          res && res.content && setStatusLookUpModel(res.content);
          resolve(res);
        },
        (err) => {
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
          reject(err);
        }
      );
    });
  };

  const GetLookupFormTemplate = () => {
    return new Promise((resolve, reject) => {
      opinionFormAction.GetLookupFormTemplate().then(
        (res) => {
          setFormTemplateLookUpModel(
            (res &&
              res.content &&
              res.content.map((item) => {
                return {
                  value: item.id,
                  title: item.title,
                };
              })) ||
            []
          );
          resolve(res);
        },
        (err) => {
          ShowNotification(
            viVN.Errors[(err && err.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
          reject(err);
        }
      );
    });
  };

  const onSetStartDate = (time) => {
    setStartDate(dateformat(time, "yyyy-mm-dd"));
    const newEndDate = new Date(endDate);
    if (time.getTime() < newEndDate.getTime()) {
      clearErrors(["startDate", "endDate"]);
    } else {
      setError("startDate", { type: "required" });
    }
  };

  const onSetEndDate = (time) => {
    setEndDate(dateformat(time, "yyyy-mm-dd"));
    const newStartDate = new Date(startDate);
    if (time.getTime() > newStartDate.getTime()) {
      clearErrors(["startDate", "endDate"]);
    } else {
      setError("endDate", { type: "required" });
    }
  };

  const handleChangeHotNew = (event) => {
    setHotNew(event.target.checked);
  };

  const handleChangeEditor = (content) => {
    clearErrors(["content"]);
    if (content === "<p><br></p>") {
      setError("content", { type: "required" });
      setContent("");
    } else {
      clearErrors("content");
      setContent(content);
    }
  };

  const handleClickOpenFormTemplate = () => {
    setShowFormTemplate(true);
  };

  const handleClickCloseFormTemplate = () => {
    setShowFormTemplate(false);
  };

  //--- Save data
  const onSaveData = (data, formTemplate) => {
    showLoading(true);

    let params = {
      id: consultCommunityModel.id,
      title: data.title,
      startTime: startDate ? dateformat(startDate, "yyyy-mm-dd") : null,
      endTime: endDate ? dateformat(endDate, "yyyy-mm-dd") : null,
      isHotNew: hotNew,
      statusId: statusId,
      order: Number(data.order),
      content: content,
      formOpinion: null,
      planningId: consultCommunityModel.planningId,
      formTemplateStringModel: formTemplate,
    };

    if (files && files.length > 0) {
      params = {
        ...params,
        documentUploadId: files[0].fileId,
      };
    }
    if (fileSelected && fileSelected.length > 0) {
      params = {
        ...params,
        documents: fileSelected,
      };
    }
    consultTheCommunityAction.UpdateConsultCommunity(params).then(
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
    );
  };

  const onEditSubmit = (data) => {
    if (!data) {
      return;
    }

    if (!formTemplateStringModel) {
      showLoading(true);
      opinionFormAction
        .GetDetailFormTemplate(consultCommunityModel.formTemplateId)
        .then(
          (res) => {
            showLoading(false);
            if (res && res.content) {
              onSaveData(data, JSON.stringify(res.content));
            } else {
              ShowNotification(
                viVN.Errors[(res && res.errorType) || "UnableHandleException"],
                NotificationMessageType.Error
              );
            }
          },
          (err) => {
            showLoading(false);
            ShowNotification(
              viVN.Errors[(err && err.errorType) || "UnableHandleException"],
              NotificationMessageType.Error
            );
          }
        );
    } else {
      onSaveData(data, formTemplateStringModel);
    }
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

  const onOpenSelectDocument = () => {
    setDocumentShow(true);
    setDocumentsTemp(documents);
  };
  const onCloseSelectDocument = () => {
    setDocumentShow(false);
    setDocuments(documentsTemp);
  };
  const onSaveSelectDocument = () => {
    setDocumentShow(false);
    setFileSelected([...fileSelected, ...documents])
    console.log([...documents])
  };
  useEffect(() => {
    if (statusId && statusLookUpModel) {
      setStatusLookUpSelected(statusLookUpModel.find((x) => x.id === statusId))
    }
  }, [statusId, statusLookUpModel])

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Sửa ý kiến</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onEditSubmit)} autoComplete="off">
          {consultCommunityModel && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <label className="text-dark">Tên đồ án quy hoạch</label>
                <TextField
                  fullWidth
                  type="text"
                  name="planningName"
                  variant="outlined"
                  size="small"
                  defaultValue={consultCommunityModel.planingName}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="text-dark">
                  Tiêu đề<span className="required"></span>
                </label>

                <TextField
                  fullWidth
                  type="text"
                  name="title"
                  variant="outlined"
                  size="small"
                  defaultValue={consultCommunityModel.title}
                  error={errors.title && errors.title.type === "required"}
                  inputRef={register({ required: true })}
                />
                {errors.title && errors.title.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-4">
                    {consultCommunityModel.formTemplateId > 0 && (
                      <div className="form-group">
                        <label className="text-dark">Form xin ý kiến</label>
                        <TextField
                          size="small"
                          fullWidth
                          defaultValue={consultCommunityModel.formTemplateName}
                          disabled={true}
                          className="mt-1"
                        />
                        <div className="d-flex align-items-center mt-1">
                          <a
                            style={{ color: '#4e73df',cursor: 'pointer' }}
                            variant="body2"
                            onClick={handleClickOpenFormTemplate}
                          >
                            <VisibilityIcon fontSize="small" className="mr-1" />
                            {"Xem form"}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-4">
                    <label className="text-dark">
                      Ngày bắt đầu<span className="required"></span>
                    </label>
                    <div className="w-100">
                      <MuiPickersUtilsProvider
                        utils={DateFnsUtils}
                        locale={viLocale}
                      >
                        <DatePicker
                          id="startDate"
                          name="startDate"
                          onChange={(date) => date && onSetStartDate(date)}
                          format="dd/MM/yyyy"
                          value={startDate}
                          fullWidth
                          showTodayButton={true}
                          error={
                            errors.startDate &&
                            errors.startDate.type === "required"
                          }
                        />
                      </MuiPickersUtilsProvider>
                      {errors.startDate &&
                        errors.startDate.type === "required" && (
                          <span className="error">
                            Phải nhỏ hơn ngày kết thúc
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="col-4">
                    <label className="text-dark">
                      Ngày kết thúc<span className="required"></span>
                    </label>
                    <div className="w-100">
                      <MuiPickersUtilsProvider
                        utils={DateFnsUtils}
                        locale={viLocale}
                      >
                        <DatePicker
                          id="endDate"
                          name="endDate"
                          onChange={(date) => date && onSetEndDate(date)}
                          format="dd/MM/yyyy"
                          value={endDate}
                          fullWidth
                          showTodayButton={true}
                          error={
                            errors.endDate && errors.endDate.type === "required"
                          }
                        />
                        {errors.endDate &&
                          errors.endDate.type === "required" && (
                            <span className="error">
                              Phải lớn hơn ngày bắt đầu
                            </span>
                          )}
                      </MuiPickersUtilsProvider>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  {statusLookUpModel && statusLookUpModel.length > 0 && (
                    <div className="col-12 col-md-5 col-lg-5">
                      <label className="text-dark">
                        Trạng thái<span className="required"></span>
                      </label>
                      <Autocomplete
                        id="cbStatus"
                        options={statusLookUpModel}
                        getOptionLabel={(option) => option.name}
                        fullWidth
                        value={statusLookUpSelected}
                        onChange={(event, newValue) => {
                          setStatusId(newValue.id);
                          setStatusLookUpSelected(newValue);
                          setValue("cbStatus", newValue?.id)
                          clearErrors("cbStatus");
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </div>
                  )}

                  <div className="col-12 col-md-5 col-lg-5">
                    <label className="text-dark">
                      Thứ tự<span className="required"></span>
                    </label>
                    <TextField
                      name="order"
                      type="text"
                      fullWidth
                      variant="outlined"
                      size="small"
                      defaultValue={consultCommunityModel.order}
                      inputRef={register({ required: true })}
                      onChange={(e) =>
                        setValue("order", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      error={errors.order && errors.order.type === "required"}
                    />
                    {errors.order && errors.order.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>

                  <div className="col-12 col-md-2 col-lg-2">
                    <label className="text-dark">Tin nổi bật</label>
                    <div className="w-100">
                      <Checkbox
                        checked={hotNew}
                        onChange={handleChangeHotNew}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                        className="p-0 mt-2 ml-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="text-dark">Upload file biểu mẫu</label>
                {!isShow &&
                  files &&
                  files.length > 0 &&
                  files.map((item) => (
                    <div key={item.fileName} className='file_item mr-3' style={{ width: "100px" }}>
                      <img
                        src={require("../../../../assets/icon/default.svg")}
                        alt={item.fileName}
                        title={item.fileName}
                        className="img-fluid mb-2"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                      <p className="file_name">{item.fileName}</p>
                      <p
                        className="close_x"
                        onClick={() =>
                          setFiles([])
                        }
                      >
                        &#10005;
                      </p>
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
                </div>
              </div>


              <div className="form-group">
                <label className="text-dark">Nội dung<span className="required"></span></label>
                <SunEditor
                  enableToolbar={true}
                  showToolbar={true}
                  imageUploadSizeLimit={MaxSizeImageUpload}
                  videoFileInput={false}
                  setContents={consultCommunityModel.content}
                  setOptions={{
                    height: "auto",
                    minHeight: 200,
                    maxHeight: 400,
                    buttonList: [
                      [
                        "undo",
                        "redo",
                        "font",
                        "fontSize",
                        "formatBlock",
                        "paragraphStyle",
                        "blockquote",
                        "bold",
                        "underline",
                        "italic",
                        "strike",
                        "subscript",
                        "superscript",
                        "fontColor",
                        "hiliteColor",
                        "textStyle",
                        "removeFormat",
                        "outdent",
                        "indent",
                        "align",
                        "horizontalRule",
                        "list",
                        "lineHeight",
                        "table",
                        "link",
                        "image",
                        "video",
                        "audio",
                        "fullScreen",
                        "showBlocks",
                        "codeView",
                      ],
                    ],
                  }}
                  onChange={handleChangeEditor}
                />
                {errors.content && errors.content.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>

              <div className="form-group">
                <label className="text-dark">Chọn file đính kèm</label>
                <div className="list__img d-flex flex-wrap mt-1">
                  {!isDocumentShow &&
                    fileSelected &&
                    fileSelected.length > 0 &&
                    fileSelected.map((item) => (
                      <div key={item.fileName} className='file_item mr-3' style={{ width: "70px" }}>
                        <img
                          src={require("../../../../assets/icon/default.svg")}
                          alt={item.fileName}
                          title={item.fileName}
                          className="img-fluid mb-2"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                        />
                        <p className="file_name">{item.fileName}</p>
                        <p
                          className="close_x"
                          onClick={() =>
                            setFileSelected(fileSelected.filter(i => i !== item))
                          }
                        >
                          &#10005;
                        </p>
                      </div>
                    ))}
                </div>

                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenSelectDocument}
                  >
                    Chọn file
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
          <DialogActions className="border-top">
            <Button
              onClick={onClose}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            {!props.isLock && (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>

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
              multiple={true}
              files={files}
              setFiles={setFiles}
              acceptedFiles={["doc", "docx", "txt", "pdf"]}
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
      {isDocumentShow && (
        <Dialog
          onClose={onCloseSelectDocument}
          open={isDocumentShow}
          fullWidth={true}
          maxWidth="md"
          className="dialog-preview-form"
        >
          <DialogTitle disableTypography>
            <Typography variant="h6">Quản lý file</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onCloseSelectDocument}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              multiple={true}
              files={documents}
              setFiles={setDocuments}
              acceptedFiles={["doc", "docx", "txt", "pdf", "png", "jpg"]}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectDocument}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            {documents && documents.length > 0 && (
              <Button
                type="button"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSaveSelectDocument}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
      {isShowFormTemplate && (
        <FormTemplateComponent
          isLock={consultLock}
          isShow={isShowFormTemplate}
          setShow={handleClickCloseFormTemplate}
          formTemplateId={consultCommunityModel.formTemplateId}
          formTemplateModel={formTemplateModel}
          setFormTemplateModel={setFormTemplateModel}
          setFormTemplateStringModel={setFormTemplateStringModel}
          isShowActionAddEdit={false}
        />
      )}
    </div>
  );
}

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
)(EditConsultTheCommunity);
