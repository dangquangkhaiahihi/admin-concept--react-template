import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useForm } from "react-hook-form";
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
import Autocomplete from "@material-ui/lab/Autocomplete";

import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddIcon from "@material-ui/icons/Add";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

import * as config from "../../../common/config";
import * as securityMatrixAction from "../../../redux/store/security-matrix/security-matrix.store";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import * as appActions from "../../../core/app.store";


const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));

function ScreenRoleManagement(props) {
    const classes = useStyles();
    const {
        openAddDialog,
        onHideModal,
        roleId, showLoading
    } = props;

    const { register, handleSubmit, errors, clearErrors, setError,setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });


    const [projectList, setProjectList] = useState([]);
    const [screenLookUp, setScreenLookUp] = useState([]);
    const [actionLookup, setActionLookup] = useState([]);
    useEffect(() => {
        onGetData();
    }, [])

    const onGetData = () => {
        showLoading(true);
        Promise.all([
            getSecurityMatrixDetail(roleId),
            GetScreenLookup(),
            GetActionLookup(),
        ])
            .then((res) => {
                const [
                    _securityMatrixDetail,
                    _screenLookUp,
                    _actionLookup
                ] = res;
                if(_securityMatrixDetail && _securityMatrixDetail.content && _securityMatrixDetail.content.length > 0) {
                    setProjectList(_securityMatrixDetail.content);
                    _securityMatrixDetail.content.map((item,index) => {
                        setValue(`combo-box-group-${index}`,"1");
                        clearErrors(`combo-box-group-${index}`);
                    }) 
                };
                _screenLookUp && _screenLookUp.content && _screenLookUp.content.length > 0 && setScreenLookUp(_screenLookUp.content);
                _actionLookup && _actionLookup.content && _actionLookup.content.length > 0 && setActionLookup(_actionLookup.content);
                showLoading(false);
            })
            .catch((err) => {
                showLoading(false);
            });
    };

    const getSecurityMatrixDetail = (roleId) => {
        return new Promise((resolve, reject) => {
            securityMatrixAction.GetSecurityMatrixDetail(roleId).then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    err &&
                        err.errorType &&
                        ShowNotification(
                            viVN.Errors[err.errorType],
                            NotificationMessageType.Error
                        );
                }
            );
        });
    };
    const GetScreenLookup = () => {
        return new Promise((resolve, reject) => {
            securityMatrixAction.GetScreenLookup().then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    err &&
                        err.errorType &&
                        ShowNotification(
                            viVN.Errors[err.errorType],
                            NotificationMessageType.Error
                        );
                }
            );
        });
    };
    const GetActionLookup = () => {
        return new Promise((resolve, reject) => {
            securityMatrixAction.GetActionLookup().then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    err &&
                        err.errorType &&
                        ShowNotification(
                            viVN.Errors[err.errorType],
                            NotificationMessageType.Error
                        );
                }
            );
        });
    };


    const onSubmit = (_data) => {
        if (!_data) return;
        let data = {
            roleId: roleId,
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
                onHideModal();
            }
            showLoading(false);
        }).catch((err) => {
            showLoading(false);
            ShowNotification(err && err.errorType && viVN.Errors[err && err.errorType], NotificationMessageType.Error);
        })
    };

    const handleOnchange = (event, newValue, index) => {
        if (newValue) {
            const list = [...projectList];
            list[index]["screenId"] = newValue.id;
            list[index]["screenName"] = newValue.name;
            setProjectList(list);
        }
    };

    const handleOnchangeGroup = (event, newValue, index) => {
        console.log("index", index);
        if (newValue) {
            const list = [...projectList];
            const action = newValue.length > 0 && newValue.map(item => { return { actionId: item.id, actionName: item.name } })
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
        <div>
            <Dialog
                open={openAddDialog}
                onClose={onHideModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle disableTypography>
                    <Typography variant="h6">{"Phân quyền màn hình"}</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onHideModal}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent className="pt-4 pb-4" dividers>
                        {projectList && projectList.length > 0 ? (
                            <div>
                                {projectList.map((item, index) => {
                                    return (
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
                                                        <Autocomplete
                                                            id={`combo-box-group-${index}`}
                                                            label="Hành động"
                                                            options={actionLookup}
                                                            limitTags={3}
                                                            getOptionLabel={(option) => option.name}
                                                            fullWidth
                                                            multiple
                                                            disableClearable={true}
                                                            onChange={(event, newValue) =>
                                                                handleOnchangeGroup(event, newValue, index)
                                                            }
                                                            value={item.actions.length > 0 ? item.actions.filter(p => p.actionId !== 0 && p.actionName)?.map(p => {
                                                                return {
                                                                    id: p.actionId,
                                                                    name: p.actionName
                                                                }
                                                            }) : []}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Hành động"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    error={
                                                                        errors[`combo-box-group-${index}`] &&
                                                                        errors[`combo-box-group-${index}`].type ===
                                                                        "required"
                                                                    }
                                                                />
                                                            )}
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
                                    );
                                })}

                                <div className="row offset-1 align-items-center">
                                    <div className="col-lg-11">
                                        <a
                                            className="button-add-click"
                                            onClick={handleAddClick}
                                        >
                                            <AddIcon className="mt-n1" />
                                            {"Thêm mới màn hình"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                                <div>
                                    <div className="text-danger text-center">
                                        <HighlightOffIcon className="mt-n1 mr-1" />
                                        {"Không có bản ghi nào"}
                                    </div>
                                </div>
                            )}
                    </DialogContent>
                    <DialogActions className="border-top row p-3">
                        <Button
                            onClick={handleAddClick}
                            variant="contained"
                            startIcon={<AddBoxIcon />}
                            className="bg-success text-white col-lg-3 m-0 mr-2 mb-2"
                            hidden={projectList && projectList.length > 0}
                        >
                            Thêm màn hình
                        </Button>
                        <Button
                            className="col-lg-3  m-0 mr-2 mb-2"
                            onClick={onHideModal}
                            variant="contained"
                            startIcon={<CloseIcon />}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="col-lg-3  m-0 mr-2 mb-2"
                            type="submit"
                            color="primary"
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            {config.EmailConfig.update}
                        </Button>
                    </DialogActions>
                </form>
      </Dialog>
        </div>
    );
}
const mapStateToProps = (state) => ({
    isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            showLoading: appActions.ShowLoading,
        },
        dispatch
    );
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenRoleManagement);
