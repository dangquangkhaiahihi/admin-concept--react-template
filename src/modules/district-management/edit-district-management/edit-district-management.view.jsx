/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

//--- Action
import * as proviceAction from "../../../redux/store/province-management/province.store";
import * as districtAction from "../../../redux/store/district-management/district.store";

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
  Select,
  MenuItem,
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

export default function EditDistrictManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    districtId,
    setOrder,
    setOrderBy,
    GetListDistrict,
    rowsPerPage,
    showLoading,
  } = props;

  const [districtModel, setDistrictModel] = useState();
  const [proviceSelect, setProviceSelect] = useState();
  const [provinceId, setProviceId] = useState();

  useEffect(() => {
    showLoading(true);
    proviceAction
      .GetLookupProvince()
      .then((res) => {
        if (res && res.content) {
          setProviceSelect(res.content);
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });

    districtAction
      .GetDetailDistrict(districtId)
      .then((res) => {
        if (res && res.content) {
          setDistrictModel(res.content);
          setProviceId(res.content.provinceId);
          showLoading(false);
        }
      })
      .catch((err) => {
        showLoading(false);
      });
  }, []);

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    districtAction
      .UpdateDistrict({ ...data, provinceId: provinceId, id: districtId })
      .then((result) => {
        districtAction.UpdateDistrictPaht({ ...data, provinceId: provinceId, id: districtId })
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListDistrict(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.EditDistrict,
            NotificationMessageType.Success
          );
        }
      })
      .catch((err) => {
        onSuccess();
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        );
      });
  };

  const handleChangeSelect = (event) => {
    setProviceId(event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa quận huyện</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {districtModel && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">
                      Tên quận - huyện<span className="required"></span>
                    </label>
                    <TextField
                      type="text"
                      name="name"
                      className="w-100"
                      inputRef={register({ required: true })}
                      defaultValue={districtModel.name}
                      error={errors.name && errors.name.type === "required"}
                    />
                    {errors.fullName && errors.fullName.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Mã quận huyện</label>
                    <TextField
                      type="text"
                      name="administrativeUnitCode"
                      className="w-100"
                      defaultValue={districtModel.administrativeUnitCode}
                      inputRef={register({ required: true })}
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
                      defaultValue={districtModel.longitude}
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
                    <label className="text-dark">
                      Vĩ độ<span className="required"></span>
                    </label>
                    <TextField
                      type="text"
                      name="latitude"
                      className="w-100"
                      defaultValue={districtModel.latitude}
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
                      Tỉnh/ thành phố<span className="required"></span>
                    </label>
                    <br />
                    <Select
                      className="w-100"
                      defaultValue={districtModel.provinceId}
                      onChange={(e) => {
                        handleChangeSelect(e);
                      }}
                    >
                      {proviceSelect && proviceSelect.length > 0 ? (
                        proviceSelect.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">Không có tỉnh thành nào</MenuItem>
                      )}
                    </Select>
                    {errors.provice && errors.provice.type === "required" && (
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
                    defaultValue={districtModel.area}
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
