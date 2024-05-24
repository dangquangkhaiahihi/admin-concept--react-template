/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

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
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as landTypeAction from "../../../redux/store/land-type/land-type.store";
import * as landTypeDetailAction from "../../../redux/store/land-type-detail/land-type-detail.store";

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

export default function AddLandTypeDetailManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    GetListLandTypeDetail,
    rowsPerPage,
    showLoading,
  } = props;

  const [projectList, setProjectList] = useState([
    { id: 1, code: "", name: "", isDuplicate: false },
  ]);

  const [landTypeLookUp, setPlanningTypeLockUp] = useState();
  const [landTypeId, setLandTypeId] = useState();
  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    GetLookUpLandType();
  }, []);

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
    if (projectList.length > 0) {
      let landTypeSave = [];
      projectList.map((item) =>
        landTypeSave.push({
          landTypeId: landTypeId,
          code: item.code,
          name: item.name,
        })
      );
      showLoading(true);
      landTypeSave &&
        landTypeSave.length > 0 &&
        landTypeDetailAction
          .CreateLandTypeDetail(landTypeSave)
          .then((result) => {
            if (result && result.content && result.content.status === true) {
              GetListLandTypeDetail(1, rowsPerPage);
              showLoading(false);
              onSuccess();
              ShowNotification(
                viVN.Success.AddLandType,
                NotificationMessageType.Success
              );
            }
          })
          .catch((err) => {
            showLoading(false);
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
          });
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    let list = projectList.splice(index, 1);
    if (list && list.length !== 1) return;
    setProjectList(projectList.filter((project) => project.id !== list[0].id));
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setProjectList(
      projectList.concat([
        {
          id:
            projectList && projectList.length > 0
              ? projectList[projectList.length - 1].id + 1
              : 1,
          code: "",
          name: "",
          isDuplicate: false,
        },
      ])
    );
  };

  const handleOnchange = (event, newValue) => {
    if (newValue) {
      setLandTypeId(newValue.id);
    }
  };

  const onChangeValue = (value = null, index = -1, property = null) => {
    if (index === -1 || !property) return;
    const list = [...projectList];
    list[index][property] = value;

    let _landTypes = list.map((landTypeItem) => {
      let _isDuplicate =
        landTypeItem.code &&
        list
          .filter((item) => item.id !== landTypeItem.id)
          .some((item) => item.code === landTypeItem.code);
      return {
        ...landTypeItem,
        isDuplicate: _isDuplicate,
      };
    });
    setProjectList(_landTypes);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <div>
            <div className="row">
              <div className="col-3">
                <Typography
                  variant="h6"
                  className="h-100 d-flex align-items-center justify-content-center"
                >
                  Thêm chi tiết loại đất
                </Typography>
              </div>
              <div className="col-5">
                {landTypeLookUp && landTypeLookUp.length > 0 && (
                  <Autocomplete
                    id="landType"
                    options={landTypeLookUp}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    onChange={(event, newValue) =>
                      handleOnchange(event, newValue)
                    }
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
              <div className="col-2"></div>
            </div>
          </div>
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
            <div style={{ height: "500px" }}>
              {projectList &&
                projectList.length > 0 &&
                projectList.map((item, index) => (
                  <div
                    key={`project_${item.id}`}
                    className="row"
                    style={{ marginBottom: 10 }}
                  >
                    <div className="col-5">
                      <TextField
                        size="small"
                        name={`code_${item.id}`}
                        onChange={(event) =>
                          onChangeValue(event.target.value, index, "code")
                        }
                        label="Mã chi tiết (*)"
                        variant="outlined"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={
                          (item.isDuplicate ? true : false) ||
                          (errors[`code_${item.id}`] &&
                            errors[`code_${item.id}`].type === "required")
                        }
                      />
                      {errors[`code_${item.id}`] &&
                        errors[`code_${item.id}`].type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                      {item.isDuplicate && (
                        <span className="error">
                          Mã đất chi tiết đang bị trùng
                        </span>
                      )}
                    </div>
                    <div className="col-5">
                      <TextField
                        size="small"
                        name={`name_${item.id}`}
                        onChange={(event) =>
                          onChangeValue(event.target.value, index, "name")
                        }
                        // value={item.name}
                        label="Tên chi tiết (*)"
                        variant="outlined"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={
                          errors[`name_${item.id}`] &&
                          errors[`name_${item.id}`].type === "required"
                        }
                      />
                      {errors[`name_${item.id}`] &&
                        errors[`name_${item.id}`].type === "required" && (
                          <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                    <div className="col-2">
                      {projectList.length !== 1 && (
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            handleRemoveClick(index);
                          }}
                        >
                          <IndeterminateCheckBoxIcon />
                        </IconButton>
                      )}
                      <IconButton color="primary" onClick={handleAddClick}>
                        <AddBoxIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
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
