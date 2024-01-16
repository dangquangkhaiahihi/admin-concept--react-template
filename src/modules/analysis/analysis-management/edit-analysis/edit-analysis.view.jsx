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
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";

import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";

import * as analysisAction from "../../../../redux/store/analysis/analysis.store";
import "suneditor/dist/css/suneditor.min.css";
import * as viVN from "../../../../language/vi-VN.json";
import * as planningAction from "../../../../redux/store/planning/planning.store";

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
  groupParentList
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [planningLookUpModel, setPlanningLookUpModel] = useState(null);

  const [analysis, setAnalysis] = useState();
  const [planningId, setPlanningId] = useState();
  const [parentId, setParentId] = useState();
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    onGetData();
  }, []);
  
  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    let formData = new FormData();
    formData.append("id", analysisId);
    data.name && formData.append("name", data.name);
    planningId &&
      formData.append("planningId", planningId?.id);
    data.phone && formData.append("phone", data.phone);
    data.address && formData.append("address", data.address);
    data.address && formData.append("address", data.address);
    parentId && formData.append("parentId", parentId?.id);
    formData.append("isCheck", isCheck);

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

  const onGetData = () => {
    //showLoading(true);
    Promise.all([
      onGetLookUpPlanning(),
      onGetDetail()
    ])
      .then((res) => {
        const [ planningLookUp ] = res;
        planningLookUp && planningLookUp.content &&
          setPlanningLookUpModel(planningLookUp.content);
      })
      .catch((err) => {
        //showLoading(false);
      });
  };

  const onGetLookUpPlanning = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanning().then(
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

  const onGetDetail = () => {
    analysisAction
      .GetDetail(analysisId)
      .then(
        (res) => {
        if (res && res.content) {
          setAnalysis(res.content);
          setIsCheck(res.content.isCheck)
        }
      })
      .catch((err) => console.log(err)
      );
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
                  Nội dung phân tích<span className="required"></span>
                </label>
                <TextField
                  inputRef={register({ required: true })}
                  name="name"
                  error={errors.name && errors.name.type === "required"}
                  fullWidth
                  type="text"
                  className="form-control"
                  value={analysis?.name}
                  onChange={(e) => setValue("name", e.target.value)}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="form-group">
                <label className="text-dark">
                  Quy hoạch phân tích<span className="required"></span>
                </label>
                <Autocomplete
                  options={planningLookUpModel}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  value={planningLookUpModel?.find(
                    (item) => item.id === analysis?.planningId
                  )}
                  onChange={(event, newValue) => {
                    setPlanningId(newValue);
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
                  Nhóm chuyên mục<span className="required"></span>
                </label>
                <Autocomplete
                  options={groupParentList}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  value={groupParentList?.find(
                    (item) => item.id === analysis?.parentId
                  )}
                  onChange={(event, newValue) => {
                    setParentId(newValue);
                  }}
                  disableClearable={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="parentId"
                      inputRef={register({ required: true })}
                      error={
                        errors.parentId &&
                        errors.parentId.type === "required"
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                {errors.parentId &&
                  errors.parentId.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="form-group">
                <FormControlLabel
                  control={<Checkbox/>}
                  label="Kiểm tra"
                  checked={isCheck}
                  onChange={(e) =>
                    {
                      setIsCheck(e.target.checked);
                    }
                  }
                  name="isCheck"
                />
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
