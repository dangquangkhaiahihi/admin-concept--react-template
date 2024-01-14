import React from "react";
import { useForm } from "react-hook-form";

//--- Material Control
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
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as proviceAction from "../../../redux/store/province-management/province.store";

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

export default function AddProviceManagement(props) {
  const classes = useStyles();
  const {
    isOpen,
    onClose,
    onSuccess,
    GetListProvince,
    rowsPerPage,
    showLoading,
  } = props;

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    showLoading(true);
    proviceAction
      .CreateProvince(data)
      .then((result) => {
        proviceAction.CreateProvincePaht(data)  
        if (result && result.content && result.content.status === true) {
          GetListProvince(1, rowsPerPage);
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.AddProvice,
            NotificationMessageType.Success
          );
        }
      })
      .catch((err) => {
        showLoading(false);
        onSuccess();
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        );
      });
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm tỉnh</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Tên tỉnh<span className="required"></span>
                  </label>
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
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Mã bưu điện<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="administrativeUnitCode"
                    className="w-100"
                    inputRef={register({
                      required: true,
                      pattern: /^\d+$/,
                      maxLength: 6,
                    })}
                    error={
                      errors.administrativeUnitCode &&
                      (errors.administrativeUnitCode.type === "required" ||
                        errors.administrativeUnitCode.type === "pattern" ||
                        errors.administrativeUnitCode.type === "maxLength")
                    }
                  />
                  {errors.administrativeUnitCode &&
                    errors.administrativeUnitCode.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  {errors.administrativeUnitCode &&
                    errors.administrativeUnitCode.type === "pattern" && (
                      <span className="error">Mã bưu điện là số</span>
                    )}
                  {errors.administrativeUnitCode &&
                    errors.administrativeUnitCode.type === "maxLength" && (
                      <span className="error">Tối đa 6 ký tự</span>
                    )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Kinh độ<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="longitude"
                    className="w-100"
                    inputRef={register({
                      required: true,
                      pattern: /^\d+(\.\d{1,9})?$/,
                    })}
                    error={
                      errors.longitude &&
                      (errors.longitude.type === "required" ||
                        errors.longitude.type === "pattern")
                    }
                  />
                  {errors.longitude && errors.longitude.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.longitude && errors.longitude.type === "pattern" && (
                    <span className="error">
                      Ví dụ tọa độ: 12345 hoặc 12345.000
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Vĩ độ<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="latitude"
                    className="w-100"
                    inputRef={register({
                      required: true,
                      pattern: /^\d+(\.\d{1,9})?$/,
                    })}
                    error={
                      errors.latitude &&
                      (errors.latitude.type === "required" ||
                        errors.latitude.type === "pattern")
                    }
                  />
                  {errors.latitude && errors.latitude.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.latitude && errors.latitude.type === "pattern" && (
                    <span className="error">
                      Ví dụ tọa độ: 12345 hoặc 12345.000
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Diện tích
                  </label>
                  <TextField
                    type="text"
                    name="area"
                    placeholder="Đơn vị km2"
                    className="w-100"
                    inputRef={register}
                  />
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
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
