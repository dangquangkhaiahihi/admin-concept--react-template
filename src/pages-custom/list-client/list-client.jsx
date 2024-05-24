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
    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    // START GET LOOK UP

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

    const handleSubmitAddEditAccount = async (data) => {
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
     
    const buttonOpenAddEditRef = useRef();
    const buttonOpenConfirmRef = useRef();
    const buttonOpenCustomRef = useRef();
    const [isOpenAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isOpenActiveDialog, setOpenActiveDialog] = useState(false);
    const [isOpenDeactiveDialog, setOpenDeactiveDialog] = useState(false);
    const [isOpenAddMoney, setOpenAddMoney] = useState(false);
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

    const openConfirmDialog = (item) => {
        setSelectedItem(item);
        buttonOpenConfirmRef.current.click();
    }
    const closeConfirmDialog = () => {
        setOpenActiveDialog(false);
        setOpenDeactiveDialog(false);
        setSelectedItem(null);
    }

    const openCustomDialog = (item) => {
        setOpenCustom(true);
        setSelectedItem(item);
        buttonOpenCustomRef.current.click();
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
                                    <div className="form-group col-md-6">
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
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Chọn Tỉnh/ Thành phố</label>
                                        <Select
                                            {...register("provinceId")}
                                            isClearable
                                            placeholder="Chọn Tỉnh/ Thành phố"
                                            onChange={(data) => {
                                                console.log(data);
                                                setValue("provinceId", data);
                                            }}
                                            options={province.map(item => {return {label: item.name, value: item.id}})}
                                            noOptionsMessage={() => "Không tồn tại"}
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
                                    <td><span>{row.name}</span></td>
                                    <td>
                                        <span>
                                            {row.provinceIds.map(item => province.filter(x => x.id === item).map((pv, index) => {
                                                return <div key={index}>- {pv.name}</div>
                                            }))}
                                        </span>
                                    </td>
                                    <td>
                                        <span>
                                            {row.clientType.map(item => optionsClientTypes.filter(x => x.value === item).map((ct, index) => {
                                                return <div key={index}>- {ct.label}</div>
                                            }))}
                                        </span>
                                    </td>
                                    <td><span>{row.totalMoney} VNĐ</span></td>
                                    <td><span>{row.userId ? users.find(x => x.id === row.userId)?.fullName : ''}</span></td>
                                    <td>
                                        <div className={`badge mb-1 ${row.isActive ? 'badge-primary' : 'badge-secondary'}`}>{row.isActive ? "Hoạt động" : "Không hoạt động"}</div>
                                        
                                        <div className={`badge ${row.isConfirm ? 'badge-success' : 'badge-warning'}`}>{row.isConfirm ? "Đã xác thực" : "Chưa xác thực"}</div>
                                    </td>
                                    <td><span>{row.created_date ? dayjs(row.created_date).format("DD/MM/YYYY") : ''}</span></td>

                                    <td>
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
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table cart" data-toggle="tooltip" data-placement="top"
                                                title="Nạp tiền"
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
            <button ref={buttonOpenAddEditRef} type="button" className="d-none" data-toggle="modal" data-target="#modalSubmitForm">
                Launch modal add edit
            </button>
            <button ref={buttonOpenConfirmRef} type="button" className="d-none" data-toggle="modal" data-target="#modalConfirm">
                Launch modal confirm
            </button>
            <button ref={buttonOpenCustomRef} type="button" className="d-none" data-toggle="modal" data-target="#modalCustom">
                Launch modal confirm
            </button>
            <ModalSubmitForm
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
                            onSubmitAddEdit={handleSubmitAddEditAccount}
                        />
                    ) : (
                        <FormAddMoneyClient
                            // ===
                            updateItem={selectedItem}
                            onSubmitAddEdit={handleSubmitAddEditAccount}
                        />
                    )
                }
            </ModalSubmitForm>

            <ModalCustom
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