import React, { useState, useEffect } from "react";
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
}));

const EditApprovalAgency = ({
  isOpen,
  onClose,
  onSuccess,
  approvalAgencyId,
  GetListAll,
  rowsPerPage,
  approvalAgencyLevel,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setValue, clearErrors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [approvalAgency, setApprovalAgency] = useState();
  const [approvalAgencySelected, setApprovalAgencySelected] = useState({});

  useEffect(() => {
    approvalAgencyAction
      .GetDetail(approvalAgencyId)
      .then((res) => {
        if (res && res.content) {
          setApprovalAgency(res.content);
          setApprovalAgencySelected(approvalAgencyLevel?.find(
            (item) => item.id === res.content?.approvalAgencyLevelId
          ))
          setValue("approvalAgencyId", res.content?.approvalAgencyLevelId)
        }
      })
      .catch((err) => console.log(err));
  }, [approvalAgencyId]);

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    let formData = new FormData();
    formData.append("id", approvalAgencyId);
    data.name && formData.append("name", data.name);
    approvalAgencySelected &&
      formData.append("approvalAgencyLevelId", approvalAgencySelected?.id);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);
    approvalAgencyAction
      .UpdateApprovalAgency(formData)
      .then((result) => {
        if (result) {
          onSuccess();
          ShowNotification(
            viVN.Success.EditApprovalAgency,
            NotificationMessageType.Success
          );
          GetListAll(1, rowsPerPage);
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

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa cơ quan phê duyệt</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {approvalAgency && (
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
                  defaultValue={approvalAgency?.name}
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
                  value={approvalAgencySelected}
                  onChange={(event, newValue) => {
                    setApprovalAgencySelected(newValue);
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
                  defaultValue={approvalAgency?.address}
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
                  defaultValue={approvalAgency?.phone}
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
};

export default EditApprovalAgency;
