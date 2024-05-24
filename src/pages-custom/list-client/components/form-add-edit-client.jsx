import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsClientTypes, optionsPromotionConditions, optionsPromotions } from '../../constant';

export default function FormAddEditClient(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit,
        province, users
    } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const [checkActive, setCheckActive] = useState(true);
    const [checkConfirm, setCheckConfirm] = useState(true);
    
    const [optionsProvince] = useState(province.map(item => {return {label: item.name, value: item.id}}));
    const [selectedProvinces, setSelectedProvinces] = useState([]);

    const [optionsUser] = useState(users.map(item => {return {label: item.fullName, value: item.id}}));
    const [selectedUser, setSelectedUser] = useState(null);

    const [selectedClientType, setSelectedClientType] = useState([]);

    useEffect(() => {
        setCheckActive(updateItem?.isActive);
        setCheckConfirm(updateItem?.isConfirm);

        if (updateItem?.provinceIds && Array.isArray(updateItem.provinceIds) && updateItem.provinceIds.length > 0) {
            const filtered = [];
            updateItem.provinceIds.forEach(id => {
                const found = optionsProvince.find(item => item.value === id);
                filtered.push(found);
            });
            
            setSelectedProvinces(filtered);
            setValue("provinceIds", filtered);
        }

        if (updateItem?.userId) {
            const foundUser = optionsUser.find(item => item.value === updateItem.userId);
            if (foundUser) {
                setSelectedUser(foundUser);
            }
            setValue("userId", updateItem.userId);
        }

        if (updateItem?.clientType && Array.isArray(updateItem.clientType) && updateItem.clientType.length > 0) {
            const filtered = [];
            updateItem.clientType.forEach(id => {
                const found = optionsClientTypes.find(item => item.value === id);
                filtered.push(found);
            });
            
            setSelectedClientType(filtered);
            setValue("clientType", filtered);
        }

        // setValue("name", updateItem?.name);
        // setValue("price", updateItem?.price);
        // setValue("promotion", updateItem?.promotion);
        // setValue("promotionConditions", updateItem?.promotionConditions);
        // setValue("endDate", updateItem?.endDate ? dayjs(updateItem?.endDate).format() : null);
        // setValue("info", updateItem?.info);
    }, [])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }
        
        const dataSubmit = { ...data,  id: updateItem?.id }
        if ( selectedProvinces.length > 0 ) {
            dataSubmit.provinceIds = selectedProvinces.map( item => item.value )
        }
        if ( selectedUser ) {
            dataSubmit.userId = selectedUser.value
        }
        if ( selectedClientType.length > 0 ) {
            dataSubmit.clientType = selectedClientType.map( item => item.value )
        }
        onSubmitAddEdit(dataSubmit);
        onCloseModal();
    }

    useEffect(()=>{
        if (!triggerSubmit) return;
        buttonSubmitRef.current.click();
        setTriggerSubmit(false);
    }, [triggerSubmit])

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Họ và tên <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={updateItem?.name}
                        maxLength="150"
                        placeholder="Nhập họ và tên"
                        ref={register({ required: true, maxLength:150 })}
                    />
                    {errors.name && errors.name.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Email</label>
                    <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={updateItem?.email}
                        maxLength="100"
                        placeholder="Nhập email"
                        ref={register({ required: true, maxLength:100  })}
                    />
                    {errors.email && errors.email.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Số điện thoại</label>
                    <input
                        className="form-control"
                        type="text"
                        name="phoneNumber"
                        defaultValue={updateItem?.phoneNumber}
                        maxLength="10"
                        placeholder="Nhập số điện thoại"
                        ref={register({ required: true, pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/  })}
                    />
                    {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                      <span className="error">Số điện thoại không đúng đinh dạng</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Mật khẩu mới</label>
                    <input
                        className="form-control"
                        type="text"
                        name="password"
                        maxLength="150"
                        ref={register()}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Tổng tiền <span className='required'>(VNĐ)</span></label>
                    <input
                        className="form-control"
                        type="number"
                        name="name"
                        value={updateItem?.totalMoney}
                        disabled
                    />
                </div>
                <div className="form-group col-md-6">
                    <label>Khu vực hoạt động</label>
                    <Select
                        {...register("provinceIds")}
                        isClearable
                        isMulti
                        value={selectedProvinces}
                        placeholder="Chọn khu vực hoạt động"
                        onChange={(data) => {
                            setSelectedProvinces(data);
                            setValue("provinceIds", data);
                        }}
                        options={optionsProvince}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Nhân viên CSKH</label>
                    <Select
                        {...register("userId")}
                        isClearable
                        value={selectedUser}
                        placeholder="Chọn nhân viên CSKH"
                        onChange={(data) => {
                            setSelectedUser(data);
                            setValue("userId", data);
                        }}
                        options={optionsUser}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label>Loại tài khoản</label>
                    <Select
                        {...register("clientType")}
                        isClearable
                        isMulti
                        value={selectedClientType}
                        placeholder="Chọn loại tài khoản"
                        onChange={(data) => {
                            setSelectedClientType(data);
                            setValue("clientType", data);
                        }}
                        options={optionsClientTypes}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Mở khóa/ Khóa</label>
                    <div>
                        <div className="switch-button switch-button-xs switch-button-yesno">
                            <input
                                type="checkbox"
                                checked={checkActive}
                                name="isActive"
                                id="isActive"
                                ref={register()}
                                onChange={() => setCheckActive(prev => !prev)}
                            />
                            <span><label htmlFor="isActive"></label></span>
                        </div>
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label>Xác thực</label>
                    <div>
                        <div className="switch-button switch-button-xs switch-button-yesno">
                            <input
                                type="checkbox"
                                checked={checkConfirm}
                                name="isConfirm"
                                id="isConfirm"
                                ref={register()}
                                onChange={() => setCheckConfirm(prev => !prev)}
                            />
                            <span><label htmlFor="isConfirm"></label></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="form-group col-md-12">
                    <label>Ghi chú</label>
                    <textarea
                        className="form-control"
                        type="text"
                        name="info"
                        defaultValue={updateItem?.info}
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