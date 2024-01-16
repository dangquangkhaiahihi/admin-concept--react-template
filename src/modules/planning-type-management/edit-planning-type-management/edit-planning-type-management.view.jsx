/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

//--- Action
import * as planningTypeAction from "../../../redux/store/planning-type/planning-type.store";

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
  Select,
  MenuItem,
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

export default function EditPlanningTypeManagement(props) {
  const classes = useStyles();

  const {
    isOpen,
    onClose,
    onSuccess,
    planningTypeId,
    setOrder,
    setOrderBy,
    GetListPlanningType,
    rowsPerPage,
    showLoading,
    orderBy,
    order,
    searchCriteria,
    groupParentList,
    isSyncSetting
  } = props;

  const [planningType, setPlanningType] = useState();
  const [parentId, setParentId] = useState();

  useEffect(() => {
    showLoading(true);
      planningTypeAction
      .GetDetailPlanningType(planningTypeId)
      .then((res) => {
        if (res && res.content) {
          setPlanningType(res.content);
          setParentId(res.content.parentId);
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  }, []);

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    console.log("data.csdlqG_Id",data.csdlqG_Id);
    planningTypeAction
      .UpdatePlanningType({ Name: data.name || planningType.name, ParentId: parentId, Id: planningTypeId, OrderBy: data.orderBy ? parseInt(data.orderBy, 10) : planningType.orderBy, Address: null, 
        csdlqG_Id: data.csdlqG_Id === undefined ? planningType.csdlqG_Id : data.csdlqG_Id})
      .then((result) => {
        if (result) {
          GetListPlanningType(searchCriteria.page + 1, rowsPerPage, orderBy + " " + order, searchCriteria.keyword, searchCriteria.parentId);
          onSuccess();
          ShowNotification(
            viVN.Success.EditlanningType,
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

  const handleChangeSelect = (event) => {
    setParentId(event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa chuyên mục</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {planningType && (
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
                      defaultValue={planningType.name}
                      error={errors.name && errors.name.type === "required"}
                      disabled={isSyncSetting}
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
                      defaultValue={planningType.orderBy}
                      inputRef={register({
                        pattern: /^\d+(\.\d{1,9})?$/,
                        maxLength: 2
                      })}
                      error={
                        errors.orderBy &&
                        ( errors.orderBy.type === "pattern" || errors.orderBy.type === "maxLength" )
                      }
                      disabled={isSyncSetting}
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
                    <label className="text-dark">
                      Danh mục<span className="required"></span>
                    </label>
                    <br />
                    <Select
                      className="w-100"
                      defaultValue={planningType.parentId}
                      onChange={(e) => {
                        handleChangeSelect(e);
                      }}
                      disabled={isSyncSetting}
                    >
                      {
                        groupParentList.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                    {errors.parentId && errors.parentId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  {
                    isSyncSetting && 
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                      <label className="text-dark">
                        ID tương ứng của CSDL Quốc Gia
                      </label>
                      <TextField
                        type="text"
                        name="csdlqG_Id"
                        className="w-100"
                        defaultValue={planningType.csdlqG_Id}
                        inputRef={register({
                          pattern: /^\d+(\.\d{1,9})?$/,
                        })}
                        error={
                          errors.csdlqG_Id &&
                          ( errors.csdlqG_Id.type === "pattern")
                        }
                      />
                        {errors.csdlqG_Id &&
                          errors.csdlqG_Id.type === "pattern" && (
                            <span className="error">
                              Trường này chỉ điền số
                            </span>
                        )}
                    </div>
                  }
                  
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
