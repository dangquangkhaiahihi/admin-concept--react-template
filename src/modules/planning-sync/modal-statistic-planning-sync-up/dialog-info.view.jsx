import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

export default function InfoDialog(props) {
  const { isOpen, onClose, header, content } = props;

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
          {header}
        </DialogTitle>
        <DialogContent className="pt-4 pb-4">
          <DialogContentText className="mb-0 text-center text-dark">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="border-top">
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
