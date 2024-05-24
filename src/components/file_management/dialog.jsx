import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

import { ACTION_TYPES } from "./utils";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function DialogComponent(props) {
  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

    const [districtId, setDistrictId] = useState();
    const isShowUi = props.isShowUi;
  const onSubmitCreateFolder = (data) => {
    if (!data) return;
      
    props.handleSuccess && props.handleSuccess(data.folderName || "");
  };

  const onSubmitRenameDocument = (data) => {
    if (!data) return;

    let params = {
      documentId:
        (props.selectedItems &&
          props.selectedItems.length > 0 &&
          props.selectedItems[0].id) ||
        null,
        newFileName: data.name,
        title: data.title,
        districtId: districtId,
      };
    props.handleSuccess && props.handleSuccess(params);
  };

    const handleChooseDistrict = (event) => {
        setDistrictId(event.target.value);
    };
  const renderTitle = () => {
    switch (props.actionType) {
      case ACTION_TYPES.COPY:
        return "Sao chép tới";
      case ACTION_TYPES.MOVE:
        return "Di chuyển tới";
      case ACTION_TYPES.RENAME:
        return `Đổi tên '${
          props.selectedItems &&
          props.selectedItems.length > 0 &&
          props.selectedItems[0].name
        }'`;
      case ACTION_TYPES.DELETE:
        return `Bạn chắc chắn muốn xóa '${
          props.selectedItems &&
          props.selectedItems.length > 0 &&
          props.selectedItems.map((item) => {
            return item.name;
          })
        }'`;
      case ACTION_TYPES.CREATE_FOLDER:
        return "Thư mục mới";
      case ACTION_TYPES.UPLOAD_FILE:
        return "Tải lên tệp";
      case ACTION_TYPES.PREVIEW_FILE:
        return "Xem trước file";
      default:
        return "";
    }
  };

  const renderContentAction = () => {
    const actionType = props.actionType || "";
    switch (actionType) {
      case ACTION_TYPES.COPY:
        return (
          <div>
            <DialogContent dividers>
              {props.renderContent && props.renderContent()}
            </DialogContent>
            <DialogActions>
              <Button
                type="button"
                onClick={props.handleSuccess}
                color="primary"
              >
                Sao chép
              </Button>
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
      case ACTION_TYPES.MOVE:
        return (
          <div>
            <DialogContent dividers>
              {props.renderContent && props.renderContent()}
            </DialogContent>
            <DialogActions>
              {props.selectedFolder && props.selectedFolder instanceof Object && (
                <Button
                  type="button"
                  onClick={props.handleSuccess}
                  color="primary"
                >
                  Di chuyển
                </Button>
              )}
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
        case ACTION_TYPES.RENAME:
        return (
          <form onSubmit={handleSubmit(onSubmitRenameDocument)}>
                <DialogContent dividers>
                    {
                        props.selectedItems &&
                        props.selectedItems.length > 0 &&
                        props.selectedItems[0].type == 1 && isShowUi &&
                        (
                            <div>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <InputLabel>
                                                Quận - huyện
                                            </InputLabel>
                                            <Select placeholder="Chọn quận, huyện"
                                                fullWidth
                                                defaultValue={props.selectedItems &&
                                                    props.selectedItems.length > 0 &&
                                                    props.selectedItems[0].districtId}
                                                onChange={handleChooseDistrict}
                                            >
                                                {props.listDistrict && props.listDistrict.length > 0 ? (
                                                    props.listDistrict.map((item) => (
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                ) : (
                                                        <MenuItem value="">Không có quận huyện nào</MenuItem>
                                                    )}
                                               
                                            </Select>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <InputLabel>
                                                Tiêu đề file
                                            </InputLabel>
                                            <TextField
                                                type="text"
                                                name="title"
                                                defaultValue={
                                                    props.selectedItems &&
                                                    props.selectedItems.length > 0 &&
                                                    props.selectedItems[0].title
                                                }
                                                placeholder="Nhập tiêu đề..."
                                                className="w-100"
                                                inputRef={register}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className="row">
                    <div className="col-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <InputLabel>
                                    {
                                        props.selectedItems &&
                                        props.selectedItems.length > 0 &&
                                        props.selectedItems[0].type==1 ? "Tên file" : "Tên thư mục"
                                    }
                                    
                                    <span className="required"></span>
                                </InputLabel>
                            <TextField
                                type="text"
                                name="name"
                                defaultValue={
                                    props.selectedItems &&
                                    props.selectedItems.length > 0 &&
                                    props.selectedItems[0].name
                                }
                                placeholder="Nhập tên file..."
                                className="w-100"
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
            <DialogActions>
              <Button type="submit" color="primary">
                Đổi tên
              </Button>
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </form>
        );
      case ACTION_TYPES.DELETE:
        return (
          <div>
            <DialogContent dividers>
              <div>Bạn không thể khôi phục sau khi xóa. Xác nhận xóa.</div>
            </DialogContent>
            <DialogActions>
              <Button
                type="button"
                onClick={props.handleSuccess}
                color="primary"
              >
                Xóa
              </Button>
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
      case ACTION_TYPES.CREATE_FOLDER:
        return (
          <form onSubmit={handleSubmit(onSubmitCreateFolder)}>
            <DialogContent dividers>
              <div>
                <TextField
                  type="text"
                  name="folderName"
                  placeholder="Nhập tên thư mục..."
                  className="w-100"
                  inputRef={register({ required: true, maxLength: 255 })}
                  error={
                    errors.folderName &&
                    (errors.folderName.type === "required" ||
                      errors.folderName.type === "maxLength")
                  }
                />
                {errors.folderName && errors.folderName.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
                {errors.folderName &&
                  errors.folderName.type === "maxLength" && (
                    <span className="error">Tối đa 255 ký tự</span>
                  )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit" color="primary">
                Xác nhận
              </Button>
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </form>
        );
      case ACTION_TYPES.UPLOAD_FILE:
        return (
          <div>
            <DialogContent dividers>
              {props.renderContent && props.renderContent()}
            </DialogContent>
            <DialogActions>
              {props.fileUpload && props.fileUpload.length > 0 && (
                <Button
                  type="button"
                  onClick={props.handleSuccess}
                  color="primary"
                >
                  Tải lên
                </Button>
              )}
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
      case ACTION_TYPES.PREVIEW_FILE:
        return (
          <div>
            <DialogContent dividers>
              {props.renderContent && props.renderContent()}
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
      default:
        return (
          <div>
            <DialogContent dividers></DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose} color="primary">
                Hủy
              </Button>
            </DialogActions>
          </div>
        );
    }
  };
  return (
    <Dialog
      onClose={props.handleClose}
      open={props.open}
      fullWidth={true}
      maxWidth={props.maxWidth || "sm"}
    >
      <DialogTitle onClose={props.handleClose}>{renderTitle()}</DialogTitle>
      {renderContentAction()}
    </Dialog>
  );
}
