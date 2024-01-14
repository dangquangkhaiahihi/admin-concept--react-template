/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Action
import * as appActions from "../../../core/app.store";
import * as homePageAction from "../../../redux/store/home-page/home-page.store";

//--- Material Control
import {
  DialogActions,
  TextareaAutosize,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  makeStyles,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- Notifications
import ShowNotification from "../../../components/react-notifications/react-notifications";
import {
  NotificationMessageType,
  APIUrlDefault,
} from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

import FileManagement from "../../../components/file_management/file_management";

//--- Styles
import "../slider.scss";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function EditSlider(props) {
  const classes = useStyles();

  const {
    showLoading,
    isOpen,
    onClose,
    onSuccess,
    sliderId,
    setOrder,
    setOrderBy,
    GetListHomePage,
    rowsPerPage,
  } = props;

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [sliderModel, setSliderModel] = useState();
  const [status, setStatus] = useState(true);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    onGetData();
  }, [sliderId]);

  const onGetData = () => {
    showLoading(true);
    homePageAction
      .GetDetailHomePage(sliderId)
      .then((res) => {
        if (!res || !res.content) {
          onClose && onClose();
          showLoading(false);
          ShowNotification(
            viVN.Errors[(res && res.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
          return;
        }

        setSliderModel(res.content);
        setStatus(res.content.status ? true : false);
        setFiles(
          res.content.avatars ? [res.content.avatars] : [res.content.files]
        );
        showLoading(false);
      })
      .catch((err) => {
        onClose && onClose();
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

    const formData = new FormData();
    data.title && formData.append("Title", data.title);
    data.content && formData.append("Introduce", data.content);
    data.order && formData.append("Order", Number(data.order));
    data.link && formData.append("Link", data.link);
    formData.append("Id", sliderId);
    formData.append("Status", status ? true : false);
    files &&
      files.length > 0 &&
      files.map(
        (file) =>
          file &&
          file.fileId &&
          formData.append("DocumentUploadId", file.fileId)
      );

    showLoading(true);
    homePageAction
      .UpdateHomePage(formData)
      .then((res) => {
        showLoading(false);
        if (!res) return;
        setOrder("asc");
        setOrderBy("order");
        GetListHomePage(1, rowsPerPage);
        onSuccess();
        ShowNotification(
          viVN.Success.SliderEditSuccess,
          NotificationMessageType.Success
        );
      })
      .catch((err) => {
        showLoading(false);
        onSuccess();
        err.errorMessage && ShowNotification(
          err.errorMessage, NotificationMessageType.Error);
      });
  };

  function handleChangeSelect(event) {
    setStatus(event.target.value);
  }

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
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
          <DialogTitle disableTypography className="border-bottom">
            <Typography variant="h6">Chỉnh sửa Slider</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {sliderModel && (
              <DialogContent className="pt-4 pb-2">
                <div className="form-group">
                  <label className="text-dark">
                    Tiêu đề<span className="required"></span>
                  </label>
                  <TextField
                    inputRef={register({ required: true })}
                    name="title"
                    error={errors.title && errors.title.type === "required"}
                    fullWidth
                    type="text"
                    className="form-control"
                    defaultValue={sliderModel.title}
                    onChange={(e) =>
                      setValue("title", e.target.value.toUpperCase())
                    }
                  />
                  {errors.title && errors.title.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-dark">Tóm tắt</label>
                  <TextareaAutosize
                    name="content"
                    rowsMin={3}
                    className={"form-control"}
                    ref={register}
                    defaultValue={sliderModel.introduce}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                      <label className="text-dark">
                        Thứ tự<span className="required"></span>
                      </label>
                      <TextField
                        inputRef={register({ required: true })}
                        type="text"
                        name="order"
                        className="w-100"
                        defaultValue={sliderModel.order}
                        onChange={(e) =>
                          setValue(
                            "order",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        error={errors.order && errors.order.type === "required"}
                      />
                      {errors.order && errors.order.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                      <label className="text-dark">Trạng thái</label>
                      <br />
                      <Select
                        className="w-100"
                        value={status}
                        onChange={handleChangeSelect}
                      >
                        <MenuItem value={true}>Hiện</MenuItem>
                        <MenuItem value={false}>Ẩn</MenuItem>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                      <label className="text-dark">Đường dẫn</label>
                      <TextField
                        inputRef={register}
                        type="text"
                        name="link"
                        className="w-100"
                        defaultValue={sliderModel.link}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-dark">
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
              </DialogContent>
            )}

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
    </div>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(EditSlider);
