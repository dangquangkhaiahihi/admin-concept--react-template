import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

import * as config from "../../../common/config";
import * as roleManagementAction from "../../../redux/store/role/role-management.store";
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
  formControl: {
    margin: theme.spacing(1),
  },
}));

function EditRoleManagement(props) {
  const classes = useStyles();
  const {
    openAddDialog,
    onHideModal,
    roleId,
    getListRoleManagement,
    rowsPerPageCommon,
  } = props;

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [roleModel, setRoleMode] = useState();

  useEffect(() => {
    roleManagementAction
      .GetDetailRoleManagement(roleId)
      .then((res) => res && res.content && setRoleMode(res.content))
      .catch((err) => console.log(err));
  }, []);

  const onEditSubmit = (data) => {
    let body = {
      ...data,
      id: roleId,
      code: roleModel.code,
    };

    roleManagementAction.UpdateRoleManagement(body).then(
      (res) => {
        if (res && res.content) {
          getListRoleManagement(1, rowsPerPageCommon);
          onHideModal();
          ShowNotification(
            viVN.Success.RoleEditSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };

  return (
    <div>
      <Dialog
        open={openAddDialog}
        onClose={onHideModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" className="border-bottom">
          {"Sửa Role"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onHideModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {roleModel ? (
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">
                      Tên role<span className="required"></span>
                    </label>
                    <TextField
                      type="text"
                      name="name"
                      className="w-100"
                      inputRef={register({ required: true })}
                      defaultValue={roleModel.name}
                      error={errors.name && errors.name.type === "required"}
                    />
                    {errors.name && errors.name.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="text-dark">Code</label>
                    <TextField
                      inputRef={register}
                      type="text"
                      name="code"
                      className="w-100"
                      defaultValue={roleModel.code}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="border-top">
              <Button
                onClick={onHideModal}
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
                {config.EmailConfig.update}
              </Button>
            </DialogActions>
          </form>
        ) : (
          "Xảy ra lỗi trong hệ thống"
        )}
      </Dialog>
    </div>
  );
}
export default EditRoleManagement;
