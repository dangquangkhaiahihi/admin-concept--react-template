import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as appActions from "../../core/app.store";
import * as config from '../../common/config'

import headCellsListClient from './head-cell-list-client';

import * as viVN from "../../language/vi-VN.json";
import { NotificationMessageType } from "../../utils/configuration";
import ShowNotification from "../../components/react-notifications/react-notifications";

import * as orderManagementAction from "../../redux/store/order-management/order-management.store";
import * as userManagementAction from "../../redux/store/user-management/user-management.store";
import * as provinceManagementAction from "../../redux/store/province-management/province.store"
import * as planManagementAction from "../../redux/store/plan-management/plan-management.store";
import * as clientManagementAction from "../../redux/store/client-management/client-management.store";
import * as clientNoteManagementAction from "../../redux/store/client-note-management/client-note-management.store";

import ModalSubmitForm from '../../components/custom-modal/modal-submit-form/modal-submit-form';
import dayjs from 'dayjs';
import ModalConfirm from '../../components/custom-modal/modal-confirm/modal-confirm';

import FormAddEditClient from './components/form-add-edit-client';
import DataTableCustom from '../../components/datatable-custom';
import { mediaUrl } from '../../api/api-service-custom';
import { optionsClientTypes } from '../constant';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from "react-select";
import FormAddMoneyClient from './components/form-add-money-client';
import ModalCustom from '../../components/custom-modal/modal-custom/modal-cutom';
import FormAddEditOrder from '../list-order/components/form-add-edit-order';
import FormAddEditClientNote from '../list-client-note/components/form-add-edit-client-note';
import { uuidv4 } from '../../common/tools';

const configLocal = {
    defaultPageSize: config.Configs.DefaultPageSize,
    sortExpression: "modifiedDate desc",
    orderBy: "modifiedDate",
    order: "desc",
}

