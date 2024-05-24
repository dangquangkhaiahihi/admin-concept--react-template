import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";

export default function FormAddEditAccount(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit,
        rolesLookup
     } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const [optionsRole] = useState(rolesLookup.map(item => {return {label: item.name, value: item.id}}));
    const [selectedRoles, setSelectedRoles] = useState([]);
    
    useEffect(() => {
        setValue("FullName", updateItem?.fullName);
        setValue("Email", updateItem?.email);

        setValue("DateOfBirth", updateItem?.dateOfBirth ? dayjs(updateItem?.dateOfBirth).format() : null);

        if (updateItem?.roleNames && Array.isArray(updateItem.roleNames)) {
            const filtered = optionsRole.filter(item => {
                return updateItem.roleNames.includes(item.label)
            });
            setSelectedRoles(filtered);
            setValue("Roles", filtered);
        }
    }, [])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }
        
        onSubmitAddEdit({...data, id: updateItem?.id,
            Roles: getValues("Roles").map(item => item.label)
        });
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
                        name="FullName"
                        defaultValue={updateItem?.fullName}
                        maxLength="150"
                        placeholder="Nhập tên"
                        ref={register({ required: true, maxLength:150 })}
                    />
                    {errors.FullName && errors.FullName.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.FullName && (errors.FullName.type === "maxLength") && (
                        <span className="error">Độ dài không vượt quá 150 ký tự</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Email</label>
                    <input
                        className="form-control"
                        type="text"
                        name="Email"
                        defaultValue={updateItem?.email}
                        maxLength="500"
                        placeholder="Nhập email"
                        ref={register({ required: true, maxLength:500  })}
                    />
                    {errors.Email && errors.Email.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.Email && (errors.Email.type === "maxLength") && (
                        <span className="error">Độ dài không vượt quá 500 ký tự</span>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Chức vụ <span className='required'>*</span></label>
                    <Select
                        {...register("Roles", {required: true})}
                        isClearable
                        isMulti
                        value={selectedRoles}
                        placeholder="Chọn chức vụ"
                        onChange={(data) => {
                            setSelectedRoles(data);
                            setValue("Roles", data);
                        }}
                        options={optionsRole}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                    {errors.Roles && errors.Roles.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Ngày sinh <span className='required'>*</span></label>
                    <DatePicker
                        {...register("DateOfBirth", { required: true })}
                        onChange={(data) => setValue("DateOfBirth", dayjs(data).format())}
                        defaultValue={updateItem?.dateOfBirth ? dayjs(updateItem?.dateOfBirth) : null}
                        className="form-control"
                        format='DD/MM/YYYY'
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    {errors.DateOfBirth && errors.DateOfBirth.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
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
                        ref={register({ required: true, pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/  })}
                    />
                    {errors.PhoneNumber && errors.PhoneNumber.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.PhoneNumber && errors.PhoneNumber.type === "pattern" && (
                      <span className="error">Số điện thoại không đúng đinh dạng</span>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Địa chỉ</label>
                    <input
                        className="form-control"
                        type="text"
                        name="Address"
                        defaultValue={updateItem?.address}
                        maxLength="10"
                        placeholder="Nhập địa chỉ"
                        ref={register()}
                    />
                </div>
                {/* <div className="form-group col-md-6">
                    <label>Ảnh đại diện</label>
                    <input
                        className="note-image-input form-control-file note-form-control note-input"
                        type="file"
                        name="avaImage"
                        ref={register()}
                        accept="image/*"
                    />
                </div> */}
            </div>
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}