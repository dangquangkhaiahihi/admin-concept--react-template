import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as userManagementAction from "../../../redux/store/user-management/user-management.store";
import * as appActions from "../../../core/app.store";

import { useDispatch } from 'react-redux';

import * as viVN from "../../../language/vi-VN.json";
import { NotificationMessageType } from "../../../utils/configuration";
import ShowNotification from "../../../components/react-notifications/react-notifications";

export default function FormChangePassword(props) {
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues, setError } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));
    
    const handleChangePassword = async (data) => {
        showLoading(true);
        try {
            const res = await userManagementAction.UpdateUserAccountPassword(data);
            ShowNotification(
                "Cập nhật mật khẩu",
                NotificationMessageType.Success
            );
        } catch ( err ) {
            if ( err.errorMessage == "Incorrect password.") {
                ShowNotification(
                    "Mật khẩu không chính xác.",
                    NotificationMessageType.Error
                );
            } else {
                ShowNotification(
                    viVN.Errors[err.errorType],
                    NotificationMessageType.Error
                );
            }
            
        } finally {
            showLoading(false);
        }
    }

    const onSubmit = (data) => {
        if (!data) {
          return;
        }

        if (data.newPassword !== data.confirmNewPassword)
            return setError("confirmNewPassword", {
                type: 'manual',
                message: 'Mật khẩu mới không khớp',
        })

        handleChangePassword({...data});
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Mật khẩu cũ <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="password"
                        name="currentPassword"
                        placeholder="Nhập mật khẩu cũ"
                        ref={register({ required: true })}
                    />
                    {errors.currentPassword && errors.currentPassword.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Mật khẩu mới <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        ref={register({ required: true })}
                    />
                    {errors.newPassword && errors.newPassword.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Xác nhận mật khẩu mới <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="password"
                        name="confirmNewPassword"
                        placeholder="Xác nhận mật khẩu mới"
                        ref={register({ required: true })}
                    />
                    {errors.confirmNewPassword && errors.confirmNewPassword.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.confirmNewPassword && errors.confirmNewPassword.type === "manual" && (
                      <span className="error">Mật khẩu nhập lại không trùng khớp</span>
                    )}
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <button ref={buttonSubmitRef} type="submit" className="btn btn-primary">
                        Lưu
                </button>
            </div>
        </form>
    )
}