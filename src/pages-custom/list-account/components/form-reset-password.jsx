import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";

export default function FormResetPassword(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    useEffect(() => {

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
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}