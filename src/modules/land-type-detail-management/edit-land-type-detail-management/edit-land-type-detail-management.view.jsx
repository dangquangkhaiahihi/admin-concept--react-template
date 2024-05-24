/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";

//--- Action
// import * as homePageAction from "../../../redux/store/home-page/home-page.store";
import * as landTypeDetailAction from "../../../redux/store/land-type-detail/land-type-detail.store";
import * as landTypeAction from "../../../redux/store/land-type/land-type.store";

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

export default function EditLandTypeDetailManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    landTypeDetailId,
    GetListLandTypeDetail,
    rowsPerPage,
    showLoading,
  } = props;

  const [landTypeDetailModel, setLandTypeDetailModel] = useState();
  const [landTypeLookUp, setPlanningTypeLockUp] = useState();
  const [landTypeId, setLandTypeId] = useState();

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    GetLandTypeDetailId(landTypeDetailId);
    GetLookUpLandType();
  }, []);

  const GetLandTypeDetailId = (landTypeDetailId) => {
    showLoading(true);
    landTypeDetailAction
      .GetLandTypeDetailById(landTypeDetailId)
      .then((res) => {
        if (res && res.content) {
          setLandTypeDetailModel(res.content);
          setLandTypeId(res.content.landTypeId);
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const GetLookUpLandType = () => {
    showLoading(true);
    landTypeAction
      .LookupLandType()
      .then((res) => {
        setPlanningTypeLockUp(res && res.content ? res.content : []);
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

    landTypeDetailAction
      .UpdateLandTypeDetail({
        ...data,
        id: landTypeDetailId,
        landTypeId: landTypeId,
      })
      .then((result) => {
        if (result) {
          GetListLandTypeDetail(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.EditLandType,
            NotificationMessageType.Success
          );
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

  const handleOnchange = (event, newValue, index) => {
    if (newValue) {
      setLandTypeId(newValue.id);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa loại đất</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {landTypeDetailModel && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    {landTypeLookUp && landTypeLookUp.length > 0 && (
                      <Autocomplete
                        id="landType"
                        options={landTypeLookUp}
                        getOptionLabel={(option) => option.name}
                        fullWidth
                        onChange={(event, newValue) =>
                          handleOnchange(event, newValue)
                        }
                        value={{
                          id: landTypeDetailModel.landTypeId,
                          name: landTypeDetailModel.landTypeName,
                        }}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chọn loại đất (*)"
                            name={`landTypeId`}
                            inputRef={register({ required: true })}
                            size="small"
                            variant="outlined"
                            error={
                              errors[`landTypeId`] &&
                              errors[`landTypeId`].type === "required"
                            }
                          />
                        )}
                      />
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <TextField
                      size="small"
                      name="code"
                      defaultValue={landTypeDetailModel.code}
                      label="Mã chi tiết (*)"
                      variant="outlined"
                      fullWidth
                      inputRef={register({ required: true })}
                      error={errors.code && errors.code.type === "required"}
                    />
                    {errors.code && errors.code.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <TextField
                      size="small"
                      name="name"
                      defaultValue={landTypeDetailModel.name}
                      label="Tên chi tiết (*)"
                      variant="outlined"
                      fullWidth
                      inputRef={register({ required: true })}
                      error={errors.name && errors.name.type === "required"}
                    />
                    {errors.name && errors.name.type === "required" && (
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
