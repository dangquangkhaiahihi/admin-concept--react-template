import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as appActions from "../../core/app.store";
import * as config from '../../common/config'

import headCellsListOrder from './head-cell-list-order';

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

import FormAddEditOrder from './components/form-add-edit-order';
import DataTableCustom from '../../components/datatable-custom';
import { mediaUrl } from '../../api/api-service-custom';
import { optionsClientTypes } from '../constant';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from "react-select";

const configLocal = {
    defaultPageSize: config.Configs.DefaultPageSize,
    sortExpression: "modifiedDate desc",
    orderBy: "modifiedDate",
    order: "desc",
}

export default function OrderManagement() {
    const { register, handleSubmit, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

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

    const [data, setData] = useState([])
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(configLocal.defaultPageSize);
    const [order, setOrder] = useState(configLocal.order);
    const [orderBy, setOrderBy] = useState(configLocal.orderBy);
    const [searchData, setSearchData] = useState();

    useEffect(() => {
        GetListOrderManagement();
        fetchData();
    }, []);

    const GetListOrderManagement = (pageIndex = 1, pageSize = configLocal.defaultPageSize, sortExpression = configLocal.sortExpression, search=undefined) => {
        showLoading(true);
        // setPage(pageIndex-1)
        orderManagementAction.GetListOrderManagement(pageIndex, pageSize, sortExpression, search).then(
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
        GetListOrderManagement(page + 1, rowsPerPage, sortExpression, searchData);
        console.log(sortExpression);
    };
    
    const handleChangePage = (newPage) => {
        setPage(newPage - 1);
        let sortExpression = orderBy + ' ' + order;
        GetListOrderManagement(newPage, rowsPerPage, sortExpression, searchData);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        let sortExpression = orderBy + ' ' + order;
        GetListOrderManagement(1, event.target.value, sortExpression, searchData);
    };

    const handleSubmitAddEditAccount = async (data) => {
        showLoading(true);

        try {
            let res = null;

            if( !data.id ) {
                res = await orderManagementAction.CreateOrderManagement(data);
            } else {
                res = await orderManagementAction.UpdateOrderManagement(data);
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
                GetListOrderManagement(page + 1, rowsPerPage, sortExpression, searchData);
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

    const openConfirmDialog = (item) => {
        setSelectedItem(item);
        buttonOpenConfirmRef.current.click();
    }
    const closeConfirmDialog = () => {
        setOpenDeleteDialog(false);
        setOpenActiveDialog(false);
        setOpenDeactiveDialog(false);
        setSelectedItem(null);
    }
    const handleConfirm = async () => {
        try {
            let res = null;

            if( isOpenDeleteDialog ) {
                res = await orderManagementAction.DeleteOrderManagement(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["DeleteSuccess"],
                    NotificationMessageType.Success
                );
            }

            if ( res ) {
                GetListOrderManagement();
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
        
        if ( data.StartDate && data.EndDate ) {
            if ( !dayjs(data.StartDate).isBefore(dayjs(data.EndDate))) {
                ShowNotification(
                    "Từ ngày phải bé hơn đến ngày",
                    NotificationMessageType.Error
                );
                return;
            }
        }
        const searchData = {...data};
        if ( searchData.ClientId && Array.isArray(searchData.ClientId) && searchData.ClientId.length > 0) {
            searchData.ClientId = searchData.ClientId.map(x => x.value)
        };
        
        if ( searchData.UserId && Array.isArray(searchData.UserId) && searchData.UserId.length > 0) {
            searchData.UserId = searchData.UserId.map(x => x.value)
        };

        if ( searchData.ProvinceId && Array.isArray(searchData.ProvinceId) && searchData.ProvinceId.length > 0) {
            searchData.ProvinceId = searchData.ProvinceId.map(x => x.value)
        };
        GetListOrderManagement(1, rowsPerPage, sortExpression, searchData);
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
                                        <label>Chọn khách hàng</label>
                                        <Select
                                            {...register("ClientId")}
                                            isClearable
                                            isMulti
                                            placeholder="Chọn khách hàng"
                                            onChange={(data) => {
                                                setValue("ClientId", data);
                                            }}
                                            options={client.map(item => {return {label: item.name, value: item.id}})}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Chọn nhân viên</label>
                                        <Select
                                            {...register("UserId")}
                                            isClearable
                                            isMulti
                                            placeholder="Chọn nhân viên"
                                            onChange={(data) => {
                                                setValue("UserId", data);
                                            }}
                                            options={users.map(item => {return {label: item.fullName, value: item.id}})}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                    <div className="form-group  col-md-6">
                                        <label>Từ ngày</label>
                                        <DatePicker
                                            {...register("StartDate")}
                                            onChange={(data) => setValue("StartDate", dayjs(data).format())}
                                            className="form-control"
                                            format='DD/MM/YYYY'
                                            slotProps={{ textField: { size: 'small' } }}
                                        //label={"Nhập Ngày nhận"}
                                        />
                                    </div>

                                    <div className="form-group  col-md-6">
                                        <label>Đến ngày</label>
                                        <DatePicker
                                            {...register("EndDate")}
                                            onChange={(data) => setValue("EndDate", dayjs(data).format())}
                                            className="form-control"
                                            format='DD/MM/YYYY'
                                            slotProps={{ textField: { size: 'small' } }}
                                        //label={"Nhập Ngày nhận"}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Chọn Tỉnh/ Thành phố</label>
                                        <Select
                                            {...register("ProvinceId")}
                                            isClearable
                                            isMulti
                                            placeholder="Chọn Tỉnh/ Thành phố"
                                            onChange={(data) => {
                                                console.log(data);
                                                setValue("ProvinceId", data);
                                            }}
                                            options={province.map(item => {return {label: item.name, value: item.id}})}
                                            noOptionsMessage={() => "Không tồn tại"}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-12 pl-0 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-space btn-primary">Tìm kiếm</button>
                                        <button className="btn btn-space btn-secondary" onClick={(e) => {
                                            setValue("email","");
                                        }}>Xóa lọc</button>
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
                    headCells={headCellsListOrder}
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
                                    <td><span>{client.find(x => x.id === row.clientId)?.name}</span></td>
                                    <td><span>{plan.find(x => x.id === row.planId)?.name}</span></td>
                                    <td><span>{plan.find(x => x.id === row.planId)?.price} VNĐ</span></td>

                                    <td><span>{row.startDate ? dayjs(row.startDate).format("DD/MM/YYYY") : ''}</span></td>
                                    <td><span>{row.endDate ? dayjs(row.endDate).format("DD/MM/YYYY") : ''}</span></td>

                                    <td><span>{row.created_by}</span></td>
                                    <td><span>{row.created_date ? dayjs(row.created_date).format("DD/MM/YYYY") : ''}</span></td>
                                    
                                    <td>
                                        <div className='d-flex'>
                                            <button className="d-inline-block btn btn-sm btn-outline-light custom-button-table delete" data-toggle="tooltip" data-placement="top"
                                                title="Xóa"
                                                onClick={() => {
                                                    setOpenDeleteDialog(true);
                                                    openConfirmDialog(row);
                                                }}
                                            >
                                                <i className="far fa-trash-alt"></i>
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
                title={!selectedItem ? "Thêm mới tài khoản khách hàng" : "Chỉnh sửa tài khoản khách hàng"}
                open={isOpenAddEditDialog}
                onClose={closeAddEditDialog}
            >
                <FormAddEditOrder
                    client={client}
                    users={users}
                    plan={plan}
                    // ===
                    updateItem={selectedItem}
                    onSubmitAddEdit={handleSubmitAddEditAccount}
                />
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