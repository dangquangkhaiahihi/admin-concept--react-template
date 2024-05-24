import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DropzoneArea } from 'material-ui-dropzone';

//--- Action
import * as serviceLinkAction from "../../../redux/store/service-link/service-link.store";

//--- Material Control
import {
  DialogActions,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  makeStyles,
  Typography,
  IconButton,
  Select, MenuItem
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- Notifications
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//configuration
import FileManagement from "../../../components/file_management/file_management";
import {
  APIUrlDefault,
} from "../../../utils/configuration";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function EditServiceLinkManagement(props) {
  const classes = useStyles();

  const { isOpen, onClose, onSuccess, serviceLinkId, setOrder, setOrderBy, GetListServiceLink, rowsPerPage, showLoading } = props;

  const [serviceLinkModel, setServiceLinkModel] = useState();
  const [linkGroupLookup, setLinkGroupLookup] = useState();
  const [isActive, setIsActive] = useState(true);
  const [isShow, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);

  useEffect(() => {
    showLoading(true);
    Promise.all([GetDetailServiceLink(serviceLinkId), GetLookupLinkGroup()]).then((res) => {
      const [serviceLinkModel, linkGroupLookup] = res;
      setIsActive(serviceLinkModel && serviceLinkModel.content ? serviceLinkModel.content.active : false)
      setServiceLinkModel(serviceLinkModel && serviceLinkModel.content ? serviceLinkModel.content : []);
      setFiles(serviceLinkModel && serviceLinkModel.content && serviceLinkModel.content.file ? [serviceLinkModel.content.file] : []);
      setLinkGroupLookup(linkGroupLookup && linkGroupLookup.content ? linkGroupLookup.content : []);
      showLoading(false)
    }).catch((err) => {
      showLoading(false);
    })
  }, [])
  const GetDetailServiceLink = (serviceLinkId) => {
    return new Promise((resolve, reject) => {
      serviceLinkAction.GetDetailServiceLink(serviceLinkId).then((res) => {
        return resolve(res)
      }, (err) => {
        reject(err);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      })
    })
  }
  const GetLookupLinkGroup = () => {
    return new Promise((resolve, reject) => {
      serviceLinkAction.GetLookupLinkGroup().then((res) => {
        return resolve(res);
      }, (err) => {
        reject(err);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      })
    })
  }

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    const formData = new FormData();
    formData.append("id", serviceLinkId);
    formData.append("name", data.name);
    files && files.length > 0 && files[0] && files[0].fileId && formData.append("DocumentUploadId", files[0].fileId);
    formData.append("groupId", data.groupId);
    formData.append("link", data.link);
      formData.append("order", data.order);
      formData.append("icon", data.icon);
      formData.append("color", data.color);
    formData.append("active", isActive);

    serviceLinkAction.UpdateServiceLink(formData).then((result) => {
      if (result) {
        setOrder("desc");
        setOrderBy("modifiedDate")
        GetListServiceLink(1, rowsPerPage);
        onSuccess();
        ShowNotification(
          viVN.Success.EditProvice,
          NotificationMessageType.Success
        )
      }
    }).catch((err) => {
      onSuccess();
      ShowNotification(
        err.errorMessage,
        NotificationMessageType.Error
      )
    })
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

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa danh sách liên kết</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {serviceLinkModel && <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Tên danh sách liên kết<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="name"
                    className="w-100"
                    defaultValue={serviceLinkModel.name}
                    inputRef={register({ required: true })}
                    error={errors.name && errors.name.type === "required"}
                  />
                  {errors.name && errors.name.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Sắp xếp<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="order"
                    className="w-100"
                    defaultValue={serviceLinkModel.order}
                    inputRef={register({
                      required: true,
                    })}
                    onChange={(e => setValue("order", e.target.value.replace(/[^0-9]/g, "")))}
                    error={errors.order && errors.order.type === "required"}
                  />
                  {errors.order && errors.order.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Danh sách nhóm<span className="required"></span></label>
                  <Select fullWidth defaultValue={serviceLinkModel.groupId} onChange={(event) => setValue("groupId", event.target.value)} >
                    {linkGroupLookup && linkGroupLookup.length > 0 && linkGroupLookup.map((item, index) => <MenuItem key={index} value={item.id}>{item.name}</MenuItem >)}
                  </Select>
                  <TextField
                    type="text"
                    name="groupId"
                    className="w-100"
                    defaultValue={serviceLinkModel.groupId}
                    inputRef={register({ required: true })}
                    hidden
                  />
                  {errors.groupId && errors.groupId.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Link<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="link"
                    defaultValue={serviceLinkModel.link}
                    className="w-100"
                    inputRef={register}
                  />
                </div>
              </div>
                      </div>

                      <div className="form-group">
                          <div className="row">
                              <div className="col-12 col-md-6 col-lg-6 mb-3">
                                  <label className="text-dark">
                                      Icon
                                  </label>
                                  <TextField
                                      type="text"
                                      name="icon"
                                      className="w-100"
                                      inputRef={register({ maxLength: 20 })}
                                      inputProps={{ maxLength: 20 }}
                                      defaultValue={serviceLinkModel.icon}
                                      error={
                                          errors.icon &&
                                          (errors.icon.type === "maxLength")
                                      }
                                  />
                                  {errors.icon && errors.icon.type === "maxLength" && (
                                      <span className="error">Trường này không quá 20 ký tự</span>
                                  )}
                              </div>
                              <div className="col-12 col-md-6 col-lg-6 mb-3">
                                  <label className="text-dark">
                                      Màu
                                  </label>
                                  <TextField
                                      type="text"
                                      name="color"
                                      className="w-100"
                                      inputRef={register({ maxLength: 7, pattern: /^#(?:[0-9a-fA-F]{6}){1,2}$/i })}
                                      error={errors.color && (errors.color.type === "maxLength" || errors.color.type === "pattern")}
                                      inputProps={{ maxLength: 7 }}
                                      defaultValue={serviceLinkModel.color}
                                  />
                                  {errors.color && errors.color.type === "maxLength" && (
                                      <span className="error">Trường này không quá 7 ký tự</span>
                                  )}
                                  {errors.color && errors.color.type === "pattern" && (
                                      <span className="error">Mã màu phải có dấu # và 6 ký tự (ví dụ: #fff000)</span>
                                  )}
                              </div>
                          </div>
                      </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Trạng thái<span className="required"></span></label>
                  <Select fullWidth defaultValue={isActive} onChange={(event) => setIsActive(event.target.value)} >
                    <MenuItem  value={true}>{"Hoạt động"}</MenuItem >
                    <MenuItem  value={false}>{"Không hoạt động"}</MenuItem >
                  </Select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="text-dark">Ảnh</label>
              {!isShow &&
                files &&
                files.length > 0 &&
                files.map((item) => (
                  <div key={item.fileName} style={{ width: "150px" }}>
                    <img
                      src={APIUrlDefault + item.filePreview}
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
                  </div>
                ))}
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenSelectFile}
                >
                  Chọn Ảnh
                  </Button>
              </div>
            </div>

          </DialogContent>}

          <DialogActions className="border-top">
            <Button
              type="button"
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
    </div>
  );
}
