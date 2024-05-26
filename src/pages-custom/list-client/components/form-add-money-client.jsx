import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsClientTypes, optionsPromotionConditions, optionsPromotions } from '../../constant';
import DepositManagement from '../../list-deposit/list-deposit';
import { getUserInfo } from '../../../utils/configuration';
import * as depositManagementAction from "../../../redux/store/deposit-management/deposit-management.store";
import * as appActions from "../../../core/app.store";
import { useDispatch } from 'react-redux';

import * as viVN from "../../../language/vi-VN.json";
import { NotificationMessageType } from "../../../utils/configuration";
import ShowNotification from "../../../components/react-notifications/react-notifications";

export default function FormAddMoneyClient(props) {
    const now = new Date();
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues, reset } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    useEffect(() => {
        
    }, [])

    const userInfo = getUserInfo();

    const [reloadDeposit, setReloadDeposit] = useState(true);
    const onSubmit = (data) => {
        if (!data) {
          return;
        }

        const dataSubmit = { ...updateItem, totalMoney: parseInt(updateItem?.totalMoney) + parseInt(data.amount) }
        
        handleCreateDeposit(dataSubmit, {
            clientId: updateItem?.id,
            depositAmount: parseInt(data.amount),
            userId: userInfo?.id,
            status: "success"
        });
    }

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    const handleCreateDeposit = async (dataSubmitDeposit, data) => {
        showLoading(true);
        try {
            const resDeposit = await onSubmitAddEdit(dataSubmitDeposit);

            const res = await depositManagementAction.CreateDepositManagement(data);

            // if (res && res.content) {
            //     ShowNotification(
            //         viVN.Success["CreateSuccess"],
            //         NotificationMessageType.Success
            //     );
            // }
        } catch (err) {
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        } finally {
            showLoading(false);
            setReloadDeposit(prev => !prev);
            reset();
        }
    }

    useEffect(()=>{
        if (!triggerSubmit) return;
        buttonSubmitRef.current.click();
        setTriggerSubmit(false);
    }, [triggerSubmit])

    return (
        <>
            <div className="text-center" style={{marginBottom: '12px'}}>
                <p className='h5'>Nạp tiền cho khách hàng: {updateItem?.name}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="row">
                    <div className="form-group col-md-12">
                        <label>Số tiền <span className='required'>*</span></label>
                        <input
                            className="form-control"
                            type="text"
                            name="amount"
                            maxLength="10"
                            placeholder="VNĐ"
                            ref={register({ required: true, pattern: /^[0-9]+$/, })}
                        />
                        {errors.amount && errors.amount.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                        )}
                        {errors.amount && errors.amount.type === "pattern" && (
                        <span className="error">Giá trị không hợp lệ</span>
                        )}
                    </div>
                </div>
                
                <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Nạp tiền
                </button>
            </form>
            <div className="text-center" style={{marginBottom: '12px'}}>
                <p className='h5'>Lịch sử nạp tiền</p>
            </div>
            {
                updateItem ? (
                    <DepositManagement
                        clientId={updateItem?.id}
                        endDateDayjs={dayjs(now)}
                        startDateDayjs={dayjs(now).subtract(1, "month")}
                        reloadDeposit={reloadDeposit}
                    />
                ) : <></>
            }
        </>
    )
}