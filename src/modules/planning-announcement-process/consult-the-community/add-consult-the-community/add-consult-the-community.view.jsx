/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "date-fns";
import { ApiUrl } from '../../../../api/api-url';
import dateformat from "dateformat";

//--- Material Control
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  makeStyles,
  Typography,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

//--- Action
import * as consultTheCommunityAction from "../../../../redux/store/consult-the-community/consult-the-community.store";
import * as opinionFormAction from "../../../../redux/store/opinion-form/opinion-form.store";
import * as appActions from "../../../../core/app.store";

//--- Material Icon
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import * as viVN from "../../../../language/vi-VN.json";
import { NotificationMessageType, MaxSizeImageUpload, APIUrlDefault } from "../../../../utils/configuration";
import ShowNotification from "../../../../components/react-notifications/react-notifications";

import FileManagement from "../../../../components/file_management/file_management";
import FormTemplateComponent from "../form-template/form-template.view";

import "./add-consult-the-community.scss";

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

function AddConsultTheCommunity(props) {
  const {
    showLoading,
    isOpen,
    onClose,
    onSuccess,
    planningId,
    planningName,
    typeId
  } = props;
  const classes = useStyles();

  const today = new Date();
  const fromDate = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    0,
    0
  );
  const toDate = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getDate() + 1,
    today.getHours(),
    today.getMinutes(),
    0,
    0
  );

  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  const [content, setContent] = useState();
  const [statusId, setStatusId] = useState(null);
  const [statusLookUpModel, setStatusLookUpModel] = useState(null);
  const [hotNew, setHotNew] = useState(false);

  const [isPreviewForm, setIsPreviewForm] = useState(false);
  const [previewForm, setPreviewForm] = useState("");
  const [isShowFormTemplate, setShowFormTemplate] = useState(false);
  const [isCreateForm, setCreateForm] = useState(false);

  const [formTemplateLookUpModel, setFormTemplateLookUpModel] = useState([]);
  const [formTemplateModel, setFormTemplateModel] = useState(null);
  const [formTemplateStringModel, setFormTemplateStringModel] = useState("");

  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentsTemp, setDocumentsTemp] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);
  const [isDocumentShow, setDocumentShow] = useState(false);
  const urlUploadImage = APIUrlDefault + ApiUrl.UrlUploadFromEditor;
  const [fileSelected, setFileSelected] = useState([]);
  const [formTitle, setFormTitle] = useState(null)
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    onGetData();
  }, []);

  const onGetData = () => {
    showLoading(true);
    Promise.all([onGetConsultCommunityStatusLookup(), GetLookupFormTemplate()])
      .then((res) => {
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
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
          reject(err);
        }
      );
    });
  };

  const GetLookupFormTemplate = () => {
    showLoading(true);
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
          showLoading(false);
          resolve(res);
        },
        (err) => {
          showLoading(false);
          reject(err);
        }
      );
    });
  };

  const onSetStartDate = (time) => {
    setStartDate(time);
    if (time.getTime() < endDate.getTime()) {
      clearErrors(["startDate", "endDate"]);
    } else {
      setError("startDate", { type: "required" });
    }
  };

  const onSetEndDate = (time) => {
    setEndDate(time);
    if (time.getTime() > startDate.getTime()) {
      clearErrors(["startDate", "endDate"]);
    } else {
      setError("endDate", { type: "required" });
    }
  };

  const handleChangeHotNew = (event) => {
    setHotNew(event.target.checked);
  };

  const handleChangeContent = (content) => {
    clearErrors(["content"]);
    if (content === "<p><br></p>") {
      setError("content", { type: "required" });
      setContent("");
    } else {
      clearErrors("content");
      setContent(content);
    }
  };

  const handleChangeOpinionForm = (newValue) => {
    if (newValue) {
      setIsPreviewForm(true);
      setPreviewForm(newValue);
    }
  };

  const handleClickOpenFormTemplate = (_isCreateForm = false) => {
    setCreateForm(_isCreateForm);
    setShowFormTemplate(true);
  };

  const handleClickCloseFormTemplate = () => {
    setShowFormTemplate(false);
  };

  const onSaveData = (data, formTemplate) => {
    showLoading(true);
    let body = {
      title: data.commentTitle || null,

      startTime: startDate ? dateformat(startDate, "yyyy-mm-dd") : null,
      endTime: endDate ? dateformat(endDate, "yyyy-mm-dd") : null,
      isHotNew: hotNew || null,
      statusId: statusId || null,
      order: Number(data.order) || null,
      content: data.content || null,
      formOpinion: null,
      planningId: planningId || null,
      formTemplateStringModel: formTemplate || null,
      typeId: typeId || 1
    };

    if (files && files.length > 0) {
      body = {
        ...body,
        documentUploadId: files[0].fileId,
      };
    }
    if (fileSelected && fileSelected.length > 0) {
      body = {
        ...body,
        documents: fileSelected,
      };
    }

    consultTheCommunityAction
      .CreateConsultCommunity(body)
      .then((res) => {
        showLoading(false);
        onSuccess();
      })
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      });
  };

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    if (!formTemplateStringModel && !previewForm) {
      return;
    } else if (!formTemplateStringModel && previewForm) {
      showLoading(true);
      opinionFormAction.GetDetailFormTemplate(previewForm.value).then(
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
    console.log(documents)
  }, [documents])
  return (
    <div>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
          <DialogTitle disableTypography>
            {typeId == 1 ? (<Typography variant="h6">Thêm ý kiến quy hoạch</Typography>) : (<Typography variant="h6">Thêm ý kiến nhiệm vụ</Typography>)}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <DialogContent className="pt-4 pb-2" dividers>
              <div className="form-group">
                <label className="text-dark">Tên đồ án quy hoạch</label>
                <TextField
                  fullWidth
                  type="text"
                  name="planningName"
                  defaultValue={planningName}
                  disabled
                  variant="outlined"
                  size="small"
                  placeholder="Tên đồ án quy hoạch"
                />
              </div>

              <div className="form-group">
                <label className="text-dark">
                  Tiêu đề<span className="required"></span>
                </label>

                <TextField
                  fullWidth
                  type="text"
                  name="commentTitle"
                  variant="outlined"
                  size="small"
                  placeholder="Tiêu đề"
                  defaultValue={typeId == 1 ? ("Xin ý kiến đồ án quy hoạch ") : ("Xin ý kiến nhiệm vụ lập quy hoạch")}
                  error={
                    errors.commentTitle &&
                    errors.commentTitle.type === "required"
                  }
                  inputRef={register({ required: true, maxLength: 300 })}
                />
                {errors.commentTitle &&
                  errors.commentTitle.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                {errors.commentTitle &&
                  errors.commentTitle.type === "maxLength" && (
                    <span className="error">Tối đa 300 ký tự</span>
                  )}
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-lg-4">
                    <label className="text-dark">Chọn form xin ý kiến<span className="required"></span></label>
                    <div className="mb-1">
                      <Autocomplete
                        options={formTemplateLookUpModel}
                        getOptionLabel={(option) => option.title}
                        disableClearable={true}
                        onChange={(event, newValue) => {
                          handleChangeOpinionForm(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder={formTitle ? formTitle : 'Chọn form xin ý kiến'}
                          />
                        )}
                      />
                    </div>
                    {isPreviewForm && (
                      <a
                        href="#"
                        variant="body2"
                        onClick={() => handleClickOpenFormTemplate(false)}
                        className="mr-2"
                      >
                        <div className="d-flex align-items-center">
                          <VisibilityIcon fontSize="small" className="mr-1" />
                          Xem form
                        </div>
                      </a>
                    )}

                    {!isPreviewForm && (
                      <a href="#">
                        {formTemplateStringModel ? (
                          <div className="d-flex align-items-center" onClick={() => handleClickOpenFormTemplate(false)}>
                            <EditIcon fontSize="small" className="mr-1" />
                            Xem form
                          </div>
                        ) : (
                          <div className="d-flex align-items-center" onClick={() => handleClickOpenFormTemplate(true)}>
                            <AddCircleIcon fontSize="small" className="mr-1" />
                            Tạo form
                          </div>
                        )}
                      </a>
                    )}
                    <TextField
                      name="formTemplate"
                      type="hidden"
                      inputRef={register({ required: true })}
                      value={
                        (previewForm && previewForm.value) ||
                        formTemplateStringModel
                      }
                    />
                    {errors.formTemplate &&
                      errors.formTemplate.type === "required" && (
                        <div>
                          <span className="error">
                            Vui lòng chọn form mẫu hoặc tạo form
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="col-lg-4">
                    <label className="text-dark">Ngày bắt đầu</label>
                    <div className="w-100">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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

                  <div className="col-lg-4">
                    <label className="text-dark">Ngày kết thúc</label>
                    <div className="w-100">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                        value={statusLookUpModel[statusId - 1]}
                        onChange={(event, newValue) => {
                          clearErrors("tfStatus");
                          setStatusId(newValue.id);
                          setValue("tfStatus", newValue.id);
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Trạng thái"
                          />
                        )}
                      />
                      <TextField
                        name="tfStatus"
                        type="text"
                        fullWidth
                        inputRef={register({ required: true })}
                        hidden
                      />
                      {errors.tfStatus &&
                        errors.tfStatus.type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
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
                      placeholder="Thứ tự"
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
                  videoFileInput={false}
                  setOptions={{
                    height: "auto",
                    minHeight: 200,
                    maxHeight: 400,
                    imageUploadUrl: urlUploadImage,
                    imageUploadSizeLimit: MaxSizeImageUpload,
                    imageAccept: '.jpg,.jpeg,.png,.gift,.svg,.tif',
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
                  onChange={handleChangeContent}
                />
                <TextField
                  type="text"
                  inputRef={register({ required: true })}
                  name="content"
                  className="w-100"
                  value={content}
                  hidden
                />
                {errors.content && errors.content.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="form-group">
                <label className="text-dark">Chọn file đính kèm</label>
                <div className="list__img d-flex flex-wrap mt-1">
                  {!isShow &&
                    fileSelected &&
                    fileSelected.length > 0 &&
                    fileSelected.map((item) => (
                      <div key={item.fileName} className='file_item mr-3' style={{ width: "80px" }}>
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

            <DialogActions>
              <Button
                onClick={onClose}
                variant="contained"
                startIcon={<CloseIcon />}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
              fileSelected={fileSelected}
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
          isShow={isShowFormTemplate}
          setShow={handleClickCloseFormTemplate}
          formTemplateId={previewForm && previewForm.value}
          formTemplateModel={formTemplateModel}
          setFormTemplateModel={setFormTemplateModel}
          setFormTemplateStringModel={setFormTemplateStringModel}
          isShowActionAddEdit={true}
          isCreateForm={isCreateForm}
          setFormTitle={setFormTitle}
          refreshForm={GetLookupFormTemplate}
          isAddForm
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
)(AddConsultTheCommunity);
