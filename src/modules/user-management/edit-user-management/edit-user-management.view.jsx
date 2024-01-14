/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import dateformat from "dateformat";
import Select from "react-select";

//--- Action
import * as userManagementAction from "../../../redux/store/user-management/user-management.store";

//--- Material Control
import {
  DialogActions,
  TextareaAutosize,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  makeStyles,
  Typography,
  IconButton,
  Select as SelectMui,
  MenuItem,
} from "@material-ui/core";

import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- Notifications
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType, APIUrlDefault } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import * as planningUnitAction from "../../../redux/store/planning-unit/planning-unit.store";
import FileManagement from "../../../components/file_management/file_management";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function EditUserManagement(props) {
  const classes = useStyles();

  const {
    roleSelected,
    listRoles,
    isOpen,
    onClose,
    onSuccess,
    userId,
    setOrder,
    setOrderBy,
    GetListUserManagement,
    rowsPerPage,
    showLoading,
  } = props;

  const [userModel, setUserModel] = useState();
  const [avatar, setAvatar] = useState();
  const [sex, setSex] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [roleLockup, setRoleLockup] = useState();
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const [isShow, setShow] = useState(false);
  const [listReflectionProcessingUnit, setListReflectionProcessingUnit] = useState([]);
  const [reflectionProcessingUnitSelected, setReflectionProcessingUnitSelected] = useState(null);
  const [listPlanningUnit, setListPlanningUnit] = useState([]);
  const [planningUnitSelected, setPlanningUnitSelected] = useState(null);
  const [selected, setSelected] = useState(roleSelected);

  //const options = listRoles.map((item) => {return {value: item.id,label: item.name}});

  useEffect(() => {
    onGetAllData();
    userManagementAction.GetDetailUserManagement(userId).then((res)=> {
      setSelected(res.content.roleIds)
    })
  }, []);

  const onGetAllData = () => {
    showLoading(true);
    Promise.all([
      GetDetailUserManagement(userId),
      GetRoleLookupUserManagement(),
      GetLookUpReflectionProcessingUnit(),
      GetLookupPlanningUnit(),
    ])
      .then((res) => {
        const [userModel, roleLockup, ReflectionProcessingUnit,planningUnitLockup] = res;
        setUserModel(userModel && userModel.content ? userModel.content : []);
        if (userModel && userModel.content) {
          setSelectedDate(userModel.content.dateOfBirth);
          setAvatar(userModel.content.avatar);
          setRoleId(userModel.content.roleId);
          setSex(userModel.content.sex);
          setFiles(userModel.content.files ? [userModel.content.files] : [])
          setReflectionProcessingUnitSelected(userModel.content.reflectionUnitId)
          setPlanningUnitSelected(userModel.content.planningUnitId)
        }
        setRoleLockup(roleLockup.content.map((item) => {
          return { ...item, label: item.name, value: item.id };
        }));
        setListReflectionProcessingUnit(ReflectionProcessingUnit ? ReflectionProcessingUnit : [])
        setListPlanningUnit(planningUnitLockup ? planningUnitLockup : [])
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const GetDetailUserManagement = (userId) => {
    return new Promise((resolve, reject) => {
      userManagementAction.GetDetailUserManagement(userId).then(
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

  const GetLookUpReflectionProcessingUnit = () => {
    return new Promise((resolve, reject) => {
      userManagementAction.GetLookUpReflectionProcessingUnit().then(
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
  const GetLookupPlanningUnit = () => {
    return new Promise((resolve, reject) => {
      planningUnitAction.GetLookupPlanningUnit().then(
        (res) => {
          resolve(res.content);
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
  const GetRoleLookupUserManagement = () => {
    return new Promise((resolve, reject) => {
      userManagementAction.GetRoleLookupUserManagement().then(
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

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    formData.append("Id", userId);
    formData.append("FullName", data.fullName);
    formData.append("Email", data.email);
    //formData.append("RoleId", roleId);
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
    formData.append("reflectionUnitId", reflectionProcessingUnitSelected);
    formData.append("planningUnitId", planningUnitSelected);
    userManagementAction
      .UpdateWithMultiRoles(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListUserManagement(1, rowsPerPage);
          onSuccess();
          ShowNotification(
            viVN.Success.UserEditSuccess,
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
      });
  };

  function handleChangeSelectSex(event) {
    setSex(event.target.value);
    console.log(selected)
  }

  function handleChangeSelect(event) {
    setRoleId(event.target.value);
  }

  function handleChangeSelectReflectionProcessingUnit(event) {
    setReflectionProcessingUnitSelected(event.target.value);
  }
  function handleChangeSelectPlanningUnit(event) {
    setPlanningUnitSelected(event.target.value);
  }
  const handleDateChange = (date) => {
    setSelectedDate(dateformat(date, "yyyy-mm-dd"));
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

  const handleRoleIds = (ids, roleLockup) => {
    let data = []
    if(ids) {
      roleLockup && roleLockup.map((item) => {
        ids.map((id) => {
          if(item.id == id) {
            data.push(item)
          }
        })
      })
    }
    return data.map((item) => {
      return { label: item.name, value: item.id };
    })
  }
  const handleOnChangeRole = (data) => {
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
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa Người dùng</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {userModel && (
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">
                      Họ và tên<span className="required"></span>
                    </label>
                    <TextField
                      type="text"
                      name="fullName"
                      className="w-100"
                      inputRef={register({ required: true, maxLength: 50 })}
                      defaultValue={userModel.fullName}
                      error={
                        errors.fullName && errors.fullName.type === "required"
                      }
                    />
                    {errors.fullName && errors.fullName.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Email</label>
                    <TextField
                      type="text"
                      name="email"
                      className="w-100"
                      defaultValue={userModel.email}
                      inputRef={register}
                      disabled
                    />
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
                      placeholder="Chọn chức vụ"
                      name="role"
                      closeMenuOnSelect={false}
                      defaultValue={roleSelected}
                      isMulti
                      onChange={handleOnChangeRole}
                      options={roleLockup}
                      noOptionsMessage={() => "không tồn tại"}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Ngày sinh</label>
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      locale={viLocale}
                    >
                      <DatePicker
                        id="dateTime"
                        name="startDate"
                        onChange={(date) => date && handleDateChange(date)}
                        format="dd/MM/yyyy"
                        value={selectedDate}
                        fullWidth
                        showTodayButton={true}
                        error={
                          errors.startDate &&
                          errors.startDate.type === "required"
                        }
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
                      <MenuItem value={true}>Nam</MenuItem>
                      <MenuItem value={false}>Nữ</MenuItem>
                    </SelectMui>
                  </div>

                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Số điện thoại</label>
                    <TextField
                      type="text"
                      name="phoneNumber"
                      defaultValue={userModel.phoneNumber}
                      className="w-100"
                      inputRef={register({
                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      })}
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
                      onChange={handleChangeSelectReflectionProcessingUnit}
                    >
                      {listReflectionProcessingUnit &&
                        listReflectionProcessingUnit.length > 0 &&
                        listReflectionProcessingUnit.map((items) => (
                          <MenuItem value={items.id}>{items.name}</MenuItem>
                        ))}
                    </SelectMui>
                  </div>

                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <label className="text-dark">Địa chỉ</label>
                    <TextField
                      inputRef={register}
                      defaultValue={userModel.address}
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
                  defaultValue={userModel.description}
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
