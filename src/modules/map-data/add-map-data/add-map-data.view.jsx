import React from "react";
import { useForm } from "react-hook-form";

import {
  DialogActions,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

export default function AddMapData(props) {
  const { isOpen, onClose, onSuccess } = props;

  const { register, handleSubmit, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    onSuccess();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title" className="border-bottom">
          Thêm bản đồ
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <label className="text-dark">
                Tên bản đồ<span className="required"></span>
              </label>

              <TextField
                fullWidth
                type="text"
                name="mapName"
                error={errors.mapName && errors.mapName.type === "required"}
                inputRef={register({ required: true })}
              />
              {errors.mapName && errors.mapName.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
            </div>
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
