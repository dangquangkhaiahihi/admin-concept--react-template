/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faUserCircle,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UrlCollection } from "../../common/url-collection";
import history from "../../common/history";
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as accountAction from "../../redux/store/account/account.store";

import "./reset-password.scss";

export default function ResetPasswordDesktop(props) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    errors,
    watch,
    getValues,
  } = useForm({ mode: "all", reValidateMode: "onBlur" });

  const [height, setHeight] = useState({
    minHeight: `${window.innerHeight}px`,
  });

  const [isSuccess, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({ userId: "", token: "" });

  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    if (
      props &&
      props.match &&
      props.match.params &&
      props.match.params.userId &&
      props.match.params.token
    ) {
      setUserInfo({
        userId: props.match.params.userId,
        token: props.match.params.token,
      });
    } else {
      history.push(UrlCollection.Login);
    }
  }, []);

  const onChangePassword = () => {
    const { password, confirmPassword } = getValues();
    password === confirmPassword
      ? clearErrors(["confirmPassword"])
      : setError("confirmPassword", { type: "validate" });
  };

  const onSubmit = (data) => {
    if (!data) return;
    accountAction
      .ResetPassword({
        email: userInfo.userId,
        password: data.password,
        confirmPassword: data.confirmPassword,
        code: userInfo.token,
      })
      .then(
        (res) => {
          ShowNotification(
            viVN.Success.ResetPasswordSuccess,
            NotificationMessageType.Success
          );
          history.push(UrlCollection.Login);
        },
        (err) => {
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
  };

  const onBackToLogin = () => {
    history.push(UrlCollection.Login);
  };

  return (
    <div className="reset-password-page" style={height}>
      <div className="reset-password-form">
        {!isSuccess && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="icon-title text-center w-100"
                />
                <h3 className="title text-center w-100 mt-1">
                  Đặt lại mật khẩu
                </h3>
              </div>
              <div className="col-12 form-group mt-4">
                <FontAwesomeIcon icon={faKey} className="icon-input" />
                <input
                  type="password"
                  ref={register({
                    required: true,
                    minLength: 8,
                    pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!-@#$%^&*()_+=[{},<.>/?'";:|]).*$/,
                  })}
                  onChange={onChangePassword}
                  name="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
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
              <div className="col-12 form-group mb-4">
                <FontAwesomeIcon icon={faKey} className="icon-input" />
                <input
                  type="password"
                  ref={register({
                    validate: (value) =>
                      value === password.current || "Mật khẩu không trùng khớp",
                  })}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword &&
                  errors.confirmPassword.type === "validate" && (
                    <span className="error">Mật khẩu không khớp</span>
                  )}
              </div>
              <div className="col-6 text-left">
                <Link to={UrlCollection.Login} className="arrow-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="icon-link" />{" "}
                  Đăng nhập
                </Link>
              </div>
              <div className="col-6 text-right">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onSubmit}
                >
                  Thay đổi mật khẩu
                </button>
              </div>
            </div>
          </form>
        )}

        {isSuccess && (
          <form>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="icon-title text-center w-100"
                />
                <p className="text-center mt-2">Thay đổi mật khẩu thành công</p>
              </div>
              <div className="col-12 text-center">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onBackToLogin}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
