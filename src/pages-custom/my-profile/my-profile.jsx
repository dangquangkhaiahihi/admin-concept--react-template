import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as appActions from "../../core/app.store";
import * as config from '../../common/config'

import * as viVN from "../../language/vi-VN.json";
import { NotificationMessageType } from "../../utils/configuration";
import ShowNotification from "../../components/react-notifications/react-notifications";

import * as userManagementAction from "../../redux/store/user-management/user-management.store";
import * as roleManagementAction from "../../redux/store/role/role-management.store";
import * as securityMatrixAction from "../../redux/store/security-matrix/security-matrix.store";

import ModalSubmitForm from '../../components/custom-modal/modal-submit-form/modal-submit-form';
import dayjs from 'dayjs';
import ModalConfirm from '../../components/custom-modal/modal-confirm/modal-confirm';

import DataTableCustom from '../../components/datatable-custom';
import { mediaUrl } from '../../api/api-service-custom';
import FormEditProfile from './components/form-edit-profile';
import NotificationService from '../../common/notification-service'
import FormChangePassword from './components/form-change-password';


export default function MyProfile() {
    const { register, handleSubmit, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    const [user, setUser] = useState(null)
    const getUserAccountDetail = async () => {
        showLoading(true);
        try {
            const res = await userManagementAction.GetUserAccountDetail();
            if (!res || !res.content) return;
            setUser(res.content);
        } catch (err) {
            err && err.errorType &&
                ShowNotification(
                    viVN.Errors[err.errorType],
                    NotificationMessageType.Error
                );
        } finally {
            showLoading(false);
        }
    }

    const handleEditProfile = async (data) => {
        showLoading(true);
        try {
            const response = await userManagementAction.UpdateAccountInfo(data);
            // response?.content?.status && NotificationService.success('Cập nhật thông tin tài khoản thành công')
            ShowNotification(
                "Cập nhật thông tin tài khoản thành công",
                NotificationMessageType.Success
            );
            getUserAccountDetail();
        } catch ( error ) {
            // NotificationService.error(error?.errorMessage ?? '')
            ShowNotification(
                "Có lỗi xảy ra, vui lòng thử lại sau",
                NotificationMessageType.Error
            );
        } finally {
        }
    }

    useEffect(() => {
        getUserAccountDetail();
    }, [])
    
    return (
        <div className='row'>
            <div className="col-xl-12 col-lg-12 col-md-126 col-sm-12 col-12">
                <div className="card">
                    <div className="card-header d-flex">
                        <div className="toolbar card-toolbar-tabs">
                            <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active pl-0" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Thông tin tài khoản</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Đổi mật khẩu</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="tab-content mb-3" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                <FormEditProfile 
                                    updateItem={user}
                                    onSubmitAddEdit={handleEditProfile}
                                />
                            </div>
                            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                <FormChangePassword />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}