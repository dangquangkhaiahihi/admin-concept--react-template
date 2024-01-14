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
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import * as config from "../../../common/config";
// import * as emailTemplateAction from "../../../redux/store/email-template/email-template.store";
import * as roleManagementAction from "../../../redux/store/role/role-management.store"
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import cleanAccents from "../../../common/replace";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

function AddRoleManagement(props) {
  const classes = useStyles();
  const { openAddDialog, onHideModal, getListRoleManagement, rowsPerPageCommon, setPage } = props;
  const { register, handleSubmit, errors, setError, clearErrors, setValue } = useForm({ mode: "all", reValidateMode: "onBlur" });


  const onAddSubmit = (data) => {
    const roleModel = { ...data }
    roleModel && roleManagementAction.CreateRoleManagement(roleModel).then(res => {
      if (res && res.content) {
        setPage(0);
        getListRoleManagement(1, rowsPerPageCommon);
        onHideModal();
        ShowNotification(
          viVN.Success.RoleAddSuccess,
          NotificationMessageType.Success
        )
      }
    },
      err => {
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      });
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
          Thêm mới
          <IconButton aria-label="close" className={classes.closeButton} onClick={onHideModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onAddSubmit)}>
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Code<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="code"
                    className="w-100"
                    inputRef={register({ required: true, maxLength: 50, pattern: /^[a-zA-Z0-9]+$/ })}
                    onChange={(e) =>
                      setValue("code", e.target.value.toUpperCase(), {
                        shouldDirty: true
                      })
                    }
                    error={errors.code && (errors.code.type === "required" || errors.code.type === "maxLength")}
                  />
                  {errors.code && errors.code.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.code && errors.code.type === "maxLength" && (
                    <span className="error">Tối đa 50 ký tự</span>
                  )}
                  {errors.code && errors.code.type === "pattern" && (
                    <span className="error">Code phải là dạng tiếng anh và không có kí tự đặc biệt như dấu cách</span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Tên role<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="name"
                    className="w-100"
                    inputRef={register({ required: true })}
                    error={errors.name && errors.name.type === "required"}
                  />
                  {errors.name && errors.name.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
              </div>
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

  )
}
export default AddRoleManagement