import React from "react";
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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import {
  NotificationMessageType,
} from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import "suneditor/dist/css/suneditor.min.css";
import * as investorAction from "../../../redux/store/investor/investor.store";
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

const AddInvestor = ({
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  setOrder,
  setOrderBy,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } =
    useForm({
      mode: "all",
      reValidateMode: "onBlur",
    });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    data.name && formData.append("name", data.name);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);

    investorAction
      .CreateInvestor(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListAll(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.InvestorAddSuccess,
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
      })
  };
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm Chủ Đầu Tư</Typography>
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
                Tên chủ đầu tư<span className="required"></span>
              </label>
              <TextField
                inputRef={register({ required: true, maxLength: 300 })}
                name="name"
                error={
                  errors.name &&
                  (errors.name.type === "required" ||
                    errors.name.type === "maxLength")
                }
                fullWidth
                type="text"
                className="form-control"
                onChange={(e) => setValue("name", e.target.value)}
              />
              {errors.name && errors.name.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.name &&
                errors.name.type === "maxLength" && (
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
                error={
                  errors.address &&
                  (errors.address.type === "required" ||
                    errors.address.type === "maxLength")
                }
                fullWidth
                type="text"
                className="form-control"
                onChange={(e) => setValue("address", e.target.value)}
              />
              {errors.address && errors.address.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.address &&
                errors.address.type === "maxLength" && (
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
                inputProps={{ maxLength: 10, }}
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

export default AddInvestor;
