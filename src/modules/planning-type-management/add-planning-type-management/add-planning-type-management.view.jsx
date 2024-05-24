import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

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
  FormControl,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as planningTypeAction from "../../../redux/store/planning-type/planning-type.store";
import "./add-planning-type-management.scss";

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

export default function AddPlanningTypeManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    GetListPlanningType,
    rowsPerPage,
    showLoading,
    groupParentList
  } = props;

  const { register, handleSubmit, errors, setValue, control } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    console.log(data)
    if (!data) {
      return;
    }
    data.orderBy = parseInt(data.orderBy, 10)
    showLoading(true);
    planningTypeAction
      .CreatePlanningType(data)
      .then((result) => {
        if (result && result.content && result.content.status === true) {
          GetListPlanningType(1, rowsPerPage);
          
          onSuccess();
          ShowNotification(
            viVN.Success.AddPlanningType,
            NotificationMessageType.Success
          );
        }
        showLoading(false);
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

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm chuyên mục</Typography>
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
                      Tên chuyên mục<span className="required"></span>
                    </label>
                    <TextField
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
                      Thứ tự
                    </label>
                    <TextField
                      type="text"
                      name="orderBy"
                      className="w-100"
                      inputRef={register({
                        pattern: /^\d+(\.\d{1,9})?$/,
                        maxLength: 2
                      })}
                      error={
                        errors.orderBy &&
                        ( errors.orderBy.type === "pattern" || errors.orderBy.type === "maxLength" )
                      }
                    />
                      {errors.orderBy &&
                        errors.orderBy.type === "pattern" && (
                          <span className="error">
                            Trường này chỉ điền số
                          </span>
                      )}
                      {errors.orderBy &&
                        errors.orderBy.type === "maxLength" && (
                          <span className="error">
                            Chỉ nhập tối đa 2 ký tự
                          </span>
                      )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <FormControl
                      fullWidth
                      error={
                        errors.provinceId && errors.provinceId.type === "required"
                      }
                    >
                      <label className="text-dark">
                        Danh mục<span className="required"></span>
                      </label>
                      <Controller
                        name="parentId"
                        rules={{ required: true }}
                        control={control}
                        as={
                          <Select>
                            {
                              groupParentList.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))
                            }
                          </Select>
                        }
                      />
                    </FormControl>
                    {errors.parentId &&
                      errors.parentId.type === "required" && (
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
