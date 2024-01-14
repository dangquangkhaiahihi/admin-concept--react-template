import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

//--- SunEditor
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import * as config from "../../../common/config";
import * as emailTemplateAction from "../../../redux/store/email-template/email-template.store";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

function AddEmailTemplate(props) {
  const classes = useStyles();
  const {
    openAddDialog,
    onHideModal,
    getListEmailModels,
    rowsPerPageCommon,
    setOrderBy,
    setOrder,
  } = props;
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm({ mode: "all", reValidateMode: "onBlur" });

  const [description, setDescription] = useState("");

  const onAddSubmit = (data) => {
    const emailModel = { ...data };
    emailTemplateAction.CreateEmailTemplate(emailModel).then(
      (res) => {
        if (res && res.content) {
          setOrderBy("modifiedDate");
          setOrder("desc");
          getListEmailModels(1, rowsPerPageCommon);
          onHideModal();
          ShowNotification(
            viVN.Success.EmailAddSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };

  const handleOnchangeDescription = (content) => {
    clearErrors(["description"]);
    if (content === "<p><br></p>") {
      setError("description", { type: "required" });
      setDescription("");
    } else {
      clearErrors("description");
      setDescription(content);
    }
  };

  return (
    <div>
      <Dialog
        open={openAddDialog}
        onClose={onHideModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" className="border-bottom">
          {"Thêm mới"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onHideModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onAddSubmit)}>
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Tiêu đề<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="title"
                    className="w-100"
                    inputRef={register({ required: true, maxLength: 120 })}
                    error={
                      errors.title &&
                      (errors.title.type === "required" ||
                        errors.title.type === "maxLength")
                    }
                  />
                  {errors.title && errors.title.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.title && errors.title.type === "maxLength" && (
                    <span className="error">
                      Tiêu đề không lớn hơn 120 ký tự
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Code<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="code"
                    className="w-100"
                    inputRef={register({ required: true, maxLength: 50 })}
                    onChange={(e) => {
                      setValue(
                        "code",
                        e.target.value
                          .replace(/ư/g, "w")
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase(),
                        {
                          shouldDirty: true,
                        }
                      );
                    }}
                    error={
                      errors.code &&
                      (errors.code.type === "required" ||
                        errors.code.type === "maxLength")
                    }
                  />
                  {errors.code && errors.code.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.code && errors.code.type === "maxLength" && (
                    <span className="error">Tối đa 50 ký tự</span>
                  )}
                  {errors.code && errors.code.type === "pattern" && (
                    <span className="error">
                      Viết hoa hoặc số và không chứa các ý tự đặc biệt
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Gửi tới</label>
                  <TextField
                    type="text"
                    inputRef={register}
                    name="sendTo"
                    className="w-100"
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">CC</label>
                  <TextField className="w-100" name="cc" inputRef={register} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="text-dark">
                Mô tả<span className="required"></span>
              </label>
              <SunEditor
                enableToolbar={true}
                showToolbar={true}
                setOptions={{
                  height: 500,
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
                onChange={handleOnchangeDescription}
              />
              <TextField
                type="text"
                inputRef={register({ required: true })}
                name="description"
                className="w-100"
                value={description}
                hidden
              />
              {errors.description && errors.description.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
            </div>
          </DialogContent>
          <DialogActions className="border-top">
            <Button
              onClick={onHideModal}
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
              {config.EmailConfig.save}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
export default AddEmailTemplate;
