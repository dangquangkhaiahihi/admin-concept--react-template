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
const EditAnalysisNote = ({
  noteId,
  isOpen,
  onClose,
  onSuccess,
  GetListAll,
  rowsPerPage,
  orderBy,
  order
}) => {
  const classes = useStyles();
  const [analysisNote, setAnalysisNote] = useState();
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  useEffect(() => {
    console.log("analysisNote",analysisNote)
  }, [analysisNote]);

  useEffect(() => {
    analysisNoteAction
    .GetDetail(noteId)
    .then((res) => {
      if (res && res.content) {
        setAnalysisNote(res.content);
        setValue("note", res.content.note)
      }
    })
    .catch((err) => console.log(err));
  }, [noteId]);

  const onSubmit = (data) => {
    if (!data && analysisNote) {
      return;
    }
    let formData = new FormData();
    formData.append("Id", noteId);
    formData.append("TableName", analysisNote.tableName??"");
    formData.append("Gid", analysisNote.gid);
    formData.append("analynisId", analysisNote.analynisId);
    data.note && formData.append("note", data.note);
    analysisNoteAction
      .UpdateAnalysisNote(formData)
      .then((result) => {
        if (result) {
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
          <Typography variant="h6">Chỉnh sửa ghi chú</Typography>
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
                Ghi chú
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
};

export default EditAnalysisNote;
