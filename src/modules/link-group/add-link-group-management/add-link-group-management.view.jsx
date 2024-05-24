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
  Select,
  MenuItem,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

//--- Action
import * as linkGroupAction from "../../../redux/store/link-group/link-group.store";

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

export default function AddLinkGroupManagement(props) {
  const classes = useStyles();
  const {
    isOpen,
    onClose,
    onSuccess,
    GetListLinkGroup,
    rowsPerPage,
    showLoading,
  } = props;
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    showLoading(true);
    linkGroupAction
      .CreateLinkGroup({ ...data, active: isActive })
      .then((result) => {
        if (result && result.content && result.content.status === true) {
          GetListLinkGroup(1, rowsPerPage);
          showLoading(false);
          onSuccess();
          ShowNotification(
            viVN.Success.AddLinkGroup,
            NotificationMessageType.Success
          );
        }
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
          <Typography variant="h6">Thêm danh sách nhóm</Typography>
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
                    Tên nhóm<span className="required"></span>
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
                    Sắp xếp<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    name="order"
                    className="w-100"
                    inputRef={register({
                      required: true,
                    })}
                    onChange={(e) =>
                      setValue("order", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    error={errors.order && errors.order.type === "required"}
                  />
                  {errors.order && errors.order.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">
                    Trạng thái<span className="required"></span>
                  </label>
                  <Select
                    fullWidth
                    defaultValue={isActive}
                    onChange={(event) => {
                      setIsActive(event.target.value);
                    }}
                  >
                    <MenuItem value={true}>{"Hoạt động"}</MenuItem>)
                    <MenuItem value={false}>{"Không hoạt động"}</MenuItem>)
                  </Select>
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
