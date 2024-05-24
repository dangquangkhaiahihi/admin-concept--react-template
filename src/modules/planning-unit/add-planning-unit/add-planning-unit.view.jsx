import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
  Select as SelectMui,
  MenuItem
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import "suneditor/dist/css/suneditor.min.css";

import * as planningUnitAction from "../../../redux/store/planning-unit/planning-unit.store";
import { patternNumber, patternPhone } from "../../../common/validatePhoneNumber";

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

const AddPlanningUnit = ({
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  setOrder,
  setOrderBy,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [listPlanningUnit, setListPlanningUnit] = useState([]);
  const [planningUnitSelected, setPlanningUnitSelected] = useState(null);
  function handleChangeSelectPlanningUnit(event) {
    setPlanningUnitSelected(event.target.value);
  }
  useEffect(() => {
    planningUnitAction.GetLookupPlanningUnit().then((res) => {
    setListPlanningUnit(res.length > 0?res.content:[])
    setPlanningUnitSelected(res.content.length > 0?res.content[0].id:null)
  });
  }, []);
  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    data.name && formData.append("name", data.name);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);
    planningUnitSelected && formData.append("parentId", planningUnitSelected);
    planningUnitAction
      .CreatePlanning(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListAll(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.PlaningUnitAddSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch(err => {
        onSuccess()
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        )}
      );
  };
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm đơn vị</Typography>
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
              <label className="text-dark">
                Tên đơn vị<span className="required"></span>
              </label>
              <TextField
                inputRef={register({ required: true, maxLength: 300 })}
                name="name"
                error={errors.name && errors.name.type === "required"}
                fullWidth
                type="text"
                className="form-control"
                onChange={(e) => setValue("name", e.target.value)}
              />
              {errors.name && errors.name.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.name && errors.name.type === "maxLength" && (
                <span className="error">Tối đa 300 ký tự</span>
              )}
            </div>
            <div className="form-group">
              <label className="text-dark">
                Địa chỉ<span className="required"></span>
              </label>
              <TextField
                inputRef={register({ required: true, maxLength: 300 })}
                name="address"
                error={errors.address && errors.address.type === "required"}
                fullWidth
                type="text"
                className="form-control"
                onChange={(e) => setValue("address", e.target.value)}
              />
              {errors.address && errors.address.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.address && errors.address.type === "maxLength" && (
                <span className="error">Tối đa 300 ký tự</span>
              )}
            </div>
            <div className="form-group">
              <label className="text-dark">
                Số điện thoại<span className="required"></span>
              </label>
              <TextField
                inputRef={register({
                  required: true, pattern: patternPhone, minLength: 10, maxLength: 10
                })}
                name="phone"
                error={errors.phone && errors.phone.type === "required"}
                fullWidth
                type="text"
                className="form-control"
                inputProps={{ maxLength: 10 }}
                onChange={(e) =>
                  setValue(
                    "phone",
                    e.target.value.replace(patternNumber, "")
                  )
                }
              />
              {errors.phone && errors.phone.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.phone && errors.phone.type === "pattern" && (
                <span className="error">{errors.phone.message}</span>
              )}
              {errors.phone && (errors.phone.type === "minLength" || errors.phone.type === "maxLength") && (
                <span className="error">Số điện thoại phải 10 số</span>
              )}
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12">
                  <label className="text-dark">Đơn vị cấp trên</label>
                  <br />
                  <SelectMui
                    className="w-100"
                    value={planningUnitSelected}
                    onChange={handleChangeSelectPlanningUnit}
                  >
                    {listPlanningUnit && listPlanningUnit.length > 0 ? (
                      listPlanningUnit.map((item) => (
                        <MenuItem value={item.id}><p style={{whiteSpace : 'break-spaces'}}>{item.name}</p></MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options</MenuItem>
                    )}
                  </SelectMui>
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
};

export default AddPlanningUnit;
