import React, { useState } from "react";
import { useForm } from "react-hook-form";

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

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";

import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";

import * as approvalAgencyAction from "../../../redux/store/approval-agency/approval-agency.store";
import "suneditor/dist/css/suneditor.min.css";
import * as viVN from "../../../language/vi-VN.json";
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

const AddApprovalAgency = ({
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  setOrder,
  setOrderBy,
  approvalAgencyLevel,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue, clearErrors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [approvalAgencyLevelId, setApprovalAgencyId] = useState();

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    data.name && formData.append("name", data.name);
    approvalAgencyLevelId &&
      formData.append("approvalAgencyLevelId", approvalAgencyLevelId?.id);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);

    approvalAgencyAction
      .CreateApprovalAgency(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListAll(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.ApprovalAgencyAddSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch(
        (err) =>
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error)
        
      );
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm Cơ Quan</Typography>
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
                Tên cơ quan<span className="required"></span>
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
                Cấp phê duyệt<span className="required"></span>
              </label>
              <Autocomplete
                options={approvalAgencyLevel}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                value={approvalAgencyLevelId?.id}
                onChange={(event, newValue) => {
                  setApprovalAgencyId(newValue);
                  setValue("approvalAgencyId", newValue?.id)
                  clearErrors("approvalAgencyId");
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="approvalAgencyId"
                    {...register('approvalAgencyId', { required: true })}
                    error={
                      errors.approvalAgencyId &&
                      errors.approvalAgencyId.type === "required"
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              {errors.approvalAgencyId &&
                errors.approvalAgencyId.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
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
              {errors.phone && (errors.phone.type === "minLength" || errors.phone.type === "maxLength") && (
                <span className="error">Số điện thoại phải 10 số</span>
              )}
              {errors.phone && errors.phone.type === "pattern" && (
                <span className="error">{errors.phone.message}</span>
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

export default AddApprovalAgency;
