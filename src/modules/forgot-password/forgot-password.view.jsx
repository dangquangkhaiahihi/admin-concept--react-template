/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowLeft,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UrlCollection } from "../../common/url-collection";
import history from "../../common/history";
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType, DomainAdminSite } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as accountAction from "../../redux/store/account/account.store";

import "./forgot-password.scss";

export default function ForgotPasswordDesktop(props) {
  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });

  const [height, setHeight] = useState({
    minHeight: `${window.innerHeight}px`,
  });
  const [isSuccess, setSuccess] = useState(false);

  const onSubmitForgot = (data) => {
    if (!data) return;
    setSuccess(true);
    accountAction
      .ForgotPassword({
        Email: data.email,
        // returnUrl: DomainAdminSite + UrlCollection.ResetPassword,
      })
      .then(
        (res) => {
          setSuccess(true);
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

  const onSubmitConfirm = () => {
    history.push(UrlCollection.Login);
  };

  return (
    <div className="forgot-page" style={height}>
      <div className="forgot-form">
        {!isSuccess && (
          <form onSubmit={handleSubmit(onSubmitForgot)}>
            <div className="row">
              <div className="col-12">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="icon-title text-center w-100"
                />
                <h3 className="title text-center w-100 mt-1">Quên mật khẩu</h3>
              </div>
              <div className="col-12 form-group mt-4 mb-4">
                <FontAwesomeIcon icon={faUser} className="icon-input" />
                <input
                  type="text"
                  name="email"
                  className="form-control"
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
              <div className="col-6 text-left">
                <Link to={UrlCollection.Login} className="arrow-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="icon-link" />{" "}
                  Quay về
                </Link>
              </div>
              <div className="col-6 text-right">
                <button
                  type="submit"
                  className="btn btn-danger"
                  //onClick={onSubmitForgot}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </form>
        )}

        {isSuccess && (
          <div className="row">
            <div className="col-12">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="icon-title text-center w-100"
              />
              <h3 className="title text-center w-100 mt-1">Quên mật khẩu</h3>
              <p className="text-center mt-2 mb-4">
                {viVN.Success.ForgotPasswordSuccess}
              </p>
            </div>
            <div className="col-12">
              <button
                type="button"
                className="btn btn-info w-100"
                onClick={onSubmitConfirm}
              >
                Quay về
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
