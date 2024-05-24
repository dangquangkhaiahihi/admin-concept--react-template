import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../../utils/configuration";
import * as analysisNoteAction from "../../../../../redux/store/analysis-note/analysis-note.store";
import "suneditor/dist/css/suneditor.min.css";
import * as viVN from "../../../../../language/vi-VN.json";
import File_management from "../../../../../components/file_management/file_management";

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
const AddAnalysisNote = ({
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  setOrder,
  setOrderBy,
  analysisId,
  orderBy,
  order
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [isShow, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  
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

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    let formData = new FormData();
    formData.append("TableName", "");
    formData.append("Gid", 0);
    formData.append("analynisId", analysisId);
    data.note && formData.append("note", data.note);
    files.length > 0 && formData.append("documentUploadId", files[0].fileId);

    analysisNoteAction
      .CreateAnalysisNote(formData)
      .then((result) => {
        if (result) {
          setOrder("desc");
          setOrderBy("modifiedDate");
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          onSuccess();
          ShowNotification(
            viVN.Success.CreateSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch(
        (err) => viVN.Errors[err.errorType],
        NotificationMessageType.Error
      );
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Thêm thuyết minh</Typography>
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
              <label className="text-dark">
                Nội dung thuyết minh
              </label>
              <TextField
                inputRef={register({ required: true })}
                name="note"
                error={errors.note && errors.note.type === "required"}
                fullWidth
                type="text"
                className="form-control"
                onChange={(e) => setValue("note", e.target.value)}
              />
              {errors.note && errors.note.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
            </div>

            <div className="form-group row">
              <div className="col-12">
                <label className="text-dark text-dark-for-long-label">
                  Văn bản pháp lý kèm theo
                </label>
                
                <div>
                  {/* <TextField
                    inputRef={register({ required: true })}
                    type="hidden"
                    name="image"
                    value={(files && files.length > 0 && files[0].fileName) || ""}
                  />
                  {errors.image && errors.image.type === "required" && (
                    <p className="error">Trường này là bắt buộc</p>
                  )} */}
                  {!isShow &&
                    files &&
                    files.length > 0 &&
                    files.map((item) => (
                      <div key={item.fileName} style={{ width: '150px' }}>
                        <img
                          src={require('../../../../../assets/icon/default.svg')}
                          alt={item.fileName}
                          title={item.fileName}
                          className='img-fluid mb-2'
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%',
                          }}
                        />
                      </div>
                  ))}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenSelectFile}
                  >
                    Chọn file
                  </Button>
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
            <File_management
              files={files}
              setFiles={setFiles}
              acceptedFiles={["doc", "docx", "txt", "pdf", "png", "jpg"]}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              onClick={onCloseSelectFile}
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Thoát
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
};

export default AddAnalysisNote;
