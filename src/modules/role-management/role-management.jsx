import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SearchRoleManagement from './search-role-management/search-role-management.view'
import ListRoleManagement from './list-role-management/list-role-management.view'
import AddRoleManagement from './add-role-management/add-role-management.view'
import EditRoleManagement from './edit-role-management/edit-role-management.view'
import ScrrenRoleManagement from './edit-role-management/edit-role-management.view'
import DiaLogDelete from '../../components/dialog-delete/dialog-delete.view'

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
// import * as emailTemplateAction from "../../redux/store/email-template/email-template.store";
import * as roleManagementAction from "../../redux/store/role/role-management.store"
import * as config from '../../common/config'
import * as appActions from "../../core/app.store";

import Button from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import ScreenRoleManagementView from './sreen-role-management/screen-role-management.view';


function RoleManagement(props) {
  const { isLoading, showLoading } = props;
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [roleModels, setRoleModels] = useState();
  const [roleId, setRoleId] = useState("");
  const [totalItemCount, setTotalItemCount] = useState();
  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");

  useEffect(() => {
    getListRoleManagement();
  }, []);

  // --- Add Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const getListRoleManagement = (pageIndex = 1, pageSize = config.Configs.DefaultPageSize, sortExpression = "modifiedDate desc", code="", name = "") => {
    showLoading(true);
    setPage(pageIndex-1)
    roleManagementAction.GetListRoleManagement(pageIndex, pageSize, sortExpression, code.trim(), name.trim()).then(
      (res) => {
        if (res &&
          res.content &&
          res.content.items) {
          setRoleModels(res.content.items)
          setTotalItemCount(res.content.totalItemCount)
        }
        showLoading(false);
      },
      (err) => {
        showLoading(false);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  }

  const handleOpenAddDialog = () => {
    setIsAddDialog(true);
    setOpenAddDialog(true);
  };

  const onHideModal = () => {
    setOpenAddDialog(false);
  }

  // Edit Dialog
  const handleOpenEditDialog = (data) => {
    setIsAddDialog(false);
    setRoleId(data)
    setOpenAddDialog(true)
  }

  //--- Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenDeleteDialog = (code) => {
    setOpenDeleteDialog(true);
    setRoleId(code)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const [openScreenRoleDialog, setOpenScreenRoleDialog] = React.useState(false);

  const handleOpenScreenRoleDialog = (code) => {
    setOpenScreenRoleDialog(true);
    setRoleId(code)
  };

  const handleCloseScreenRoleDialog = () => {
    setOpenScreenRoleDialog(false);
  };

  const handleDelete = () => {
    roleManagementAction.DeleteRoleManagement(roleId).then((res) => {
      if (res && res.content && res.content.status) {
        getListRoleManagement(1, rowsPerPageCommon,orderBy ? (orderBy+ " "+order):"",code,name);
        handleCloseDeleteDialog();
        ShowNotification(
          viVN.Success.RoleDeleteSuccess,
          NotificationMessageType.Success
        );
      }
    },
      (err) => {
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      });
  }

  return (
    <div className="role-management">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <SearchRoleManagement 
          getListRoleManagement={getListRoleManagement}
          setCode={setCode}
          setName={setName}
          code={code}
          name={name}
          rowsPerPageCommon={rowsPerPageCommon}
          setOrderBy={setOrderBy}
          setOrder={setOrder}
          orderBy={orderBy}
          order={order}
          setPage={setPage}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenAddDialog} startIcon={<AddCircle />}>
          Thêm Role
        </Button>
      </div>

      {roleModels  ? <ListRoleManagement roleModels={roleModels} totalItemCount={totalItemCount}
        handleOpenEditDialog={handleOpenEditDialog}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        getListRoleManagement={getListRoleManagement}
        setRowsPerPageCommon={setRowsPerPageCommon}
        name={name} code={code}
        page={page} setPage={setPage}
        setOrder={setOrder} order={order}
        setOrderBy={setOrderBy} orderBy={orderBy}
        handleOpenScreenRoleDialog={handleOpenScreenRoleDialog}
      /> : ""}

      {openAddDialog ? isAddDialog ?
        <AddRoleManagement rowsPerPageCommon={rowsPerPageCommon} openAddDialog={openAddDialog} onHideModal={onHideModal} getListRoleManagement={getListRoleManagement} setPage={setPage}></AddRoleManagement>
        : <EditRoleManagement rowsPerPageCommon={rowsPerPageCommon} openAddDialog={openAddDialog} onHideModal={onHideModal} roleId={roleId} getListRoleManagement={getListRoleManagement }></EditRoleManagement>
        : ""}

      {openDeleteDialog ? <DiaLogDelete isOpen={openDeleteDialog} rowsPerPageCommon={rowsPerPageCommon} onClose={handleCloseDeleteDialog} onSuccess={handleDelete} /> : ""}
      {openScreenRoleDialog ? <ScreenRoleManagementView roleId ={roleId} rowsPerPageCommon={rowsPerPageCommon} openAddDialog={openScreenRoleDialog} onHideModal={handleCloseScreenRoleDialog} getListRoleManagement={getListRoleManagement} setPage={setPage} /> : ""}
    </div>
  )
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleManagement);