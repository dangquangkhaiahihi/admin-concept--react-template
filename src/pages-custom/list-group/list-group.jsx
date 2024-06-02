import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as appActions from "../../core/app.store";
import * as config from '../../common/config'

import headCellsListGroup from './head-cell-list-group';

import * as viVN from "../../language/vi-VN.json";
import { NotificationMessageType } from "../../utils/configuration";
import ShowNotification from "../../components/react-notifications/react-notifications";


import * as clientManagementAction from "../../redux/store/client-management/client-management.store";
import * as userManagementAction from "../../redux/store/user-management/user-management.store";
import * as groupManagementAction from "../../redux/store/group-management/group-management.store";

import ModalSubmitForm from '../../components/custom-modal/modal-submit-form/modal-submit-form';
import dayjs from 'dayjs';
import ModalConfirm from '../../components/custom-modal/modal-confirm/modal-confirm';

import FormAddEditGroup from './components/form-add-edit-group';
import DataTableCustom from '../../components/datatable-custom';
import { mediaUrl } from '../../api/api-service-custom';
import { optionsPromotions } from '../constant';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from "react-select";

const configLocal = {
    defaultPageSize: config.Configs.DefaultPageSize,
    sortExpression: "modifiedDate desc",
    orderBy: "modifiedDate",
    order: "desc",
}

export default function GroupManagement() {
    const now = new Date();

    const { register, handleSubmit, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const dispatch = useDispatch();
    const showLoading = (data) => dispatch(appActions.ShowLoading(data));

    // START GET LOOK UP

    // const [users, setUsers] = useState([]);
    // const getLookupUser = () => {
    //     userManagementAction.GetListUserManagement(1, 500).then(
    //         (res) => {
    //             if ( res && res.content && res.content.items ) {
    //                 setUsers(res.content.items)
    //             }
    //         },
    //         (err) => {
    //             throw err;
    //         }
    //     )
    // }

    // const [client, setClient] = useState([]);
    // const getLookupClient = () => {
    //     clientManagementAction.GetLookupClient().then(
    //         (res) => {
    //             if ( res && res.content ) {
    //                 setClient(res.content)
    //             }
    //         },
    //         (err) => {
    //             throw err;
    //         }
    //     )
    // }

    // const fetchData = async () => {
    //     showLoading(true);
    //     try {
    //         await Promise.allSettled([
    //             getLookupClient(),
    //             getLookupUser(),
    //         ]);
    //     } catch (err) {
    //         err && err.errorType &&
    //             ShowNotification(
    //                 viVN.Errors[err.errorType],
    //                 NotificationMessageType.Error
    //             );
    //         showLoading(false);
    //     } finally {
    //     }
    // }
    // END GET LOOK UP

    const [data, setData] = useState([])
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(configLocal.defaultPageSize);
    const [order, setOrder] = useState(configLocal.order);
    const [orderBy, setOrderBy] = useState(configLocal.orderBy);
    const [searchData, setSearchData] = useState();

    useEffect(() => {
        getListPlanManagement();
        // fetchData();
    }, []);

    const getListPlanManagement = (pageIndex = 1, pageSize = configLocal.defaultPageSize, sortExpression = configLocal.sortExpression, search=undefined) => {
        showLoading(true);
        // setPage(pageIndex-1)
        groupManagementAction.GetListGroupManagement(pageIndex, pageSize, sortExpression, search).then(
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
        getListPlanManagement(page + 1, rowsPerPage, sortExpression, searchData);
        console.log(sortExpression);
    };
    
    const handleChangePage = (newPage) => {
        setPage(newPage - 1);
        let sortExpression = orderBy + ' ' + order;
        getListPlanManagement(newPage, rowsPerPage, sortExpression, searchData);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        let sortExpression = orderBy + ' ' + order;
        getListPlanManagement(1, event.target.value, sortExpression, searchData);
    };

    const handleSubmitAddEditClientNote = async (data) => {
        showLoading(true);

        try {
            let res = null;

            if( !data.id ) {
                res = await groupManagementAction.CreateGroupManagement(data);
            } else {
                res = await groupManagementAction.UpdateGroupManagement(data);
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
                getListPlanManagement(page + 1, rowsPerPage, sortExpression, searchData);
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
                res = await groupManagementAction.DeleteGroupManagement(selectedItem.id);
                if (res)
                ShowNotification(
                    viVN.Success["DeleteSuccess"],
                    NotificationMessageType.Success
                );
            }

            if ( res ) {
                getListPlanManagement();
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

        if ( searchData.ClientId ) searchData.ClientId = searchData.ClientId.value;
        if ( searchData.UserId ) searchData.UserId = searchData.UserId.value;

        getListPlanManagement(1, rowsPerPage, sortExpression, searchData);
    }

    return (
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <label>Tên nhóm</label>
                                        <input
                                            id="Name"
                                            className="form-control"
                                            type="text"
                                            name="Name"
                                            defaultValue={searchData?.note}
                                            placeholder="Nhập tên nhóm để tìm kiếm"
                                            ref={register()}
                                        />
                                    </div>
                                    <div className="col-md-12 pl-0 d-flex justify-content-center">
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
                    headCells={headCellsListGroup}
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
                                    <td className='text-center'><span>{row.name}</span></td>
                                    <td className='text-center'><span>{row.created_by}</span></td>
                                    <td className='text-center'><span>{row.created_date ? dayjs(row.created_date).format("DD/MM/YYYY hh:mm:ss") : ''}</span></td>
                                    <td className='text-center'><span>{row.modified_by}</span></td>
                                    <td className='text-center'><span>{row.modified_date ? dayjs(row.modified_date).format("DD/MM/YYYY hh:mm:ss") : ''}</span></td>

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
                title={!selectedItem ? "Thêm mới ghi chú" : "Chỉnh sửa ghi chú"}
                open={isOpenAddEditDialog}
                onClose={closeAddEditDialog}
            >
                <FormAddEditGroup
                    // ===
                    updateItem={selectedItem}
                    onSubmitAddEdit={handleSubmitAddEditClientNote}
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