export default function ClientManagement() {
    const { register, handleSubmit, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const [uuidv4ModalConfirm] = useState(uuidv4());
    const [uuidv4ModalSubmitForm] = useState(uuidv4());

    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    const now = new Date();
    // START GET LOOK UP

    const [province, setProvince] = useState([]);
    const getLookupProvince = async () => {
       try {
           const res = await provinceManagementAction.GetLookupProvince();
           if (res && res.content) {
               setProvince(res.content);
           }
       } catch (err) {
           throw err;
       }
    };

    const [plan, setPlan] = useState([]);
    const getLookupPlan = () => {
        planManagementAction.GetListPlanManagement(1, 500).then(
            (res) => {
                if ( res && res.content && res.content.items ) {
                    setPlan(res.content.items)
                }
            },
            (err) => {
                throw err;
            }
        )
    }

    const [client, setClient] = useState([]);
    const getLookupClient = () => {
        clientManagementAction.GetLookupClient().then(
            (res) => {
                if ( res && res.content ) {
                    setClient(res.content)
                }
            },
            (err) => {
                throw err;
            }
        )
    }

    const [users, setUsers] = useState([]);
    const getLookupUser = () => {
        userManagementAction.GetListUserManagement(1, 500).then(
            (res) => {
                if ( res && res.content && res.content.items ) {
                    setUsers(res.content.items)
                }
            },
            (err) => {
                throw err;
            }
        )
    }

    const fetchData = async () => {
        showLoading(true);
        try {
            await Promise.allSettled([
                getLookupProvince(),
                getLookupPlan(),
                getLookupClient(),
                getLookupUser()
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
    // END GET LOOK UP

    const [data, setData] = useState([])
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(configLocal.defaultPageSize);
    const [order, setOrder] = useState(configLocal.order);
    const [orderBy, setOrderBy] = useState(configLocal.orderBy);
    const [searchData, setSearchData] = useState();

    useEffect(() => {
        GetListClientManagement();
        fetchData();
    }, []);

    const GetListClientManagement = (pageIndex = 1, pageSize = configLocal.defaultPageSize, sortExpression = configLocal.sortExpression, search=undefined) => {
        showLoading(true);
        // setPage(pageIndex-1)
        clientManagementAction.GetListClientManagement(pageIndex, pageSize, sortExpression, search).then(
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
        GetListClientManagement(page + 1, rowsPerPage, sortExpression, searchData);
        console.log(sortExpression);
    };
    
    const handleChangePage = (newPage) => {
        setPage(newPage - 1);
        let sortExpression = orderBy + ' ' + order;
        GetListClientManagement(newPage, rowsPerPage, sortExpression, searchData);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        let sortExpression = orderBy + ' ' + order;
        GetListClientManagement(1, event.target.value, sortExpression, searchData);
    };

    const handleSubmitAddEditClient = async (data) => {
        showLoading(true);

        try {
            let res = null;

            if( !data.id ) {
                res = await clientManagementAction.CreateClientManagement(data);
            } else {
                res = await clientManagementAction.UpdateClientManagement(data);
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
                GetListClientManagement(page + 1, rowsPerPage, sortExpression, searchData);
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
    
    const handleSubmitAddEditClientNote = async (data) => {
        showLoading(true);

        try {
            let res = await clientNoteManagementAction.CreateClientNoteManagement(data);

            ShowNotification(
                "Thêm ghi chú thành công",
                NotificationMessageType.Success
            );
            
        } catch (err) {
            showLoading(false);
            err && err.errorType &&
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        } finally {
            showLoading(false);
        }
    }

    const buttonOpenAddEditRef = useRef();
    const buttonOpenConfirmRef = useRef();
    const buttonOpenOrderRef = useRef();
    const buttonOpenClientNoteRef = useRef();
    const [isOpenAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isOpenActiveDialog, setOpenActiveDialog] = useState(false);
    const [isOpenDeactiveDialog, setOpenDeactiveDialog] = useState(false);
    const [isOpenAddMoney, setOpenAddMoney] = useState(false);
    const [isOpenAddClientNote, setOpenAddClientNote] = useState(false);
    const [isOpenCustom, setOpenCustom] = useState(false);

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

    const openAddMoneyDialog = (item) => {
        setOpenAddMoney(true);
        setSelectedItem(item);
        buttonOpenAddEditRef.current.click();
    }
    const closeAddMoneyDialog = () => {
        setOpenAddMoney(false);
        setSelectedItem(null);
    }

    const openAddClientNoteDialog = (item) => {
        setOpenAddClientNote(true);
        setSelectedItem(item);
        buttonOpenClientNoteRef.current.click();
    }
    const closeAddClientNoteDialog = () => {
        setOpenAddClientNote(false);
        setSelectedItem(null);
    }

    const openConfirmDialog = (item) => {
        setSelectedItem(item);
        buttonOpenConfirmRef.current.click();
    }
    const closeConfirmDialog = () => {
        setOpenActiveDialog(false);
        setOpenDeactiveDialog(false);
        setOpenDeleteDialog(false);
        setSelectedItem(null);
    }

    const openCustomDialog = (item) => {
        setOpenCustom(true);
        setSelectedItem(item);
        buttonOpenOrderRef.current.click();
    }
    const closeCustomDialog = () => {
        setOpenCustom(false);
        setSelectedItem(null);
    }
    const handleConfirm = async () => {
        try {
            let res = null;

            if( isOpenDeleteDialog ) {
                res = await clientManagementAction.DeleteClientManagement(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["DeleteSuccess"],
                    NotificationMessageType.Success
                );
            }

            if ( res ) {
                GetListClientManagement();
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
        
        const searchData = {...data};
        if ( searchData.ClientType ) searchData.ClientType = searchData.ClientType.value;
        if ( searchData.IsConfirm && Array.isArray(searchData.IsConfirm) && searchData.IsConfirm.length > 0 ) {
            searchData.IsConfirm = searchData.IsConfirm.map(item => item.value);
        }
        if ( searchData.IsActive && Array.isArray(searchData.IsActive) && searchData.IsActive.length > 0 ) {
            searchData.IsActive = searchData.IsActive.map(item => item.value);
        }
        GetListClientManagement(1, rowsPerPage, sortExpression, searchData);
    }

    const [isOpenAdvanceSearch, setIsOpenAdvanceSearch] = useState(false);

    return (
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>Tên khách hàng</label>
                                        <input
                                            id="Name"
                                            className="form-control"
                                            type="text"
                                            name="Name"
                                            defaultValue={searchData?.Name}
                                            placeholder="Nhập tên khách hàng để tìm kiếm"
                                            ref={register()}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Số điện thoại</label>
                                        <input
                                            id="PhoneNumber"
                                            className="form-control"
                                            type="text"
                                            name="PhoneNumber"
                                            defaultValue={searchData?.PhoneNumber}
                                            placeholder="Nhập số điện thoại để tìm kiếm"
                                            ref={register()}
                                        />
                                    </div>
                                    {/* <div className="form-group col-md-6">
                                        <label>Chọn nhân viên</label>
                                        <Select
                                            {...register("userId")}
                                            isClearable
                                            placeholder="Chọn nhân viên"
                                            onChange={(data) => {
                                                setValue("userId", data);
                                            }}
                                            options={users.map(item => {return {label: item.fullName, value: item.id}})}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div> */}
                                    <div className="form-group col-md-6">
                                        <label>Tên nhân viên</label>
                                        <input
                                            id="UserName"
                                            className="form-control"
                                            type="text"
                                            name="UserName"
                                            defaultValue={searchData?.UserName}
                                            placeholder="Nhập tên nhân viên để tìm kiếm"
                                            ref={register()}
                                        />
                                    </div>
                                </div>
                                <div className='row' style={{
                                    transition: 'height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    visibility: !isOpenAdvanceSearch ? "hidden" : "visible",
                                    opacity: !isOpenAdvanceSearch ? 0 : 1,
                                    height: !isOpenAdvanceSearch ? 0 : '77.7px',
                                }}>
                                    <div className="form-group col-md-4">
                                        <label>Loại tài khoản</label>
                                        <Select
                                            {...register("ClientType")}
                                            isClearable
                                            placeholder="Chọn loại tài khoản"
                                            onChange={(data) => {
                                                setValue("ClientType", data);
                                            }}
                                            options={optionsClientTypes}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label>Trạng thái</label>
                                        <Select
                                            {...register("IsActive")}
                                            isClearable
                                            isMulti
                                            placeholder="Chọn trạng thái"
                                            onChange={(data) => {
                                                setValue("IsActive", data);
                                            }}
                                            options={[{value: true, label: "Hoạt động"}, {value: false, label: "Khóa"}]}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label>Chọn trạng thái xác nhận</label>
                                        <Select
                                            {...register("IsConfirm")}
                                            isClearable
                                            isMulti
                                            placeholder="Chọn trạng thái xác nhận"
                                            onChange={(data) => {
                                                setValue("IsConfirm", data);
                                            }}
                                            options={[{value: 1, label: "Đã xác nhận"}, {value: 0, label: "Chưa xác nhận"}]}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-12 pl-0 d-flex justify-content-center">
                                        <button type="button" className={`btn btn-space ${!isOpenAdvanceSearch ? 'btn-info' : 'btn-secondary'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsOpenAdvanceSearch(prev => !prev)
                                            }}
                                        >
                                            {!isOpenAdvanceSearch ? <span>Nâng cao <i className='fas fa-caret-down'/></span> : <span>Đóng <i className='fas fa-caret-up'/></span>}
                                        </button>
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
                    headCells={headCellsListClient}
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
                                    <td className='text-center'>{rowIndex + 1}</td>
                                    <td className='text-center'>
                                        <div>{row.name}</div>
                                        <div>{row.phoneNumber}</div>
                                    </td>
                                    <td className='text-center'>
                                        <span>
                                            {row.provinceIds.map(item => province.filter(x => x.id === item).map((pv, index) => {
                                                return <div key={index}>- {pv.name}</div>
                                            }))}
                                        </span>
                                    </td>
                                    <td className='text-center'>
                                        <span>
                                            {row.clientType.map(item => optionsClientTypes.filter(x => x.value === item).map((ct, index) => {
                                                return <div key={index}>- {ct.label}</div>
                                            }))}
                                        </span>
                                    </td>
                                    <td className='text-center'><span>{row.totalMoney.toLocaleString()} VNĐ</span></td>
                                    <td className='text-center'><div className="badge mb-1">{row.start_date ? dayjs(row.start_date).format("DD/MM/YYYY hh:mm:ss") : ''}</div></td>
                                    <td className='text-center'>
                                        {
                                            row.end_date ? <>
                                                {
                                                    // Hết hạn => đen
                                                    dayjs(row.end_date).isBefore(dayjs(now)) ? (
                                                        <div className="badge mb-1 badge-dark">{dayjs(row.end_date).format("DD/MM/YYYY hh:mm:ss")}</div>
                                                    ) : <>
                                                        {
                                                            // Còn hạn < 3 ngày => đỏ
                                                            dayjs(row.end_date).diff(dayjs(now), 'days') <= 3 ? (
                                                                <div className="badge mb-1 badge-danger">{dayjs(row.end_date).format("DD/MM/YYYY hh:mm:ss")}</div>
                                                            ) : 
                                                            
                                                            // Còn hạn => xanh dương
                                                            <div className="badge mb-1 badge-primary">{dayjs(row.end_date).format("DD/MM/YYYY hh:mm:ss")}</div>
                                                        }
                                                    </>
                                                }
                                            </> : <></>
                                        }
                                    </td>
                                    <td className='text-center'><span>{row.userId ? users.find(x => x.id === row.userId)?.fullName : ''}</span></td>
                                    <td className='text-center'>
                                        <div className={`badge mb-1 ${row.isActive ? 'badge-primary' : 'badge-secondary'}`}>{row.isActive ? "Hoạt động" : "Không hoạt động"}</div>
                                        
                                        <div className={`badge ${row.isConfirm ? 'badge-success' : 'badge-warning'}`}>{row.isConfirm ? "Đã xác thực" : "Chưa xác thực"}</div>
                                    </td>
                                    <td className='text-center'><span>{row.created_date ? dayjs(row.created_date).format("DD/MM/YYYY") : ''}</span></td>

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
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table unlock" data-toggle="tooltip" data-placement="top"
                                                title="Nạp tiền"
                                                onClick={() => {openAddMoneyDialog(row)}}
                                            >
                                                <i className="far fa-money-bill-alt"></i>
                                            </button>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table create-client-note" data-toggle="tooltip" data-placement="top"
                                                title="Thêm ghi chú"
                                                onClick={() => {openAddClientNoteDialog(row)}}
                                            >
                                                <i className="icon-doc"></i>
                                            </button>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table cart" data-toggle="tooltip" data-placement="top"
                                                title="Gia hạn gói"
                                                onClick={() => {openCustomDialog(row)}}
                                            >
                                                <i className="fas fa-cart-plus"></i>
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
            <button ref={buttonOpenAddEditRef} type="button" className="d-none" data-toggle="modal" data-target={`#modalSubmitForm-${uuidv4ModalSubmitForm}`}>
                Launch modal add edit
            </button>
            <button ref={buttonOpenConfirmRef} type="button" className="d-none" data-toggle="modal" data-target={`#modalConfirm-${uuidv4ModalConfirm}`}>
                Launch modal confirm
            </button>
            <button ref={buttonOpenOrderRef} type="button" className="d-none" data-toggle="modal" data-target="#modalCustom-order">
                Launch modal confirm
            </button>
            <button ref={buttonOpenClientNoteRef} type="button" className="d-none" data-toggle="modal" data-target="#modalCustom-client-note">
                Launch modal confirm
            </button>
            
            <ModalSubmitForm
                id={uuidv4ModalSubmitForm}
                title={!isOpenAddMoney ? (!selectedItem ? "Thêm mới tài khoản khách hàng" : "Chỉnh sửa tài khoản khách hàng") : "Nạp tiền"}
                open={isOpenAddEditDialog || isOpenAddMoney}
                onClose={() => {
                    if ( !isOpenAddMoney ) {
                        closeAddEditDialog();
                    } else {
                        closeAddMoneyDialog();
                    }
                }}
            >
                {
                    !isOpenAddMoney ? (
                        <FormAddEditClient
                            province={province}
                            users={users}
                            // ===
                            updateItem={selectedItem}
                            onSubmitAddEdit={handleSubmitAddEditClient}
                        />
                    ) : (
                        <FormAddMoneyClient
                            // ===
                            updateItem={selectedItem}
                            onSubmitAddEdit={handleSubmitAddEditClient}
                        />
                    )
                }
            </ModalSubmitForm>

            <ModalCustom
                id={'order'}
                title={"Đăng ký gói mới"}
                open={isOpenCustom}
                onClose={closeCustomDialog}
            >
                <FormAddEditOrder
                    client={client}
                    users={users}
                    plan={plan}
                    // ===
                    updateItem={selectedItem}
                />
            </ModalCustom>

            <ModalCustom
                id={'client-note'}
                title={"Thêm ghi chú"}
                open={isOpenAddClientNote}
                onClose={closeAddClientNoteDialog}
            >
                <FormAddEditClientNote
                    fromClient
                    // ===
                    updateItem={selectedItem}
                    onSubmitAddEdit={handleSubmitAddEditClientNote}
                />
            </ModalCustom>

            <ModalConfirm
                id={uuidv4ModalConfirm}
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