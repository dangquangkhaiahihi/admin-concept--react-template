import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

export default function DeleteDialog(props) {
  const { isOpen, onClose, onSuccess, header, content, btnName } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle className="border-bottom">
          {header ? header : "Bạn chắc chắn muốn xóa bản ghi này?"}
        </DialogTitle>
        <DialogContent className="pt-4 pb-4">
          <DialogContentText className="mb-0 text-center text-dark">
            {content ? content : "Hành động này sẽ xóa vĩnh viễn bản ghi"}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="border-top">
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            onClick={onSuccess}
            variant="contained"
            color="secondary"
            startIcon={btnName ? "" : <DeleteIcon />}
          >
            {btnName ? btnName :"Xoá"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
