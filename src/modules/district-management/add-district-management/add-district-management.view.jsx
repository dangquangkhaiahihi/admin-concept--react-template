import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

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
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as proviceAction from "../../../redux/store/province-management/province.store";
import * as districtAction from "../../../redux/store/district-management/district.store";
import "./add-district-management.scss";

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

export default function AddDistrictManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    GetListDistrict,
    rowsPerPage,
    showLoading,
  } = props;

  const [proviceSelect, setProviceSelect] = useState();

  useEffect(() => {
    proviceAction.GetLookupProvince().then((res) => {
      setProviceSelect(res && res.content ? res.content : []);
    });
  }, []);

  const { register, handleSubmit, errors, setValue, control } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log(data)
    if (!data) {
      return;
    }
    showLoading(true);
    districtAction
      .CreateDistrict(data)
      .then((result) => {
        districtAction.CreateDistrictPaht(data)
        if (result && result.content && result.content.status === true) {
          GetListDistrict(1, rowsPerPage);
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.AddDistrict,
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
          <Typography variant="h6">Thêm quận/huyện</Typography>
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
                    Tên quận huyện<span className="required"></span>
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
                    Mã quận - huyện<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="administrativeUnitCode"
                    className="w-100"
                    inputRef={register({
                      required: true,
                    })}
                    onChange={(e) =>
                      setValue(
                        "administrativeUnitCode",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                    error={
                      errors.administrativeUnitCode &&
                      errors.administrativeUnitCode.type === "required"
                    }
                  />
                  {errors.administrativeUnitCode &&
                    errors.administrativeUnitCode.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
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
                  <FormControl
                    fullWidth
                    error={
                      errors.provinceId && errors.provinceId.type === "required"
                    }
                  >
                    <label className="text-dark">
                      Tỉnh/ thành phố<span className="required"></span>
                    </label>
                    <Controller
                      name="provinceId"
                      rules={{ required: true }}
                      control={control}
                      as={
                        <Select>
                          {proviceSelect && proviceSelect.length > 0 ? (
                            proviceSelect.map((item) => (
                              <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                          ) : (
                              <MenuItem value="">
                                Không có tỉnh thành nào
                              </MenuItem>
                            )}
                        </Select>
                      }
                    />
                  </FormControl>
                  {errors.provinceId &&
                    errors.provinceId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
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
