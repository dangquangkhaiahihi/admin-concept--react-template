/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

//--- Action
import * as proviceAction from "../../../redux/store/province-management/province.store";
import * as districtAction from "../../../redux/store/district-management/district.store";
import * as communeAction from "../../../redux/store/commune-management/commune.store";

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

export default function EditCommuneManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    communeId,
    setOrder,
    setOrderBy,
    GetListCommuneManagement,
    rowsPerPage,
    showLoading,
  } = props;

  const [proviceSelect, setProviceSelect] = useState();
  const [districtByProvinceId, setDistrictByProvinceId] = useState();
  const [communeModel, setCommuneModel] = useState();
  const [provinceId, setProvinceId] = useState();
  const [districtId, setDistrictId] = useState();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    showLoading(true);
    Promise.all([GetDetailCommune(communeId), GetLookupProvince()])
      .then((res) => {
        const [detailCommune, lookUpProvince] = res;
        setCommuneModel(
          detailCommune && detailCommune.content ? detailCommune.content : []
        );
        detailCommune &&
          detailCommune.content &&
          detailCommune.content.provinceId &&
          setProvinceId(detailCommune.content.provinceId);
        detailCommune &&
          detailCommune.content &&
          detailCommune.content.districtId &&
          setDistrictId(detailCommune.content.districtId);
        setProviceSelect(
          lookUpProvince && lookUpProvince.content ? lookUpProvince.content : []
        );
        detailCommune &&
          detailCommune.content &&
          detailCommune.content.provinceId &&
          GetDistrictByProvinceId(detailCommune.content.provinceId);
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  }, []);

  const GetLookupProvince = () => {
    return new Promise((resolve, reject) => {
      proviceAction.GetLookupProvince().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const GetDetailCommune = (communeId) => {
    return new Promise((resolve, reject) => {
      communeAction.GetDetailCommune(communeId).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const GetDistrictByProvinceId = (provinceId) => {
    if (!provinceId) return;
    showLoading(true);
    return districtAction
      .GetDistrictByProvinceId(provinceId)
      .then((res) => {
        setDistrictByProvinceId(res && res.content ? res.content : []);
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    const communeModelInput = {
      id: communeId,
      name: data.name,
      administrativeUnitCode: data.administrativeUnitCode,
      longitude: data.longitude,
      latitude: data.latitude,
      districtId: districtId,
    };

    communeAction
      .UpdateCommune(communeModelInput)
      .then((res) => {
        communeAction.UpdateCommunePaht(communeModelInput);
        if (res) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListCommuneManagement(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.EditCommune,
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
    setProvinceId(event.target.value);
    GetDistrictByProvinceId(event.target.value);
    setValue("provinceId", event.target.value);
  };

  const handleChooseDistrict = (event) => {
    setDistrictId(event.target.value);
    setValue("districtId", event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa xã - phường</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {communeModel && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">
                      Tỉnh/ thành phố<span className="required"></span>
                    </label>
                    <Select
                      fullWidth
                      defaultValue={communeModel.provinceId}
                      onChange={handleChangeSelect}
                    >
                      {proviceSelect && proviceSelect.length > 0 ? (
                        proviceSelect.map((item) => (
                          <MenuItem value={item.id}>{item.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">Không có tỉnh thành nào</MenuItem>
                      )}
                    </Select>
                    <TextField
                      type="text"
                      name="provinceId"
                      defaultValue={communeModel.provinceId}
                      className="w-100"
                      inputRef={register({ required: true })}
                      hidden
                    />
                    {errors.provinceId &&
                      errors.provinceId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">
                      Huyện - thị xã<span className="required"></span>
                    </label>
                    <Select
                      fullWidth
                      defaultValue={communeModel.districtId}
                      onChange={handleChooseDistrict}
                    >
                      {districtByProvinceId &&
                      districtByProvinceId.length > 0 ? (
                        districtByProvinceId.map((item) => (
                          <MenuItem value={item.id}>{item.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">Không có quận huyện nào</MenuItem>
                      )}
                    </Select>
                    <TextField
                      type="text"
                      name="districtId"
                      className="w-100"
                      defaultValue={communeModel.provinceId}
                      inputRef={register({ required: true })}
                      hidden
                    />
                    {errors.districtId &&
                      errors.districtId.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                      )}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">
                      Tên xã - phường<span className="required"></span>
                    </label>
                    <TextField
                      type="text"
                      name="name"
                      className="w-100"
                      defaultValue={communeModel.name}
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
                      defaultValue={communeModel.administrativeUnitCode}
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
                      inputRef={register({ required: true })}
                      defaultValue={communeModel.longitude}
                      onChange={(e) =>
                        setValue(
                          "longitude",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      error={
                        errors.longitude && errors.longitude.type === "required"
                      }
                    />
                    {errors.longitude &&
                      errors.longitude.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
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
                      inputRef={register({ required: true })}
                      defaultValue={communeModel.latitude}
                      onChange={(e) =>
                        setValue(
                          "latitude",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      error={
                        errors.latitude && errors.latitude.type === "required"
                      }
                    />
                    {errors.latitude && errors.latitude.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
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
