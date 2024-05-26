import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import { optionsPromotionConditions, optionsPromotions } from '../../constant';
import { getUserInfo } from '../../../utils/configuration';

export default function FormAddEditClientNote(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem, onSubmitAddEdit,
        client, users, fromClient
     } = props;
    const buttonSubmitRef = useRef(null);
    const userInfo = getUserInfo();

    const { register, handleSubmit, errors, setValue, control, getValues } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const [optionsUser] = useState(users ? users.map(item => {return {label: item.fullName, value: item.id}}) : []);
    const [selectedUser, setSelectedUser] = useState(null);

    const [optionsClient] = useState(client ? client.map(item => {return {label: item.name, value: item.id}}) : []);
    const [selectedClient, setSelectedClient] = useState(null);
    
    useEffect(() => {
        if ( !fromClient ) {
            setValue("note", updateItem?.note);
            if (updateItem?.userId) {
                const foundUser = optionsUser.find(item => item.value === updateItem.userId);
                if (foundUser) {
                    setSelectedUser(foundUser);
                }
                setValue("userId", updateItem.userId);
            }
            if (updateItem?.clientId) {
                const foundClient = optionsClient.find(item => item.value === updateItem.clientId);
                if (foundClient) {
                    setSelectedClient(foundClient);
                }
                setValue("clientId", updateItem.clientId);
            }
        } else {

        }
        
    }, [])

    const onSubmit = (data) => {
        if (!data) {
          return;
        }

        let dataSubmit = {...data};

        if ( !fromClient ) {
            dataSubmit.id = updateItem?.id
            if ( dataSubmit.clientId ) dataSubmit.clientId = dataSubmit.clientId.value;
            if ( dataSubmit.userId ) dataSubmit.userId = dataSubmit.userId.value;
        } else {
            dataSubmit.clientId = updateItem.id;
            dataSubmit.userId = userInfo.id
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
            {
                !fromClient ? (
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label>Khách hàng <span className='required'>*</span></label>
                            <Select
                                {...register("clientId", {required: true})}
                                isClearable
                                value={selectedClient}
                                placeholder="Chọn khách hàng"
                                onChange={(data) => {
                                    setSelectedClient(data);
                                    setValue("clientId", data);
                                }}
                                options={optionsClient}
                                noOptionsMessage={() => "Không tồn tại"}
                            />
                            {errors.clientId && errors.clientId.type === "required" && (
                            <span className="error">Trường này là bắt buộc</span>
                            )}
                        </div>
                        <div className="form-group col-md-6">
                            <label>Nhân viên <span className='required'>*</span></label>
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
                ) : <></>
            }
            

            <div className="row">
                <div className="form-group col-md-12">
                    <label>Ghi chú <span className='required'>*</span></label>
                    <textarea
                        className="form-control"
                        type="text"
                        name="note"
                        defaultValue={updateItem?.note}
                        maxLength="200"
                        placeholder="Nhập nội dung"
                        ref={register({required: true})}
                        style={{height: '150px'}}
                    />
                </div>
                {errors.userId && errors.userId.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                    )}
            </div>
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                    Lưu
            </button>
        </form>
    )
}