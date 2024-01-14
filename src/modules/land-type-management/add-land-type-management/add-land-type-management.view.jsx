import React, { useState } from "react";
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
  Checkbox,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as landTypeAction from "../../../redux/store/land-type/land-type.store"

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

export default function AddLandTypeManagement(props) {
  const classes = useStyles();
  const {
    isOpen,
    onClose,
    onSuccess,
    GetListLandType,
    rowsPerPage,
    showLoading
  } = props;
  const [isGeneralPlanning, setIsGeneralPlanning] = useState(false);
  const [isSubdivisionPlanning, setIsSubdivisionPlanning] = useState(false);
  const [isDetailedPlanning, setIsDetailedPlanning] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    const landTypeModel = { ...data, isQhc: isGeneralPlanning, isQhpk: isSubdivisionPlanning, isQhct: isDetailedPlanning }
    showLoading(true);

    landTypeAction.CreateLandType(landTypeModel).then((result) => {
      if (result && result.content && result.content.status === true) {
        GetListLandType(1, rowsPerPage);
        showLoading(false)
        onSuccess();
        ShowNotification(
          viVN.Success.AddLandType,
          NotificationMessageType.Success
        )
      }
    }).catch((err) => {
      showLoading(false)
      onSuccess();
      ShowNotification(
        viVN.Errors[err.errorType],
        NotificationMessageType.Error
      )
    })
  };

  const handleGeneralPlanning = (event) => {
    setIsGeneralPlanning(event.target.checked);
  }

  const handleSubdivisionPlanning = (event) => {
    setIsSubdivisionPlanning(event.target.checked);
  }

  const handleDetailedPlanning = (event) => {
    setIsDetailedPlanning(event.target.checked);
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm loại đất</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Tên loại đất<span className="required"></span></label>
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
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Mã loại đất<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="code"
                    className="w-100"
                    inputRef={register({
                      required: true,
                      // pattern: /^([0-9]{6})$/g
                    })}
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
                <div className="col-12 col-md-4 col-lg-4">
                  <label className="text-dark">Quy hoạch chung</label>
                  <Checkbox
                    checked={isGeneralPlanning}
                    onChange={handleGeneralPlanning}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    className="p-0 mt-0 ml-4"
                  />
                </div>
                <div className="col-12 col-md-4 col-lg-4">
                  <label className="text-dark">Quy hoạch phân khu</label>
                  <Checkbox
                    checked={isSubdivisionPlanning}
                    onChange={handleSubdivisionPlanning}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    className="p-0 mt-0 ml-4"
                  />
                </div>

                <div className="col-12 col-md-4 col-lg-4">
                  <label className="text-dark">Quy hoạch chi tiết</label>
                  <Checkbox
                    checked={isDetailedPlanning}
                    onChange={handleDetailedPlanning}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    className="p-0 mt-0 ml-4"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Đường dẫn ảnh<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="image"
                    className="w-100"
                    inputRef={register({ required: true })}
                    error={errors.image && errors.image.type === "required"}
                  />
                  {errors.image && errors.image.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}

                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Màu cad<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="colorCad"
                    className="w-100"
                    inputRef={register({ required: true, pattern:/[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]/ })}
                    error={errors.colorCad && (errors.colorCad.type === "required" || errors.colorCad.type === "pattern")}
                  />
                  {errors.colorCad && errors.colorCad.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.colorCad && errors.colorCad.type === "pattern" && (
                    <span className="error">Mã màu là số từ 1-255</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Màu hexa<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="colorHex"
                    className="w-100"
                    inputRef={register({ required: true, pattern: /^#(?:[0-9a-fA-F]{6}){1,2}$/i })}
                    error={errors.colorHex && (errors.colorHex.type === "required" || errors.colorHex.type === "pattern")}
                  />
                  {errors.colorHex && errors.colorHex.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.colorHex && errors.colorHex.type === "pattern" && (
                    <span className="error">Mã màu phải có dấu # và 6 ký tự (ví dụ: #fff000)</span>
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
