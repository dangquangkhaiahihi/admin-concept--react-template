import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

//--- Action
import * as linkGroupAction from "../../../redux/store/link-group/link-group.store";

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
  Select, MenuItem
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
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function EditLinkGroupManagement(props) {
  const classes = useStyles();

  const { isOpen, onClose, onSuccess, groupId, setOrder, setOrderBy, GetListLinkGroup, rowsPerPage, showLoading } = props;

  const [groupModel, setGroupModel] = useState();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    showLoading(true);
    linkGroupAction.GetDetailLinkGroup(groupId).then(res => {
      if (res && res.content) {
        setGroupModel(res.content);
        setIsActive(res.content.active);
      }
      showLoading(false);
    }).catch(err => {
      showLoading(false);
    });
  }, [])

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }

    linkGroupAction.UpdateLinkGroup({ ...data, active: isActive, id: groupId }).then((result) => {
      if (result) {
        setOrder("desc");
        setOrderBy("modifiedDate")
        GetListLinkGroup(1, rowsPerPage);
        onSuccess();
        ShowNotification(
          viVN.Success.EditLinkGroup,
          NotificationMessageType.Success
        )
      }
    }).catch((err) => {
      onSuccess();
      ShowNotification(
        err.errorMessage,
        NotificationMessageType.Error
      )
    })
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Chỉnh sửa tỉnh</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {groupModel && <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Tên nhóm<span className="required"></span></label>
                  <TextField
                    type="text"
                    name="name"
                    className="w-100"
                    inputRef={register({ required: true })}
                    defaultValue={groupModel.name}
                    error={errors.name && errors.name.type === "required"}
                  />
                  {errors.fullName && errors.fullName.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-3">
                  <label className="text-dark">Mã bưu điện</label>
                  <TextField
                    type="text"
                    name="order"
                    className="w-100"
                    defaultValue={groupModel.order}
                    inputRef={register({ required: true })}
                    onChange={(e => setValue("order", e.target.value.replace(/[^0-9]/g, "")))}
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
                  <label className="text-dark">Trạng thái<span className="required"></span></label>
                  <Select fullWidth defaultValue={groupModel.active} onChange={(event) => { setIsActive(event.target.value) }}>
                    <MenuItem value={true}>{"Hoạt động"}</MenuItem >)
                  <MenuItem value={false}>{"Không hoạt động"}</MenuItem >)
                  </Select>
                </div>
              </div>
            </div>

          </DialogContent>}

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
