/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DateFnsUtils from "@date-io/date-fns";
import dateformat from "dateformat";
import viLocale from "date-fns/locale/vi";
import Select from "react-select";

//--- Material Control
import {
  DialogActions,
  TextareaAutosize,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Typography,
  IconButton,
  makeStyles,
  Select as SelectMui,
  MenuItem,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType, APIUrlDefault } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as planningUnitAction from "../../../redux/store/planning-unit/planning-unit.store";
import * as userManagementAction from "../../../redux/store/user-management/user-management.store";

import FileManagement from "../../../components/file_management/file_management";

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

export default function AddUserMamagement(props) {
  const classes = useStyles();
  const {
    isOpen,
    onClose,
    onSuccess,
    GetListUserManagement,
    rowsPerPage,
    setOrder,
    setOrderBy,
    showLoading,
  } = props;
  const [avatar, setAvatar] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [roleLockup, setRoleLockup] = useState();
  const [sex, setSex] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);
  const [listReflectionProcessingUnit, setListReflectionProcessingUnit] = useState([]);
  const [reflectionProcessingUnitSelected, setReflectionProcessingUnitSelected] = useState(null);
  const [listPlanningUnit, setListPlanningUnit] = useState([]);
  const [planningUnitSelected, setPlanningUnitSelected] = useState(null);
  const [selected, setSelected] = useState(null);


  useEffect(() => {
    showLoading(true);
    userManagementAction
      .GetRoleLookupUserManagement()
      .then((res) => {
        if (res && res.content) {
          setRoleLockup(res.content.map((item) => {
            return { ...item, label: item.name, value: item.id };
        }));
          //setRoleId(res.content[0].id);
          showLoading(false);
        }
      })
      .catch((err) => {
        showLoading(false);
      });
    userManagementAction.GetLookUpReflectionProcessingUnit().then((res) => {
      console.log('GetLookUpReflectionProcessingUnit',res)
      setListReflectionProcessingUnit(res?res:[])
      setReflectionProcessingUnitSelected(res?res[0].id:null)
    });
    planningUnitAction.GetLookupPlanningUnit().then((res) => {
      console.log('GetLookupPlanningUnit',res)
      setListPlanningUnit(res?res.content:[])
      setPlanningUnitSelected(res?res.content[0].id:null)
    });
  }, []);

  const { register, handleSubmit, errors, setValue, clearErrors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    showLoading(true);
    let formData = new FormData();
    formData.append("FullName", data.fullName);
    formData.append("Email", data.email);
    //formData.append("RoleId", roleId);
    //formData.append("Roles", JSON.stringify(selected));
    selected.map((item) => {
      
      formData.append("Roles", item.label);  
    })
    formData.append("DateOfBirth", selectedDate);
    formData.append("Sex", sex);
    formData.append("Address", data.address);
    files &&
      files.length > 0 &&
      files.map(
        (file) =>
          file &&
          file.fileId &&
          formData.append("DocumentUploadId", file.fileId)
      );
    formData.append("Description", data.content);
    formData.append("PhoneNumber", data.phoneNumber);
    formData.append("ReflectionUnitId", reflectionProcessingUnitSelected);
    formData.append("planningUnitId", planningUnitSelected);
    userManagementAction
      .CreateWithMultiRoles(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListUserManagement(1, rowsPerPage);
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.UserAddSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        );
        onSuccess();
      });
  };

  const onOpenSelectFile = () => {
    setShow(true);
    setFilesTemp(files);
  };

  const onCloseSelectFile = () => {
    setShow(false);
    setFiles(filesTemp);
  };

  const onSaveSelectFile = () => {
    setShow(false);
  };

  function handleChangeSelectSex(event) {
    setSex(event.target.value);
  }

  function handleChangeSelectRole(event) {
    setRoleId(event.target.value);
  }

  function handleChangeSelectreflectionProcessingUnit(event) {
    setReflectionProcessingUnitSelected(event.target.value);
  }
  function handleChangeSelectPlanningUnit(event) {
    setPlanningUnitSelected(event.target.value);
  }
  const handleDateChange = (date) => {
    setSelectedDate(dateformat(date, "yyyy-mm-dd"));
    setValue("tfDate", dateformat(date, "yyyy-mm-dd"));
    clearErrors("tfDate");
  };

  const handleOnChangeRole = (data) => {
    //console.log(data);
    const listData = [];
    if (data) {
      
      data.map((item) => {
        listData.push({label : item.label})
      })
      setSelected(listData)
      setRoleId(listData[0])     
    } else {
      setSelected([]);
    }
    console.log(listData)
};
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm Người dùng</Typography>
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
                  <label className="text-dark">Họ và tên</label>
                  <TextField
                    type="text"
                    name="fullName"
                    className="w-100"
                    inputRef={register}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Email<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="email"
                    className="w-100"
                    inputRef={register({
                      required: true,
                      pattern: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
                    })}
                    error={
                      errors.email &&
                      errors.email.type === "required" &&
                      errors.email.type === "pattern"
                    }
                  />
                  {errors.email && errors.email.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <span className="error">Email không đúng định dạng</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Chức vụ</label>
                  <br />
                  <Select
                     className="basic-single mb-1"
                     classNamePrefix="select"
                     closeMenuOnSelect={false}
                     placeholder="Chọn chức vụ"
                     name="role"
                     //value={selected}
                     isMulti
                     onChange={handleOnChangeRole}
                     options={roleLockup}
                     noOptionsMessage={() => "không tồn tại"}
                  />
                  {/* <Select
                    className="w-100"
                    value={roleId}
                    onChange={handleChangeSelectRole}
                  >
                    {roleLockup && roleLockup.length > 0 ? (
                      roleLockup.map((item) => (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options</MenuItem>
                    )}                                                                                                 
                  </Select> */}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Ngày sinh</label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={viLocale}
                  >
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      onChange={(date) => date && handleDateChange(date)}
                      format="dd/MM/yyyy"
                      value={selectedDate}
                      fullWidth
                      showTodayButton={true}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Giới tính</label>
                  <br />
                  <SelectMui
                    className="w-100"
                    value={sex}
                    onChange={handleChangeSelectSex}
                  >
                    <MenuItem value={true}>{"Nam"}</MenuItem>
                    <MenuItem value={false}>{"Nữ"}</MenuItem>
                  </SelectMui>
                </div>

                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Số điện thoại</label>
                  <TextField
                    type="text"
                    name="phoneNumber"
                    className="w-100"
                    inputRef={register({
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    })}
                    //inputRef={register}
                    onChange={(e) =>
                      setValue(
                        "phoneNumber",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                  />
                     {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                    <span className="error">Số điện thoại không đúng định dạng</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
              <div className="col-12 col-md-6 col-lg-6 mb-3">
              <label className="text-dark">Đơn vị phản ánh</label>
              <br />
              <SelectMui
                className="w-100"
                value={reflectionProcessingUnitSelected}
                onChange={handleChangeSelectreflectionProcessingUnit}
              >
                {listReflectionProcessingUnit && listReflectionProcessingUnit.length > 0 ? (
                  listReflectionProcessingUnit.map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No options</MenuItem>
                )}
              </SelectMui>
            </div>


                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Địa chỉ</label>
                  <TextField
                    inputRef={register}
                    type="text"
                    name="address"
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Đơn vị lập quy hoạch</label>
                  <br />
                  <SelectMui
                    className="w-100"
                    value={planningUnitSelected}
                    onChange={handleChangeSelectPlanningUnit}
                  >
                    {listPlanningUnit && listPlanningUnit.length > 0 ? (
                      listPlanningUnit.map((item) => (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options</MenuItem>
                    )}
                  </SelectMui>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="text-dark">Mô tả</label>
              <TextareaAutosize
                name="content"
                rowsMin={3}
                className={"form-control"}
                ref={register}
              />
            </div>
            <div className="form-group">
              <label className="text-dark">
                Ảnh<span className="required"></span>
              </label>
              {!isShow &&
                files &&
                files.length > 0 &&
                files.map((item) => (
                  <div key={item.fileName} style={{ width: "150px" }}>
                    <img
                      src={APIUrlDefault + item.filePreview}
                      alt={item.fileName}
                      title={item.fileName}
                      className="img-fluid mb-2"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                ))}
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onOpenSelectFile}
                >
                  Chọn file
                </Button>
                <TextField
                  inputRef={register({ required: true })}
                  type="hidden"
                  name="image"
                  value={
                    (files && files.length > 0 && files[0].fileName) || ""
                  }
                />
                {errors.image && errors.image.type === "required" && (
                  <p className="error">Trường này là bắt buộc</p>
                )}
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

      {isShow && (
        <Dialog
          onClose={onCloseSelectFile}
          open={isShow}
          fullWidth={true}
          maxWidth="md"
          className="dialog-preview-form"
        >
          <DialogTitle disableTypography>
            <Typography variant="h6">Quản lý file</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onCloseSelectFile}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              files={files}
              setFiles={setFiles}
              acceptedFiles={["jpeg", "png", "jpg", "gif"]}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Hủy
            </Button>
            {files && files.length > 0 && (
              <Button
                type="button"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSaveSelectFile}
              >
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
