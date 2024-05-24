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
import * as planningAction from "../../../../redux/store/planning/planning.store";
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
  formControl: {
    margin: theme.spacing(1),
  },
}));
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
const AddAnalysis = ({
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  setOrder,
  setOrderBy,
  setAnalysisId,
  setOpenEditDialog,
  openCreatMapModal,
  groupParentList
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [planningId, setPlanningId] = useState();
  const [parentId, setParentId] = useState();
  
  const [planningLookUpModel, setPlanningLookUpModel] = useState(null);
  useEffect(() => {
    onGetData();
  }, []);
  const onGetData = () => {
    //showLoading(true);
    Promise.all([
      onGetLookUpPlanning()
    ])
      .then((res) => {
        const [
          planningLookUp
        ] = res;
        planningLookUp &&
          planningLookUp.content &&
          setPlanningLookUpModel(planningLookUp.content);
      })
      .catch((err) => {
        //showLoading(false);
      });
  };
  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    data.name && formData.append("name", data.name);
    planningId && formData.append("planningId", planningId?.id);
    parentId && formData.append("parentId", parentId?.id);

    analysisAction
      .CreateAnalysis(formData)
      .then((result) => {
        console.log(result)
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListAll(1, rowsPerPage);
          setAnalysisId(result.content.id)
          openCreatMapModal(
            result.content.id,
            result.content.mapId,
            result.content.planningId,
            result.content.planningName,
            false,
          )
          onSuccess();
          ShowNotification(
            viVN.Success.CreateSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch(
        (err) => viVN.Errors[err.errorType],
        NotificationMessageType.Error
      );
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm chuyên mục</Typography>
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
                Quy hoạch phân tích<span className="required"></span>
              </label>
              <Autocomplete
                    options={planningLookUpModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={planningId}
                    onChange={(event, newValue) => {
                      setPlanningId(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="planningId"
                        inputRef={register({ required: true })}
                        error={
                          errors.planningId 
                        }
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                  {errors.planningId  && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
            </div>
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
                onChange={(e) => setValue("name", e.target.value)}
              />
              {errors.name && errors.name.type === "required" && (
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

export default AddAnalysis;
