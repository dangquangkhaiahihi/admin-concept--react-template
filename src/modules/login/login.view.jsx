import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {GenerateDeviceId} from  "../../common/tools";
import {
  faUser,
  faKey,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UrlCollection } from "../../common/url-collection";
import ShowNotification from "../../components/react-notifications/react-notifications";
import {
  NotificationMessageType,
  DomainAdminSide,
  setCookiesUser,
  removeCookies
} from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as accountAction from "../../redux/store/account/account.store";

import "./login.scss";

export default function LoginDesktop(props) {
  const [height, setHeight] = useState({
    minHeight: `${window.innerHeight}px`,
  });
  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });

  const onSubmit = (data) => {
    if (!data) return;
    if (data.email.toString().toLowerCase() == "xinykien_sonla@gmail.com") {
      ShowNotification(
        "Tên đăng nhập hoặc mật khẩu không tồn tại",
        NotificationMessageType.Error
      );
      return;
    }
    let DeviceId = GenerateDeviceId();
    accountAction
      .Login({
        email: data.email,
        password: data.password,
        rememberMe: true,
        returnUrl: DomainAdminSide,
        DeviceId: DeviceId
      })
      .then(
        (res) => {
          if (res && res.content && res.content.token) {
            setCookiesUser(res);
            removeCookies("isShowDialog");
            removeCookies("isLockScreen");
            window.location.replace(DomainAdminSide);
          } else {
            ShowNotification(
              viVN.Errors.UnableHandleException,
              NotificationMessageType.Error
            );
          }
        },
        (err) => {
          err &&
            err.errorType &&
            ShowNotification(
              err.errorMessage,
              NotificationMessageType.Error
            );
        }
      );
  };
  return (
    <div className="login-page" style={height}>
      <div className="login-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-12">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="icon-title text-center w-100"
              />
              <h3 className="title text-center w-100 mt-1">Đăng nhập</h3>
            </div>
            <div className="col-12 form-group mt-4">
              <FontAwesomeIcon icon={faUser} className="icon-input" />
              <input
                type="text"
                name="email"
                className="form-control"
                autoComplete="off"
                placeholder="Email"
                ref={register({
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email && errors.email.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className="error">Email không đúng định dạng</span>
              )}
            </div>
            <div className="col-12 form-group">
              <FontAwesomeIcon icon={faKey} className="icon-input" />
              <input
                type="password"
                name="password"
                className="form-control"
                autoComplete="off"
                placeholder="Mật khẩu"
                ref={register({
                  required: true,
                  minLength: 8,
                  pattern:
                    /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!-@#$%^&*()_+=[{},<.>/?'";:|]).*$/,
                })}
              />
              {errors.password && errors.password.type === "required" && (
                <span className="error">Trường này là bắt buộc</span>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <span className="error">Mật khẩu tối thiểu 8 ký tự</span>
              )}
              {errors.password && errors.password.type === "pattern" && (
                <span className="error">
                  Có it nhất 1 ký tự viết thường, hoa và ký tự đặc biệt
                </span>
              )}
            </div>
            <div className="col-12 text-center mb-4">
              <button type="submit" className="btn btn-danger w-100">
                Đăng nhập
              </button>
            </div>
            <div className="col-12 text-right">
              <Link
                to={UrlCollection.ForgotPassword}
                className="forgot-password"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
