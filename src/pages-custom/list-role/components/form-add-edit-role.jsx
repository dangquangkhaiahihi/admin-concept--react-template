import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";

export default function FormAddEditRole(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem,
        onSubmitAddEdit
    } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    
    useEffect(() => {
        setValue("name", updateItem?.name);
        setValue("code", updateItem?.code);
    }, [])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }
        
        onSubmitAddEdit({...data, id: updateItem?.id});
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
                    <label>Tên chức vụ <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={updateItem?.fullName}
                        maxLength="150"
                        placeholder="Nhập tên chức vụ"
                        ref={register({ required: true, maxLength:150 })}
                    />
                    {errors.name && errors.name.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Mã chức vụ</label>
                    <input
                        className="form-control"
                        type="text"
                        name="code"
                        defaultValue={updateItem?.email}
                        maxLength="150"
                        placeholder="Nhập mã chức vụ"
                        ref={register({ required: true, maxLength:500  })}
                        readOnly={updateItem?.id ? true : false}
                    />
                    {errors.code && errors.code.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
            </div>
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}