import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsPromotionConditions, optionsPromotions } from '../../constant';
import { getUserInfo } from '../../../utils/configuration';

export default function FormAddEditGroup(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit,
        fromClient
     } = props;
    const buttonSubmitRef = useRef(null);
    const userInfo = getUserInfo();

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    
    useEffect(() => {
        setValue("name", updateItem?.name);
    }, [])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }

        let dataSubmit = {...data, id: updateItem?.id};
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
                <div className="form-group col-md-12">
                    <label>Tên nhóm <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={updateItem?.name}
                        maxLength="200"
                        placeholder="Nhập tên nhóm"
                        ref={register({required: true})}
                    />
                </div>
                {errors.name && errors.name.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                )}
            </div>
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}