/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
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
import * as communeAction from "../../../redux/store/commune-management/commune.store";

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

export default function AddCommuneManagement(props) {
  const classes = useStyles();
  const {
    isOpen,
    onClose,
    onSuccess,
    GetListCommuneManagement,
    rowsPerPage,
    setOrder,
    setOrderBy,
    showLoading,
  } = props;

  const [proviceSelect, setProviceSelect] = useState();
  const [districtByProvinceId, setDistrictByProvinceId] = useState();
  const [provinceId, setProvinceId] = useState();
  const [districtId, setDistrictId] = useState();

  useEffect(() => {
    showLoading(true);
    Promise.all([GetLookupProvince()])
      .then((res) => {
        const [provinceLookupModels] = res;
        setProviceSelect(
          provinceLookupModels && provinceLookupModels.content
            ? provinceLookupModels.content
            : []
        );
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!provinceId) return;
    GetDistrictByProvinceId(provinceId);
  }, [provinceId]);

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

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    showLoading(true);
    communeAction
      .CreateCommune(data)
      .then((result) => {
        communeAction.CreateCommunePaht(data);
        if (result) {
          setOrder("desc");
          setOrderBy("defaultProvince");
          GetListCommuneManagement(1, rowsPerPage);
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.AddCommune,
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

  const handleChangeSelect = (event) => {
    setValue("provindeId", event.target.value);
    setProvinceId(event.target.value);
  };

  const handleChooseDistrict = (event) => {
    setValue("districtId", event.target.value);
    setDistrictId(event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm xã - phường</Typography>
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
                    Tỉnh/ thành phố<span className="required"></span>
                  </label>
                  <Select
                    fullWidth
                    error={
                      errors.provideId && errors.provideId.type === "required"
                    }
                    onChange={handleChangeSelect}
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
                  <TextField
                    type="text"
                    name="provindeId"
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
                    Quận - huyện<span className="required"></span>
                  </label>
                  <Select
                    disabled={provinceId ? false : true}
                    fullWidth
                    error={
                      errors.districtId && errors.districtId.type === "required"
                    }
                    onChange={handleChooseDistrict}
                  >
                    {districtByProvinceId && districtByProvinceId.length > 0 ? (
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
                    disabled={provinceId && districtId ? false : true}
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
                    Mã xã - phường<span className="required"></span>
                  </label>
                  <TextField
                    disabled={provinceId && districtId ? false : true}
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
                    disabled={provinceId && districtId ? false : true}
                    fullWidth
                    inputRef={register({ required: true })}
                    type="number"
                    min={0}
                    step={"any"}
                    name="longitude"
                    error={
                      errors.longitude && errors.longitude.type === "required"
                    }
                  />
                  {errors.longitude && errors.longitude.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Vĩ độ<span className="required"></span>
                  </label>

                  <TextField
                    disabled={provinceId && districtId ? false : true}
                    fullWidth
                    inputRef={register({ required: true })}
                    type="number"
                    min={0}
                    step={"any"}
                    name="latitude"
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
