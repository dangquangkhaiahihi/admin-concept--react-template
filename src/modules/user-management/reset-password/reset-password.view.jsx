import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//--- Styles
// import "../slider.scss";

//--- Material Control
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Typography,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { faKey, faUserCircle } from "@fortawesome/free-solid-svg-icons";
//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as userManagementAction from "../../../redux/store/user-management/user-management.store";

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

export default function ResetPassword(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    userId,
    GetListUserManagement,
    rowsPerPage,
    setOrder,
    setOrderBy,
  } = props;

  const {
    register,
    handleSubmit,
    errors,
    watch,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    userManagementAction
      .ResetPasswordUserManagement(userId, data.password)
      .then((res) => {
        if (res && res.content) {
          onSuccess();
          ShowNotification(
            viVN.Success.RestPassword,
            NotificationMessageType.Success
          );
        }
      })
      .catch((err) => {
        onSuccess();
        ShowNotification(
          viVN.Errors[err.errorType],
          NotificationMessageType.Error
        );
      });
  };

  const onChangePassword = () => {
    const { password, confirmPassword } = getValues();
    password === confirmPassword
      ? clearErrors(["confirmPassword"])
      : setError("confirmPassword", { type: "validate" });
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Đặt lại mật khẩu</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Mật khẩu mới<span className="required"></span>
                  </label>
                  <TextField
                    type="password"
                    inputRef={register({
                      required: true,
                      minLength: 8,
                      // pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!-@#$%^&*()_+=[{},<.>/?'";:|]).*$/,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
                    })}
                    onChange={onChangePassword}
                    name="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    error={
                      errors.password &&
                      (errors.password.type === "required" ||
                        errors.password.type === "minLength" ||
                        errors.password.type === "pattern")
                    }
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <span className="error">Mật khẩu tối thiểu 8 ký tự</span>
                  )}
                  {errors.password && errors.password.type === "pattern" && (
                    <span className="error">
                      Có it nhất 1 ký tự viết thường, hoa và ký tự đặc biệt
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Xác nhận mật khẩu<span className="required"></span>
                  </label>
                  <TextField
                    type="password"
                    inputRef={register({
                      validate: (value) =>
                        value === password.current ||
                        "Mật khẩu không trùng khớp",
                    })}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Nhập lại mật khẩu"
                    error={
                      errors.confirmPassword &&
                      errors.confirmPassword.type === "required" &&
                      errors.confirmPassword.type === "validate"
                    }
                  />
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "validate" && (
                      <span className="error">Mật khẩu không khớp</span>
                    )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="border-top">
            <Button
              type="submit"
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
              Thay đổi mật khẩu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
