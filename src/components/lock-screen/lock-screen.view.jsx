import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import Dialog from "@material-ui/core/Dialog";
import ShowNotification from "../../components/react-notifications/react-notifications";
import * as accountAction from "../../redux/store/account/account.store";
import * as viVN from "../../language/vi-VN.json";
import {GenerateDeviceId} from  "../../common/tools";
import {
  NotificationMessageType,
  DomainAdminSide,
  setCookiesUser,
  getUserInfo,
  APIUrlDefault,
  removeCookies,
  TokenKey,
  getCookies,
} from "../../utils/configuration";
import { AccountApiService } from "../../redux/store-custom/account/account.store";

const LockScreen = () => {
  const [user, setUser] = useState(getUserInfo());
  const history = useHistory();
  const intervalCheckLockScreen = useRef();
  const [isShowLockScreen, setIsShowLockScreen] = useState(false);
  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });

  useEffect(() => {
      intervalCheckLockScreen.current = setInterval(() => {
          setUser(getUserInfo());
      if (getUserInfo() && getCookies("isLockScreen") === "true") {
        setIsShowLockScreen(true);
      }
    }, 1000);

    return () => clearInterval(intervalCheckLockScreen.current);
  }, []);

  const onSubmit = async (data) => {
    if (!data) return;
    let DeviceId = GenerateDeviceId();
    try {
      const res = await AccountApiService.Login({
        email: user?.email==null || user?.email==undefined || user?.email=="" ? user?.userName : user?.email,
        password: data.password,
        rememberMe: true,
        returnUrl: DomainAdminSide,
        DeviceId: DeviceId
      });

      if (res && res.content && res.content.token) {
        setCookiesUser(res);
        removeCookies("isShowDialog");
        removeCookies("isLockScreen");
          setIsShowLockScreen(false);
          console.log(res)
      } else {
        ShowNotification(
          viVN.Errors.UnableHandleException,
          NotificationMessageType.Error
        );
      }

    } catch ( err ) {
      err &&
      err.errorType &&
      ShowNotification(
        viVN.Errors[err.errorType],
        NotificationMessageType.Error
      );
    }
  };

    const onLogout = () => {
    removeCookies("screenAllow");
    console.log("bi dang xuat lock-screen")
    history.push("/dang-nhap");
    removeCookies("isShowDialog");
    removeCookies("isLockScreen");
    removeCookies(TokenKey.token);
    removeCookies(TokenKey.refreshToken);
    removeCookies(TokenKey.returnUrl);
    setIsShowLockScreen(false);
  };

  return (
    <Dialog
      open={isShowLockScreen}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen
    >
      <div
        className="login-page"
        style={{
          minHeight: `${window.innerHeight}px`,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12">
            <img
              className="img-profile rounded-circle"
              src={
                //require("../../assets/images/user-default.png"
                user && user.avatar && user.avatar !== "null"
                  ? APIUrlDefault + user.avatar
                  : process.env.PUBLIC_URL + "/user-default.png"
              }
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = require('../../assets/images/logo.png');
              }}
              style={{
                display:'flex',
                margin:'auto',
                width: 150,
                height: 150,
                objectFit: "cover",
              }}
            />
            <h3 className="title text-center w-100 mt-1">
              {user?.userName || "User"}
            </h3>
          </div>

          <div className="col-12 form-group">
            <FontAwesomeIcon
              icon={faKey}
              style={{
                position: "absolute",
                top: "0.7rem",
                left: "1.5rem",
              }}
            />
            <input
              type="password"
              name="password"
              className="form-control"
              autoComplete="off"
              placeholder="Mật khẩu"
              ref={register({
                required: true,
                minLength: 8,
                // pattern:
                //   /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!-@#$%^&*()_+=[{},<.>/?'";:|]).*$/,
              })}
              style={{ paddingLeft: "2rem" }}
            />
            {errors.password && errors.password.type === "required" && (
              <span className="error">Trường này là bắt buộc</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span className="error">Mật khẩu tối thiểu 8 ký tự</span>
            )}
            {/* {errors.password && errors.password.type === "pattern" && (
              <span className="error">
                Có it nhất 1 ký tự viết thường, hoa và ký tự đặc biệt
              </span>
            )} */}
          </div>
                  <div className="col-12 text-center mb-4">
            <button
              type="submit"
              className="col-6 btn btn-danger"
              style={{ maxWidth: "45%", marginRight: 5 }}
            >
              Mở khóa
            </button>
            <button
              className="col-6 btn btn-default-ct btn-inliner"
              onClick={onLogout}
              style={{ maxWidth: "45%", marginRight: 5 }}
            >
              Đăng xuất
            </button>
            
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default LockScreen;
