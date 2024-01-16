import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import FileViewer from "../file-viewer/components/file-viewer";

export default function ViewFileDialog(props) {
  const { isOpen, onClose, header, fileType, filePath } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullScreen
      >
        <DialogTitle className="border-bottom">
          {header ? header : "File đã tạo"}
        </DialogTitle>
        <DialogContent className="pt-4 pb-4">
          
          <FileViewer
            fileType={fileType}
            filePath={filePath}
            isShowMobile
            style={{left: 0}}
          />

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
