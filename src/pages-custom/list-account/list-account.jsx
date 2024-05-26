import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as appActions from "../../core/app.store";
import * as config from '../../common/config'

import headCellsListAccount from './head-cell-list-account';

import * as viVN from "../../language/vi-VN.json";
import { NotificationMessageType } from "../../utils/configuration";
import ShowNotification from "../../components/react-notifications/react-notifications";

import * as userManagementAction from "../../redux/store/user-management/user-management.store";
import * as roleManagementAction from "../../redux/store/role/role-management.store";

import ModalSubmitForm from '../../components/custom-modal/modal-submit-form/modal-submit-form';
import dayjs from 'dayjs';
import ModalConfirm from '../../components/custom-modal/modal-confirm/modal-confirm';

import FormAddEditAccount from './components/form-add-edit-account';
import DataTableCustom from '../../components/datatable-custom';
import { mediaUrl } from '../../api/api-service-custom';
import FormResetPassword from './components/form-reset-password';

const configLocal = {
    defaultPageSize: config.Configs.DefaultPageSize,
    sortExpression: "modifiedDate desc",
    orderBy: "modifiedDate",
    order: "desc",
}

export default function AccountManagement() {
    const { register, handleSubmit, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    // START GET LOOK UP
    const [rolesLookup, setRolesLookup] = useState([]);
    const getLookupRoles = async () => {
        try {
            const res = await roleManagementAction.GetLookup();
            if (res && res.content) {
                setRolesLookup(res.content);
            }
        } catch (err) {
            setRolesLookup([]);
            throw err;
        }
    }

    const fetchData = async () => {
        showLoading(true);
        try {
            await Promise.allSettled([
                getLookupRoles(),
            ]);
        } catch (err) {
            err && err.errorType &&
                ShowNotification(
                    viVN.Errors[err.errorType],
                    NotificationMessageType.Error
                );
            showLoading(false);
        } finally {
        }
    }
    // END GET LOOK UP

    const [data, setData] = useState([])
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(configLocal.defaultPageSize);
    const [order, setOrder] = useState(configLocal.order);
    const [orderBy, setOrderBy] = useState(configLocal.orderBy);
    const [searchData, setSearchData] = useState();

    useEffect(() => {
        getListAccountManagement();
        fetchData();
    }, []);

    const getListAccountManagement = (pageIndex = 1, pageSize = configLocal.defaultPageSize, sortExpression = configLocal.sortExpression, search=undefined) => {
        showLoading(true);
        // setPage(pageIndex-1)
        userManagementAction.GetListUserManagement(pageIndex, pageSize, sortExpression, search).then(
            (res) => {
                if (res &&
                    res.content &&
                    res.content.items
                ) {
                    setData(res.content.items)
                    setTotalItemCount(res.content.totalItemCount)
                }
            },
            (err) => {
                err && err.errorType &&
                ShowNotification(
                    viVN.Errors[err.errorType],
                    NotificationMessageType.Error
                );
            }
        ).finally(() => {
            showLoading(false);
        })
    }
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        let sort = isAsc ? 'desc' : 'asc';
        let sortExpression = property + ' ' + sort;
        getListAccountManagement(page + 1, rowsPerPage, sortExpression, searchData);
        console.log(sortExpression);
    };
    
    const handleChangePage = (newPage) => {
        setPage(newPage - 1);
        let sortExpression = orderBy + ' ' + order;
        getListAccountManagement(newPage, rowsPerPage, sortExpression, searchData);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        let sortExpression = orderBy + ' ' + order;
        getListAccountManagement(1, event.target.value, sortExpression, searchData);
    };

    const handleSubmitAddEditAccount = async (data) => {
        showLoading(true);

        let formData = new FormData();
        data.id && formData.append("Id", data.id);
        formData.append("FullName", data.FullName);
        formData.append("Email", data.Email);
        formData.append("Roles", data.Roles);
        // data.Roles?.map((item) => {
        //     formData.append("Roles", item.label);  
        // })
        formData.append("DateOfBirth", data.DateOfBirth);
        formData.append("Sex", data.Sex);
        formData.append("Address", data.Address);
        // formData.append("Description", data.content);
        formData.append("PhoneNumber", data.PhoneNumber);
        // formData.append("reflectionUnitId", reflectionProcessingUnitSelected);
        // formData.append("planningUnitId", planningUnitSelected);

        try {
            let res = null;

            if( !data.id ) {
                res = await userManagementAction.CreateWithMultiRoles(formData);
            } else {
                res = await userManagementAction.UpdateWithMultiRoles(formData);
            }

            if (res && res.content) {
                if (!data.id)
                    ShowNotification(
                        viVN.Success["CreateSuccess"],
                        NotificationMessageType.Success
                    );
                else
                    ShowNotification(
                        viVN.Success["UpdateSuccess"],
                        NotificationMessageType.Success
                    );
                let sortExpression = orderBy + ' ' + order;
                getListAccountManagement(page + 1, rowsPerPage, sortExpression, searchData);
            }
        } catch (err) {
            showLoading(false);
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        }
    }

    const handleSubmitResetPassword = async (data) => {
        showLoading(true);

        try {
            let res = await userManagementAction.ResetPasswordUserManagement(data.id, data.password);

            if (res && res.content) {
                ShowNotification(
                    "Đổi mật khẩu người dùng thành công.",
                    NotificationMessageType.Success
                );
                let sortExpression = orderBy + ' ' + order;
                getListAccountManagement(page + 1, rowsPerPage, sortExpression, searchData);
            }
        } catch (err) {
            showLoading(false);
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        }
    }
     
    const buttonOpenAddEditRef = useRef();
    const buttonOpenConfirmRef = useRef();
    const [isOpenAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isOpenActiveDialog, setOpenActiveDialog] = useState(false);
    const [isOpenDeactiveDialog, setOpenDeactiveDialog] = useState(false);
    const [isOpenResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const openAddDialog = () => {
        setOpenAddEditDialog(true);
        buttonOpenAddEditRef.current.click();
    };
    const openEditDialog = (item) => {
        setOpenAddEditDialog(true);
        setSelectedItem(item);
        buttonOpenAddEditRef.current.click();
    }
    const closeAddEditDialog = () => {
        setOpenAddEditDialog(false);
        setSelectedItem(null);
    }

    const openResetPasswordDialog = (item) => {
        setOpenResetPasswordDialog(true);
        setSelectedItem(item);
        buttonOpenAddEditRef.current.click();
    }
    const closeResetPasswordDialog = () => {
        setOpenResetPasswordDialog(false);
        setSelectedItem(null);
    }

    const openConfirmDialog = (item) => {
        setSelectedItem(item);
        buttonOpenConfirmRef.current.click();
    }
    const closeConfirmDialog = () => {
        setOpenDeleteDialog(false);
        setOpenActiveDialog(false);
        setOpenDeactiveDialog(false);
        setOpenResetPasswordDialog(false);
        setSelectedItem(null);
    }
    const handleConfirm = async () => {
        try {
            let res = null;

            if( isOpenDeleteDialog ) {
                res = await userManagementAction.DeleteUserManagement(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["DeleteSuccess"],
                    NotificationMessageType.Success
                );
            } else if (isOpenActiveDialog) {
                res = await userManagementAction.ActiveUser(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["ActiveSuccess"],
                    NotificationMessageType.Success
                );
            } else if (isOpenDeactiveDialog) {
                res = await userManagementAction.DeActiveUser(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["DeActiveSuccess"],
                    NotificationMessageType.Success
                );
            }

            if ( res ) {
                getListAccountManagement();
            }
            closeConfirmDialog();
        } catch (err) {
            showLoading(false);
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        }
    }

    const onSubmit = (data) => {
        setSearchData(data);
        let sortExpression = orderBy + ' ' + order;
        setPage(0);
        getListAccountManagement(1, rowsPerPage, sortExpression, data?.email);
    }

    return (
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <div className="form-group">
                                            <input
                                                id="email"
                                                className="form-control"
                                                type="text"
                                                name="email"
                                                defaultValue={searchData?.email}
                                                placeholder="Nhập email để tìm kiếm"
                                                ref={register()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 pl-0">
                                        <button type="submit" className="btn btn-space btn-primary">Tìm kiếm</button>
                                        <button className="btn btn-space btn-secondary" onClick={(e) => {
                                            setValue("email","");
                                        }}>Xóa lọc</button>
                                        <button
                                            className="btn btn-space btn-warning"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openAddDialog();
                                            }}
                                        >Thêm mới</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </form>
                <DataTableCustom
                    // button functions
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // head cells
                    headCells={headCellsListAccount}
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    // pagination
                    totalItemCount={totalItemCount}
                    setRowsPerPage={setRowsPerPage}
                    pageIndex={page}
                    handleChangePage={handleChangePage}
                >
                    <tbody>
                        {
                            data.length > 0 ?
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className='text-center'><span>{rowIndex + 1}</span></td>
                                    <td className='text-center'><span>{row.fullName}</span></td>
                                    <td className='text-center'><span>{row.email}</span></td>
                                    <td className='text-center'><span>{row.roleNames.join() == ''? 'Người dùng' : row.roleNames.join(', ')}</span></td>
                                    <td className='text-center'><span>{row.dateOfBirth ? dayjs(row.dateOfBirth).format("DD/MM/YYYY") : ''}</span></td>
                                    <td className='text-center'><span>{row.sex ? "Nam" : "Nữ"}</span></td>
                                    <td className='text-center'><span>{row.phoneNumber}</span></td>
                                    <td className='text-center'><span>{row.address}</span></td>
                                    {/* <td className='text-center'><span>{row.avatar ? <img src={`${mediaUrl}/${row.avatar}`}/> : <></>}</span></td> */}
                                    <td className='text-center'><span>{row.modifiedDate ? dayjs(row.modifiedDate).format("DD/MM/YYYY hh:mm:ss") : ''}</span></td>
                                    <td align="center">
                                        <span>
                                            {row.status ? (
                                                <img title="Đang kích hoạt" style={{ cursor: 'pointer' }}
                                                    src={require("../../assets/icon/tick.png")}
                                                    alt="Tick" onClick={() => {
                                                        
                                                    }}
                                                />
                                            ) : (
                                                <img title="Ngưng kích hoạt" style={{ cursor: 'pointer' }}
                                                    src={require("../../assets/icon/cancel.png")}
                                                        alt="Cancel" onClick={() => {
                                                            
                                                        }}
                                                />
                                            )}
                                        </span>
                                    </td>

                                    <td className='text-center'>
                                        <div className='d-flex'>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table edit" data-toggle="tooltip" data-placement="top"
                                                title="Sửa"
                                                onClick={() => {openEditDialog(row)}}
                                            >
                                                <i className="far fa-edit"></i>
                                            </button>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table delete" data-toggle="tooltip" data-placement="top"
                                                title="Xóa"
                                                onClick={() => {
                                                    setOpenDeleteDialog(true);
                                                    openConfirmDialog(row);
                                                }}
                                            >
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                            <button className={`d-inline-block btn btn-sm btn-outline-light custom-button-table ${row.status ? 'lock' : 'unlock'}`} data-toggle="tooltip" data-placement="top"
                                                title={row.status ? 'Khóa' : 'Mở khóa'}
                                                onClick={() => {
                                                    if ( row.status ) {
                                                        setOpenDeactiveDialog(true);
                                                        openConfirmDialog(row);
                                                    } else {
                                                        setOpenActiveDialog(true);
                                                        openConfirmDialog(row);
                                                    }
                                                }}
                                            >
                                                {row.status ? (
                                                    <i className="fas fa-lock"></i>
                                                ) : (
                                                    <i className="fas fa-lock-open"></i>
                                                )}
                                            </button>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table change-pass-account" data-toggle="tooltip" data-placement="top"
                                                title="Đặt lại mật khẩu"
                                                onClick={() => {
                                                    openResetPasswordDialog(row);
                                                }}
                                            >
                                                <i className="fas fa-key"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            <tr><td colSpan={10}>Chưa có dữ liệu</td></tr>
                        }
                    </tbody>
                </DataTableCustom>
            </div>
            <button ref={buttonOpenAddEditRef} type="button" className="d-none" data-toggle="modal" data-target="#modalSubmitForm">
                Launch modal add edit
            </button>
            <button ref={buttonOpenConfirmRef} type="button" className="d-none" data-toggle="modal" data-target="#modalConfirm">
                Launch modal confirm
            </button>
            <ModalSubmitForm
                title={!isOpenResetPasswordDialog ? (!selectedItem ? "Thêm mới tài khoản" : "Chỉnh sửa tài khoản") : "Đổi mật khẩu tài khoản"}
                open={isOpenAddEditDialog || isOpenResetPasswordDialog}
                onClose={() => {
                    if ( !isOpenResetPasswordDialog ) {
                        closeAddEditDialog();
                    } else {
                        closeResetPasswordDialog();
                    }
                }}
            >
                {
                    !isOpenResetPasswordDialog ? (
                        <FormAddEditAccount
                            rolesLookup={rolesLookup}
                            // ===
                            updateItem={selectedItem}
                            onSubmitAddEdit={handleSubmitAddEditAccount}
                        />
                    ) : (
                        <FormResetPassword
                            updateItem={selectedItem}
                            onSubmitAddEdit={handleSubmitResetPassword}
                        />
                    )
                }
                
            </ModalSubmitForm>

            <ModalConfirm 
                title={"Xác nhận"}
                prompt={
                    isOpenDeleteDialog ? "Bạn có chắc chắn muốn xóa bản ghi này không?":
                    isOpenActiveDialog ? "Bạn có chắc chắn muốn mở khóa bản ghi này không?":
                    isOpenDeactiveDialog ? "Bạn có chắc chắn muốn khóa bản ghi này không?": ""
                }
                open={isOpenDeleteDialog || isOpenActiveDialog || isOpenDeactiveDialog }
                onClose={closeConfirmDialog}
                onConfirm={handleConfirm}
            />
        </div>
    )
}