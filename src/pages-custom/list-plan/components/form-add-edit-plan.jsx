import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsPromotionConditions, optionsPromotions } from '../../constant';

export default function FormAddEditPlan(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit } = props;
    const buttonSubmitRef = useRef(null);

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const [checkActive, setCheckActive] = useState(true);
    
    useEffect(() => {
        setCheckActive(updateItem?.isShow);
        setValue("name", updateItem?.name);
        setValue("price", updateItem?.price);
        setValue("promotion", updateItem?.promotion);
        setValue("promotionConditions", updateItem?.promotionConditions);
        setValue("endDate", updateItem?.endDate ? dayjs(updateItem?.endDate).format() : null);
        setValue("info", updateItem?.info);
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
                    <label>Gói đăng ký <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={updateItem?.name}
                        maxLength="150"
                        placeholder="Nhập tên gói đăng ký"
                        ref={register({ required: true, maxLength:150 })}
                    />
                    {errors.name && errors.name.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.name && (errors.name.type === "maxLength") && (
                        <span className="error">Độ dài không vượt quá 150 ký tự</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Giá (VNĐ) <span className='required'>*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        name="price"
                        defaultValue={updateItem?.price}
                        maxLength="10"
                        placeholder="Nhập giá gói đăng ký"
                        ref={register({ required: true, pattern: /^[0-9]+$/, })}
                    />
                    {errors.price && errors.price.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.price && errors.price.type === "pattern" && (
                      <span className="error">Giá trị không hợp lệ</span>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Điều kiện hưởng khuyến mãi</label>
                    <Select
                        {...register("promotionConditions")}
                        defaultValue={updateItem?.promotionConditions ? optionsPromotionConditions.filter(item => item.value == updateItem?.promotionConditions) : null}
                        // value={optionsCustomerStatus[0].value}
                        placeholder="Chọn điều kiện khuyến mãi"
                        closeMenuOnSelect={true}
                        onChange={(data) => setValue("promotionConditions", data ? data.value : null)}
                        options={optionsPromotionConditions}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label>Điều kiện hưởng khuyến mãi</label>
                    <Select
                        {...register("promotion")}
                        defaultValue={updateItem?.promotion ? optionsPromotions.filter(item => item.value == updateItem?.promotion) : null}
                        // value={optionsCustomerStatus[0].value}
                        placeholder="Chọn khuyến mãi"
                        closeMenuOnSelect={true}
                        onChange={(data) => setValue("promotion", data ? data.value : null)}
                        options={optionsPromotions}
                        noOptionsMessage={() => "Không tồn tại"}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group col-md-6">
                    <label>Ngày kết thúc khuyến mại</label>
                    <DatePicker
                        {...register("endDate")}
                        onChange={(data) => setValue("endDate", dayjs(data).format())}
                        defaultValue={updateItem?.endDate ? dayjs(updateItem?.endDate) : null}
                        className="form-control"
                        format='DD/MM/YYYY'
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    {errors.endDate && errors.endDate.type === "required" && (
                      <span className="error">Trường này là bắt buộc</span>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label>Hiển thị gói gia hạn</label>
                    <div>
                        <div className="switch-button switch-button-xs switch-button-yesno">
                            <input
                                type="checkbox"
                                checked={checkActive}
                                name="isShow"
                                id="isShow"
                                ref={register()}
                                onChange={() => setCheckActive(prev => !prev)}
                            />
                            <span><label htmlFor="isShow"></label></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label>Số lượng tài khoản zalo được dùng:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="numberOfZaloAccount"
                        maxLength="10"
                        placeholder="Số lượng tài khoản zalo được dùng"
                        ref={register({ required: true, pattern: /^[0-9]+$/, })}
                    />
                    {errors.numberOfZaloAccount && errors.numberOfZaloAccount.type === "required" && (
                        <span className="error">Trường này là bắt buộc</span>
                    )}
                    {errors.numberOfZaloAccount && errors.numberOfZaloAccount.type === "pattern" && (
                        <span className="error">Giá trị không hợp lệ</span>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-12">
                    <label>Thông tin khuyến mãi</label>
                    <textarea
                        className="form-control"
                        type="text"
                        name="info"
                        defaultValue={updateItem?.info}
                        maxLength="200"
                        placeholder="Nhập thông tin khuyến mãi"
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