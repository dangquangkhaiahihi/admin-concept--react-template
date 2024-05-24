import React, { useEffect, useState, useRef } from "react";
import ActivityDetector from "react-activity-detector";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {
  getCookies,
  getUserInfo,
  removeCookies,
  setLockScreen,
} from "../../utils/configuration";
import { refreshToken } from "../../api/api-config-interceptors";

const customActivityEvents = ["click", "keydown"];

const DialogWarningExpired = () => {
  const interVal = useRef(0);
  const interValCheckExpired = useRef(0);
  const [countDown, setCountDown] = useState(20);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (countDown && visible) {
      interVal.current = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }
    if (countDown === 0) {
      clearInterval(interVal.current);
    }
    return () => clearInterval(interVal.current);
  }, [countDown, visible]);

  useEffect(() => {
    interValCheckExpired.current = setInterval(() => {
      if (getUserInfo()) {
        if (getCookies("isShowDialog") === "true") {
          setVisible(true);
        }
        if (countDown === 0) {
          removeCookies("isShowDialog");
          setLockScreen(true);
          setVisible(false);
          setCountDown(20);
        }
      }
    }, 1000);

    return () => clearInterval(interValCheckExpired.current);
  }, [countDown, visible]);

  const onCancelDialog = () => {
    refreshToken();
    removeCookies("isShowDialog");
    setCountDown(20);
    setVisible(false);
  };

  const onActive = () => {
    removeCookies("isShowDialog");
  };

  return (
    <Dialog
      open={visible}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ActivityDetector
        activityEvents={customActivityEvents}
        enabled={true}
        timeout={10 * 60 * 1000}
        onActive={onActive}
      />
      <DialogContent className="pt-4 pb-4">
        <DialogContentText className="mb-0 text-center text-dark">
          Ứng dụng sẽ đăng xuất sau {countDown} giây
        </DialogContentText>
      </DialogContent>
      <DialogActions className="border-top">
        <Button variant="contained" onClick={onCancelDialog}>
          Huỷ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogWarningExpired;
