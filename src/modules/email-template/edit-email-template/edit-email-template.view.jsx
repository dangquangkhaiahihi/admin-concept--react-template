/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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

function EditEmailDialog(props) {
  const classes = useStyles();
  const {
    openAddDialog,
    onHideModal,
    emailEditCode,
    getListEmailModels,
    rowsPerPageCommon,
    setOrder,
  } = props;
  const { register, handleSubmit, errors, setError, clearErrors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [emailEditModel, setEmailEditModel] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    emailTemplateAction
      .GetDetailEmailTemplate(emailEditCode)
      .then((res) => res && res.content && setEmailEditModel(res.content))
      .catch((rejects) => console.log(rejects));
  }, []);

  const onEditSubmit = (data) => {
    let body = {
      status: true,
      ...data,
      code: emailEditModel.code || data.code,
    };
    emailTemplateAction.UpdateEmailTemplate(body).then(
      (res) => {
        if (res && res.content) {
          setOrder("modifiedDate");
          setOrder("desc");
          getListEmailModels(1, rowsPerPageCommon);
          onHideModal();
          ShowNotification(
            viVN.Success.EmailEditSuccess,
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

  const handleOnchange = (content) => {
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
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sửa email"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onHideModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {emailEditModel ? (
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <DialogContent className="pt-4 pb-2" dividers>
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">
                      Tiêu đề<span className="required"></span>
                    </label>
                    <TextField
                      inputRef={register({ required: true })}
                      type="text"
                      name="title"
                      className="w-100"
                      defaultValue={emailEditModel.title}
                      error={errors.title && errors.title.type === "required"}
                    />
                    {errors.title && errors.title.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">Code</label>
                    <TextField
                      inputRef={register}
                      type="text"
                      name="code"
                      className="w-100"
                      defaultValue={emailEditModel.code}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">Gửi tới</label>
                    <TextField
                      type="text"
                      inputRef={register}
                      name="sendTo"
                      className="w-100"
                      defaultValue={emailEditModel.sendTo}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">CC</label>
                    <TextField
                      className="w-100"
                      name="cc"
                      inputRef={register}
                      defaultValue={emailEditModel.cc}
                    />
                  </div>
                </div>
              </div>
              {emailEditModel && emailEditModel.description && (
                <div className="form-group">
                  <label className="text-dark">Mô tả</label>
                  <SunEditor
                    enableToolbar={true}
                    showToolbar={true}
                    setContents={emailEditModel.description}
                    setOptions={{
                      minHeight: 350,
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
                    onChange={handleOnchange}
                  />
                  <TextField
                    className="w-100"
                    name="description"
                    inputRef={register({ required: true })}
                    value={description}
                    hidden
                  />
                  {errors.description &&
                    errors.description.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
              )}
            </DialogContent>
            <DialogActions>
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
                {config.EmailConfig.update}
              </Button>
            </DialogActions>
          </form>
        ) : (
          "Xảy ra lỗi trong hệ thống"
        )}
      </Dialog>
    </div>
  );
}
export default EditEmailDialog;
