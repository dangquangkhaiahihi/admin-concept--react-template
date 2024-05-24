/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhoneInput from "react-phone-input-2";
import {
  faEnvelope,
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

import "./register.scss";

export default function RegisterDesktop(props) {
  const [height, setHeight] = useState({
    minHeight: `${window.innerHeight}px`,
  });

  const [isConfirm, setConfirm] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [tel, setTel] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    errors,
    watch,
    getValues,
  } = useForm({ mode: "all", reValidateMode: "onBlur" });

  const password = useRef({});
  password.current = watch("password", "");

  const onChangePassword = () => {
    const { password, confirmPassword } = getValues();
    password === confirmPassword
      ? clearErrors(["confirmPassword"])
      : setError("confirmPassword", { type: "validate" });
  };

  const onBackToLogin = () => {
    history.push(UrlCollection.Login);
  };

  const onCheckTel = (data) => {
    let err = false;
    if (!data) {
      setError("mobilePhone", { type: "required" });
      err = true;
    } else if (data.toString().length < 10) {
      setError("mobilePhone", { type: "pattern" });
      err = true;
    } else clearErrors(["mobilePhone"]);
    setTel(data);
    return err;
  };

  const onSubmitRegister = async (data) => {
    if (!data || onCheckTel(tel)) return;
    accountAction
      .Register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: tel,
      })
      .then(
        (res) => {
          ShowNotification(
            viVN.Success.RegisterSuccess,
            NotificationMessageType.Success
          );
          onBackToLogin();
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

  return (
    <div className="register-page" style={height}>
      <div className="register-form">
        {!isConfirm && !isSuccess && (
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="icon-title text-center w-100"
                />
                <h3 className="title text-center w-100 mt-1">Đăng ký</h3>
              </div>
              <div className="col-12 form-group">
                <FontAwesomeIcon icon={faEnvelope} className="icon-input" />
                <input
                  type="text"
                  ref={register({
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  name="email"
                  className="form-control"
                  placeholder="Nhập email"
                />
                {errors.email && errors.email.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <span className="error">Email không đúng định dạng</span>
                )}
              </div>
              <div className="col-12 form-group">
                <PhoneInput
                  country={"vn"}
                  value={tel}
                  onChange={onCheckTel}
                  onBlur={() => onCheckTel(tel)}
                  placeholder="Số điện thoại"
                  autoFormat={false}
                  enableSearch={true}
                />
                <input
                  ref={register({
                    required: true,
                    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                  })}
                  type="text"
                  name="mobilePhone"
                  value={tel}
                  className="d-none"
                />
                {errors.mobilePhone &&
                  errors.mobilePhone.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                {errors.mobilePhone &&
                  errors.mobilePhone.type === "pattern" && (
                    <span className="error">Số điện thoại không hợp lệ</span>
                  )}
              </div>
              <div className="col-12 form-group">
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
                  Quay lại
                </Link>
              </div>
              <div className="col-6 text-right">
                <button type="submit" className="btn btn-danger">
                  Tiếp theo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* {isConfirm && !isSuccess && (
          <form onSubmit={handleSubmit(onSubmitConfirm)}>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="icon-title text-center w-100"
                />
                <h3 className="title text-center w-100 mt-1">Đăng ký</h3>
                <p className="text-center mt-1">
                  Một mã xác nhận đã được gửi tới email của bạn. Vui lòng kiểm
                  tra email.
                </p>
              </div>
              <div className="col-12 form-group mt-1 mb-4">
                <input
                  type="text"
                  ref={register({required:true})}
                  name="confirmCode"
                  className="form-control no-icon"
                  placeholder="Nhập mã xác nhận"
                />
                {errors.confirmCode && errors.confirmCode.type === "required" && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </div>
              <div className="col-6 text-left">
                <a onClick={onBackToRegister} className="arrow-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="icon-link" />{" "}
                  Quay về
                </a>
              </div>
              <div className="col-6 text-right">
                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </form>
        )} */}

        {!isConfirm && isSuccess && (
          <form>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="icon-title text-center w-100"
                />
                <p className="text-center mt-2">
                  Kích hoạt tài khoản thành công
                </p>
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
