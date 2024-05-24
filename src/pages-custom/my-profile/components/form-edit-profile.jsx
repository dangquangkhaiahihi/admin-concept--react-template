import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";

export default function FormEditProfile(props) {
    const {  updateItem,
        onSubmitAddEdit
    } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    
    useEffect(() => {
        setValue("Id", updateItem?.id);
        setValue("FullName", updateItem?.fullName);
        setValue("Email", updateItem?.email);
        setValue("Sex", updateItem?.sex);
        setValue("PhoneNumber", updateItem?.phoneNumber);
        setValue("DateOfBirth", updateItem?.dateOfBirth ? dayjs(updateItem?.dateOfBirth).format() : null);

    }, [updateItem])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }
        
        onSubmitAddEdit({...data, Id: updateItem?.id});
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <input
                className="d-none"
                type="text"
                name="Id"
                defaultValue={updateItem?.id}
                ref={register()}
            />
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Họ và tên <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="FullName"
                        defaultValue={updateItem?.fullName}
                        maxLength="150"
                        placeholder="Nhập họ và tên"
                        ref={register({ required: true, maxLength:150 })}
                    />
                    {errors.FullName && errors.FullName.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Email</label>
                    <input
                        className="form-control"
                        type="text"
                        name="Email"
                        defaultValue={updateItem?.email}
                        maxLength="150"
                        // disabled={true}
                        ref={register()}
                        disabled
                    />
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Giới tính</label>
                    <select className="form-control" name="Sex" ref={register()} defaultValue={updateItem?.sex}>
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label>Số điện thoại</label>
                    <input
                        className="form-control"
                        type="text"
                        name="PhoneNumber"
                        defaultValue={updateItem?.phoneNumber}
                        maxLength="10"
                        placeholder="Nhập số điện thoại"
                        ref={register({ pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/  })}
                    />
                    {errors.PhoneNumber && errors.PhoneNumber.type === "pattern" && (
                      <span className="error">Số điện thoại không đúng đinh dạng</span>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Ngày sinh <span className='required'>*</span></label>
                    <DatePicker
                        {...register("DateOfBirth", { required: true })}
                        onChange={(data) => setValue("DateOfBirth", dayjs(data).format())}
                        value={dayjs(updateItem?.dateOfBirth)}
                        className="form-control"
                        format='DD/MM/YYYY'
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    {errors.DateOfBirth && errors.DateOfBirth.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Địa chỉ</label>
                    <input
                        className="form-control"
                        type="text"
                        name="Address"
                        defaultValue={updateItem?.address}
                        maxLength="200"
                        placeholder="Nhập địa chỉ"
                        ref={register()}
                    />
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-12">
                    <label>Mô tả</label>
                    <textarea
                        className="form-control"
                        type="text"
                        name="Description"
                        defaultValue={updateItem?.description}
                        maxLength="200"
                        placeholder="Nhập mô tả"
                        ref={register()}
                    />
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