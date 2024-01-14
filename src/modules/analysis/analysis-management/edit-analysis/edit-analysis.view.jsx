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

import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";

import * as analysisAction from "../../../../redux/store/analysis/analysis.store";
import "suneditor/dist/css/suneditor.min.css";
import * as viVN from "../../../../language/vi-VN.json";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const EditAnalysis = ({
  isOpen,
  onClose,
  onSuccess,
  analysisId,
  GetListAll,
  rowsPerPage,
  analysisLevel,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [analysis, setAnalysis] = useState();
  const [analysisLevelId, setAnalysisId] = useState();

  useEffect(() => {
    analysisAction
      .GetDetail(analysisId)
      .then((res) => {
        if (res && res.content) {
          setAnalysis(res.content);
        }
      })
      .catch((err) => console.log(err));
  }, [analysisId]);

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    let formData = new FormData();
    formData.append("id", analysisId);
    data.name && formData.append("name", data.name);
    analysisLevelId &&
      formData.append("analysisLevelId", analysisLevelId?.id);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);

    analysisAction
      .UpdateAnalysis(formData)
      .then((result) => {
        if (result) {
          onSuccess();
          ShowNotification(
            viVN.Success.NewsEditSuccess,
            NotificationMessageType.Success
          );
          GetListAll(1, rowsPerPage);
        }
      })
      .catch((err) => {
        onSuccess();
        ShowNotification(
          viVN.Errors[err.errorType],
          NotificationMessageType.Error
        );
      });
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa Cơ quan phê duyệt</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {analysis && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <label className="text-dark">
                  Tên đơn vị<span className="required"></span>
                </label>
                <TextField
                  inputRef={register({ required: true })}
                  name="name"
                  error={errors.name && errors.name.type === "required"}
                  fullWidth
                  type="text"
                  className="form-control"
                  defaultValue={analysis?.name}
                  onChange={(e) => setValue("name", e.target.value)}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="form-group">
                <label className="text-dark">
                  Cấp phê duyệt<span className="required"></span>
                </label>
                <Autocomplete
                  options={analysisLevel}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  defaultValue={analysisLevel.find(
                    (item) => item.id === analysis?.analysisLevelId
                  )}
                  onChange={(event, newValue) => {
                    setAnalysisId(newValue);
                  }}
                  disableClearable={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="analysisId"
                      inputRef={register({ required: true })}
                      error={
                        errors.analysisId &&
                        errors.analysisId.type === "required"
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                {errors.analysisId &&
                  errors.analysisId.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
              </div>
              <div className="form-group">
                <label className="text-dark">
                  Địa chỉ<span className="required"></span>
                </label>
                <TextField
                  inputRef={register({ required: true })}
                  name="address"
                  error={errors.address && errors.address.type === "required"}
                  fullWidth
                  type="text"
                  className="form-control"
                  defaultValue={analysis?.address}
                  onChange={(e) => setValue("address", e.target.value)}
                />
                {errors.address && errors.address.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="form-group">
                <label className="text-dark">
                  Số điện thoại<span className="required"></span>
                </label>
                <TextField
                  inputRef={register({ required: true })}
                  name="phone"
                  error={errors.phone && errors.phone.type === "required"}
                  fullWidth
                  type="text"
                  className="form-control"
                  defaultValue={analysis?.phone}
                  onChange={(e) => setValue("phone", e.target.value)}
                />
                {errors.phone && errors.phone.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
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

export default EditAnalysis;
