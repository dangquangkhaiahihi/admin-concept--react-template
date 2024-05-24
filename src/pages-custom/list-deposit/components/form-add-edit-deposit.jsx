import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsClientTypes, optionsMonths, optionsPromotionConditions, optionsPromotions } from '../../constant';
import { getUserInfo } from '../../../utils/configuration';
import * as orderManagementAction from "../../../redux/store/order-management/order-management.store";
import * as appActions from "../../../core/app.store";
import { useDispatch } from 'react-redux';

import * as viVN from "../../../language/vi-VN.json";
import { NotificationMessageType } from "../../../utils/configuration";
import ShowNotification from "../../../components/react-notifications/react-notifications";

export default function FormAddEditDeposit(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem,
        client, users, plan
    } = props;
    const buttonSubmitRef = useRef(null);

    const userInfo = getUserInfo();

    const { register, handleSubmit, errors, setValue, watch, getValues, clearErrors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    
    const [optionsClient] = useState(client.map(item => {return {label: item.name, value: item.id}}));
    const [selectedClient, setSelectedClient] = useState(null);

    const [optionsUser] = useState(users.map(item => {return {label: item.fullName, value: item.id}}));
    const [selectedUser, setSelectedUser] = useState(null);

    const [optionsPlan] = useState(plan.map(item => {return {label: item.name, value: item.id, price: item.price}}));
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        if (updateItem?.id) {
            const foundClient = optionsClient.find(item => item.value === updateItem.id);
            if (foundClient) {
                setSelectedClient(foundClient);
            }
            setValue("clientId", updateItem.id);
        }

        const foundUser = optionsUser.find(item => item.value === userInfo.userId);
        setSelectedUser(foundUser);
        setValue("userId", userInfo.userId);

        // setValue("name", updateItem?.name);
        // setValue("price", updateItem?.price);
        // setValue("promotion", updateItem?.promotion);
        // setValue("promotionConditions", updateItem?.promotionConditions);
        // setValue("endDate", updateItem?.endDate ? dayjs(updateItem?.endDate).format() : null);
        // setValue("info", updateItem?.info);
    }, [])

    const selectedMonth = watch("month");
    const startDate = watch("startDate");
    
    const [displayEndDate, setDisplayEndDate] = useState(null);

    useEffect(() => {
        clearErrors()
        if (selectedMonth && startDate) {
            const endDateVal = dayjs(startDate).add(selectedMonth.value, 'months');
            setValue("endDate", endDateVal.format());
            setDisplayEndDate(endDateVal);
        } else {
            setValue("endDate", null);
            setDisplayEndDate(null);
        }
    }, [selectedMonth, startDate, setValue]);

    const selectedDiscountType = watch("discountType");
    const inputDiscount = watch("discount");
    const [displayPrice, setDisplayPrice] = useState();

    useEffect(() => {
        try {
            console.log(inputDiscount, parseInt(inputDiscount));
            if ( Number.isNaN(parseInt(inputDiscount)) ) throw new Error('');
            if ( selectedDiscountType.value === 1 && inputDiscount ) {
                setDisplayPrice( parseInt(selectedPlan?.price) - parseInt(inputDiscount) );
            }
            else if ( selectedDiscountType.value === 2 && inputDiscount ) {
                setDisplayPrice( parseInt(selectedPlan?.price) * (100 - parseInt(inputDiscount)) / 100 );
            } else {
                throw new Error('');
            }
        } catch (err) {
            setDisplayPrice(selectedPlan?.price || 0);
        }
        
    }, [selectedDiscountType, inputDiscount, getValues]);

    useEffect(() => {
        setDisplayPrice(selectedPlan?.price || 0);
    }, [selectedPlan])

    const onSubmit = (data) => {
        console.log(data);
        if (!data) {
          return;
        }
        const dataSubmit = { ...data,  id: updateItem?.id }
        if ( selectedDiscountType ) {
            dataSubmit.discountType = selectedDiscountType.value;
        }
        if ( selectedPlan ) {
            dataSubmit.planId = selectedPlan.value;
        }
        if ( selectedMonth ) {
            dataSubmit.month = selectedMonth.value;
        }
        handleAddNewOrder(dataSubmit);

        onCloseModal();
    }

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));
    const handleAddNewOrder = async (data) => {

        showLoading(true);
        try {
            const res = orderManagementAction.CreateOrderManagement(data);

            if (res && res.content) {
                ShowNotification(
                    viVN.Success["CreateSuccess"],
                    NotificationMessageType.Success
                );
                onCloseModal();
            }
        } catch (err) {
            showLoading(false);
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        } finally {
            showLoading(false);
        }
    }

    useEffect(()=>{
        if (!triggerSubmit) return;
        buttonSubmitRef.current.click();
        setTriggerSubmit(false);
    }, [triggerSubmit])

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-center">
                <p className='h5'>Số tiền</p>
                <h1 className="mb-1">{displayPrice} VNĐ</h1>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Khách hàng <span className='required'>*</span></label>
                    <Select
                        {...register("clientId", {required: true})}
                        isClearable
                        value={selectedClient}
                        placeholder="Khách hàng"
                        onChange={(data) => {
                            setSelectedClient(data);
                            setValue("clientId", data);
                        }}
                        options={optionsClient}
                        noOptionsMessage={() => "Không tồn tại"}
                        isDisabled
                    />
                    {errors.clientId && errors.clientId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Chọn nhân viên <span className='required'>*</span></label>
                    <Select
                        {...register("userId", {required: true})}
                        isClearable
                        value={selectedUser}
                        placeholder="Chọn nhân viên"
                        onChange={(data) => {
                            setSelectedUser(data);
                            setValue("userId", data);
                        }}
                        options={optionsUser}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                    {errors.userId && errors.userId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>

            <div className='row'>
                <div className="form-group  col-md-6">
                    <label>Ngày kích hoạt <span className='required'>*</span></label>
                    <DatePicker
                        {...register("startDate", {required: true})}
                        onChange={(data) => setValue("startDate", dayjs(data).format())}
                        className="form-control"
                        format='DD/MM/YYYY'
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    {errors.startDate && errors.startDate.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>

                <div className="form-group  col-md-6">
                    <label>Ngày hết hạn <span className='required'>*</span></label>
                    <DatePicker
                        {...register("endDate", {required: true})}
                        onChange={(data) => setValue("endDate", dayjs(data).format())}
                        value={displayEndDate}
                        className="form-control"
                        format='DD/MM/YYYY'
                        slotProps={{ textField: { size: 'small' } }}
                        disabled={selectedMonth ? true : false}
                    />
                    {
                        selectedMonth ? <span className="error">Ngày hết hạn được tính tự động</span> : <></>
                    }
                    {errors.endDate && errors.endDate.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>
            
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Chọn gói đăng ký <span className='required'>*</span></label>
                    <Select
                        {...register("planId", {required: true})}
                        isClearable
                        value={selectedPlan}
                        placeholder="Chọn gói đăng ký"
                        onChange={(data) => {
                            setSelectedPlan(data);
                            setValue("planId", data);
                        }}
                        options={optionsPlan}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                    {errors.planId && errors.planId.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Gia hạn</label>
                    <Select
                        {...register("month")}
                        isClearable
                        placeholder="Chọn số tháng"
                        onChange={(data) => {
                            setValue("month", data);
                        }}
                        options={optionsMonths}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Loại giảm giá</label>
                    <Select
                        {...register("discountType")}
                        isClearable
                        placeholder="Chọn loại giảm giá"
                        onChange={(data) => {
                            setValue("discountType", data);
                        }}
                        options={[{value: 1, label: "Loại thường (VNĐ)"}, {value: 2, label: "Theo phần trăm (%)"}]}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label>Giảm giá</label>
                    <input
                        className="form-control"
                        type="text"
                        name="discount"
                        maxLength="10"
                        placeholder="Nhập lượng giảm giá"
                        ref={register({ pattern: /^[0-9]+$/, })}
                    />
                    {errors.month && errors.month.type === "pattern" && (
                      <span className="error">Giá trị không hợp lệ</span>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-12">
                    <label>Ghi chú</label>
                    <textarea
                        className="form-control"
                        type="text"
                        name="note"
                        maxLength="200"
                        placeholder="Nhập nội dung"
                        ref={register()}
                        style={{height: '150px'}}
                    />
                </div>
            </div>

            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}