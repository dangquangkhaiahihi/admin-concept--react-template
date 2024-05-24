/* eslint-disable react-hooks/exhaustive-deps */
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
  Select,
  TextareaAutosize,
  MenuItem,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

//--- SunEditor
import "suneditor/dist/css/suneditor.min.css";
import * as logTemplateAction from "../../../redux/store/log/log.store";

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

function LogDetailDiaLog(props) {
  const [active, setActive] = useState(false);
  const [type, setType] = useState("");
  const classes = useStyles();
  const {
    openAddDialog,
    onHideModal,
    logEditCode
  } = props;
  const { register, errors } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [logEditModel, setLogEditModel] = useState();

  useEffect(() => {
    getDetailData()
  }, []);

  const getDetailData = async() => {
   await logTemplateAction
    .Log_Detail(logEditCode)
    .then((res) => {
      if(res && res.content) {
        setLogEditModel(res.content)
      }
    })
    .catch((rejects) => console.log(rejects));
  }
 

  return (
    <div>
      <Dialog
        open={openAddDialog}
        onClose={onHideModal}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {"Chi tiết log"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onHideModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {logEditModel ? (
          <form >
         <DialogContent className="pt-4 pb-2">
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <label className="text-dark">
                  Message
                  </label>
                  <TextareaAutosize
                    name='message'
                    disabled
                    rowsMin={3}
                    value={logEditModel.message}
                    className={'form-control'}
                    ref={register({ required: true })}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <label className="text-dark">
                  Exception
                  </label>
                  <TextareaAutosize
                    name='exception'
                    disabled
                    rowsMin={3}
                    value={logEditModel.exception}
                    className={'form-control'}
                    ref={register({ required: true })}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
            <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Source Context
                  </label>
                  <TextField
                    disabled
                    name="sourceContext"
                    type="text"
                    fullWidth
                    value={logEditModel.sourceContext}
                    variant="outlined"
                  />

                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Request Path
                  </label>
                  <TextField
                    disabled
                    name="requestPath"
                    type="text"
                    fullWidth
                    value={logEditModel.requestPath}
                    variant="outlined"
                  />

                </div>
                </div> 
                 </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Level</label>
                  <Select
                    disabled
                    name="level"
                    variant="outlined"
                    value={logEditModel.level}
                    className="w-100"
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="Warning">Warning </MenuItem>
                    <MenuItem value="Information">Information</MenuItem>
                    <MenuItem value="Error">Error</MenuItem>
                  </Select>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Resource Id
                  </label>
                  <TextField
                    disabled
                    name="resourceId"
                    type="text"
                    fullWidth
                    value={logEditModel.resourceId}
                    variant="outlined"
                  />

                </div>
                </div>
              </div>
          
        
          </DialogContent>
            <DialogActions>
              <div className="col-12 col-md-6 col-lg-6" style={{textAlign : 'right'}}>
              <Button
                onClick={onHideModal}
                variant="contained"
                startIcon={<CloseIcon />}
              >
                Đóng
              </Button>
              </div>
            </DialogActions>
          </form>
        ) : (
          "Xảy ra lỗi trong hệ thống"
        )}
      </Dialog>
    </div>
  );
}
export default LogDetailDiaLog;
