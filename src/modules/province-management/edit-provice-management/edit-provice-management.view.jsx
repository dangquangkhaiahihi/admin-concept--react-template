import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

//--- Action
import * as proviceAction from "../../../redux/store/province-management/province.store";

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
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- Notifications
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
}));

function AdministrativeUnitCodeErrorMessage(props) {
  let errorMessage = '';
  switch (props.errorType) {
    case "required": errorMessage = 'Trường này là bắt buộc'; break;
    case "pattern": errorMessage = 'Mã bưu điện là số'; break;
    case "maxLength": errorMessage = 'Tối đa 6 ký tự'; break;
  }

  return (
    <span className="error">{errorMessage}</span>
  )
}

export default function EditProviceManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    proviceId,
    setOrder,
    setOrderBy,
    GetListLandType,
    rowsPerPage,
    showLoading,
  } = props;

  const [proviceModel, setProviceModel] = useState();

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const isAdministrativeUnitCodeError = errors.administrativeUnitCode &&
    (errors.administrativeUnitCode.type === "required" ||
      errors.administrativeUnitCode.type === "pattern" ||
      errors.administrativeUnitCode.type === "maxLength");

  useEffect(() => {
    showLoading(true);
    proviceAction
      .GetDetailProvince(proviceId)
      .then((res) => {
        if (res && res.content) {
          setProviceModel(res.content);
          setValue(
            "administrativeUnitCode",
            res.content.administrativeUnitCode
          );
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  }, []);

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    showLoading(true);
    proviceAction
      .UpdateProvince({ ...data, id: proviceId })
      .then((result) => {
        proviceAction.UpdateProvincePaht({...data, id: proviceId})
        if (result) {
          setOrder("desc");
          setOrderBy("defaultProvince");
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.EditProvice,
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
          <Typography variant="h6">Chỉnh sửa tỉnh</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {proviceModel && (
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
                      defaultValue={proviceModel.name}
                      error={errors.name && errors.name.type === "required"}
                    />
                    {errors.fullName && errors.fullName.type === "required" && (
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
                      defaultValue={proviceModel.administrativeUnitCode}
                      inputRef={register({
                        required: true,
                        pattern: /^\d+$/,
                        maxLength: 6,
                      })}
                      error={isAdministrativeUnitCodeError}
                    />
                    {errors.administrativeUnitCode &&
                      <AdministrativeUnitCodeErrorMessage errorType={errors.administrativeUnitCode.type} />}
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
                      defaultValue={proviceModel.longitude}
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
                    {errors.longitude &&
                      errors.longitude.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                    {errors.longitude &&
                      errors.longitude.type === "pattern" && (
                        <span className="error">
                          Ví dụ tọa độ: 12345 hoặc 12345.000
                        </span>
                      )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Vĩ độ<span className="required"></span></label>
                    <TextField
                      type="text"
                      name="latitude"
                      className="w-100"
                      defaultValue={proviceModel.latitude}
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
                    defaultValue={proviceModel.area}
                    placeholder="Đơn vị km2"
                    className="w-100"
                    inputRef={register}
                  />
                </div>
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
    </div>
  );
}
