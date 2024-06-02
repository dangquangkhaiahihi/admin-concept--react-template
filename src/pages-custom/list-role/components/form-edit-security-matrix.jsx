import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Select from "react-select";
import * as securityMatrixAction from "../../../redux/store/security-matrix/security-matrix.store";
import * as appActions from "../../../core/app.store";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";

import * as viVN from "../../../language/vi-VN.json";
import { NotificationMessageType } from "../../../utils/configuration";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddIcon from "@material-ui/icons/Add";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch } from 'react-redux';

export default function FormEditSecurityMatrix(props) {
    const { triggerSubmit, setTriggerSubmit, onCloseModal, updateItem,
        screenLookUp, actionLookup,
        onSubmitAddEdit
    } = props;
    const buttonSubmitRef = useRef(null);

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    const { register, handleSubmit, errors, setValue, control, getValues, setError, clearErrors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    
    const [projectList, setProjectList] = useState([]);
    
    const getSecurityMatrixDetail = async (roleId) => {
        showLoading(true);
        try {
            const res = await securityMatrixAction.GetSecurityMatrixDetail(roleId);
            if(res && res.content && res.content.length > 0) {
                console.log("clgt");
                setProjectList(res.content);
                res.content.map((item,index) => {
                    setValue(`combo-box-group-${index}`,"1");
                    clearErrors(`combo-box-group-${index}`);
                }) 
            };
        } catch (err) {
            err && err.errorType &&
                ShowNotification(
                    viVN.Errors[err.errorType],
                    NotificationMessageType.Error
                );
        } finally {
            showLoading(false);
        }
    };

    useEffect(() => {
        if ( !updateItem ) return;
        getSecurityMatrixDetail(updateItem.id);
    }, [updateItem])

    const onSubmit = (_data) => {
        console.log("_data_data_data_data_data_data_data_data_data_data_data_data_data", _data);
        if (!_data) return;
        let data = {
            roleId: updateItem?.id,
            screens: projectList.map((item) => {
                return {
                    screenId: item.screenId, actions: item.actions && item.actions.length > 0 ? item.actions.map((actionItem) => {
                        return { actionId: actionItem.actionId }
                    }) : []
                }
            })
        }
        securityMatrixAction.UpdateSecurityMatrix(data).then((res) => {
            if (res && res.content) {
                ShowNotification(
                    "Cập nhập quyền cho các màn hình thành công!", NotificationMessageType.Success
                )
                onCloseModal();
            }
            showLoading(false);
        }).catch((err) => {
            showLoading(false);
            ShowNotification(err && err.errorType && viVN.Errors[err && err.errorType], NotificationMessageType.Error);
        })
    };

    useEffect(()=>{
        if (!triggerSubmit) return;
        buttonSubmitRef.current.click();
        setTriggerSubmit(false);
    }, [triggerSubmit])

    const handleOnchange = (event, newValue, index) => {
        if (newValue) {
            const list = [...projectList];
            list[index]["screenId"] = newValue.id;
            list[index]["screenName"] = newValue.name;
            setProjectList(list);
        }
    };

    const handleOnchangeGroup = (newValue, index) => {
        console.log("index", index);
        if (newValue) {
            const list = [...projectList];
            const action = newValue.length > 0 && newValue.map(item => { return { actionId: item.value, actionName: item.label } })
            // const action = newValue.length > 0 && newValue.map(item => { return { value: item.id, label: item.name } })

            console.log(action, newValue, index);
            if (action.length === 0) {
                setValue(`combo-box-group-${index}`,"");
                setError(`combo-box-group-${index}`, { required: true });
            }
            else {
                setValue(`combo-box-group-${index}`,"11");
                clearErrors(`combo-box-group-${index}`)
            }
            list[index]["actions"] = action || [];
            setProjectList(list);
        }
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        console.log("index", index);
        const list = [...projectList];
        list.splice(index, 1);
        setProjectList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setProjectList([
            ...projectList,
            {
                screenId: 0,
                screenName: "",
                actions: [{
                    actionId: 0,
                    actionName: ""
                }]
            },
        ]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <form onSubmit={handleSubmit(onSubmit)}>
                {projectList && projectList.length > 0 ? (
                    <>
                        {projectList.map((item, index) => (
                            <div className="row offset-1 mb-2">
                                <div className="col-lg-5 mb-3" id={"index" + index}>
                                    {screenLookUp &&
                                        screenLookUp.length > 0 && (
                                            <Autocomplete
                                                groupBy={(item) => item.parentName}
                                                id={`combo-box-demo-${item.id}`}
                                                options={screenLookUp}
                                                getOptionLabel={(option) => option.name}
                                                fullWidth
                                                onChange={(event, newValue) =>
                                                    handleOnchange(event, newValue, index)
                                                }
                                                value={{
                                                    id: item.screenId,
                                                    name: item.screenName,
                                                }}
                                                disableClearable={true}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Màn hình phân quyền"
                                                        name={`screenRole${index}`}
                                                        inputRef={register({ required: true })}
                                                        size="small"
                                                        variant="outlined"
                                                        error={
                                                            errors[`screenRole${index}`] &&
                                                            errors[`screenRole${index}`].type ===
                                                            "required"
                                                        }
                                                    />
                                                )}
                                            />
                                        )}
                                </div>
                                <div className="col-lg-5">
                                    {actionLookup &&
                                        actionLookup.length > 0 && (
                                            // <Autocomplete
                                            //     id={`combo-box-group-${index}`}
                                            //     label="Hành động"
                                            //     options={actionLookup}
                                            //     limitTags={3}
                                            //     getOptionLabel={(option) => option.name}
                                            //     fullWidth
                                            //     multiple
                                            //     disableClearable={true}
                                            //     onChange={(event, newValue) =>
                                            //         handleOnchangeGroup(event, newValue, index)
                                            //     }
                                            //     value={item.actions.length > 0 ? item.actions.filter(p => p.actionId !== 0 && p.actionName)?.map(p => {
                                            //         return {
                                            //             id: p.actionId,
                                            //             name: p.actionName
                                            //         }
                                            //     }) : []}
                                            //     renderInput={(params) => (
                                            //         <TextField
                                            //             {...params}
                                            //             label="Hành động"
                                            //             size="small"
                                            //             variant="outlined"
                                            //             error={
                                            //                 errors[`combo-box-group-${index}`] &&
                                            //                 errors[`combo-box-group-${index}`].type ===
                                            //                 "required"
                                            //             }
                                            //         />
                                            //     )}
                                            // />

                                            <Select
                                                isClearable
                                                isMulti
                                                value={item.actions.length > 0 ? item.actions.filter(p => p.actionId !== 0 && p.actionName)?.map(p => {
                                                    return {
                                                        value: p.actionId,
                                                        label: p.actionName
                                                    }
                                                }) : []}
                                                placeholder="Chọn hành động"
                                                onChange={(data) => {
                                                    console.log("data", data);
                                                    handleOnchangeGroup(data, index)
                                                }}
                                                options={actionLookup.map(item => {return {label: item.name, value: item.id}})}
                                                noOptionsMessage={() => "Không tồn tại"}
                                            />
                                        )}
                                    <TextField
                                        name={`combo-box-group-${index}`}
                                        hidden
                                        inputRef={register({ required: true })}
                                    />
                                </div>
                                <div className="col-lg-1">
                                    {
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                handleRemoveClick(index);
                                            }}
                                        >
                                            <IndeterminateCheckBoxIcon />
                                        </IconButton>
                                    }
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div>
                        <div className="text-danger text-center d-flex align-items-center justify-content-center">
                            <HighlightOffIcon className="mt-n1 mr-1" />
                            {"Không có bản ghi nào"}
                        </div>
                    </div>
                )}
                
                <div className="row align-items-center">
                    <div className="col-lg-11">
                        <a className="button-add-click align-items-center d-flex justify-content-center" href='#'
                            style={{cursor: 'pointer'}}
                            onClick={handleAddClick}
                        >
                            <AddIcon className="mt-n1" />
                            {"Thêm mới màn hình"}
                        </a>
                    </div>
                </div>
            </form>
            
            <button ref={buttonSubmitRef} style={{display: "none"}} type="submit" className="btn btn-primary">
                Lưu
            </button>
        </form>
    )
}