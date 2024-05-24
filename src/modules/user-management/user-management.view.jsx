/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { useForm } from "react-hook-form";

//--- Material Control
import { Button, TextField, IconButton, Tooltip, Popover, Fab } from "@material-ui/core";

//--- Material Icon
import AddCircle from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";

//--- Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

//--- Redux store
import * as userManagementAction from "../../redux/store/user-management/user-management.store";
import ListUserManagement from "./list-user-management/list-user-management.view";
import EditUserManagement from "./edit-user-management/edit-user-management.view";
import AddUserManagement from "./add-user-management/add-user-management.view";
import ResetPassword from "./reset-password/reset-password.view";
import * as appActions from "../../core/app.store";

function UserManagement(props) {
  const { showLoading } = props;
  const [userModels, setUserModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [email, setEmail] = useState();
  const [userId, setUserId] = useState();
  const [roleSelected, setRoleSelected] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [status, setStatus] = useState();
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [listRoles, setListRoles] = useState([]);

  useEffect(() => {
    GetListUserManagement();
    GetRoleLookupUserManagement();
  }, []);

  const GetListUserManagement = (pageIndex = 1, pageSize, sortExpression = orderBy + " " + order, email) => {
    showLoading(true);
    setPage(pageIndex - 1);
    userManagementAction
      .GetListUserManagement(pageIndex, pageSize, sortExpression, email)
      .then((res) => {
        if (res && res.content) {
          setUserModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors.AccessDenied,
          NotificationMessageType.Error
        );
      });
  };
  const GetRoleLookupUserManagement = () => {
    return new Promise((resolve, reject) => {
      userManagementAction.GetRoleLookupUserManagement().then(
        (res) => {
          setListRoles(res && res.content && res.content.length > 0 ? res.content : [])
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

  //--- Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openRestPasswordDialog, setOpenRestPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (userId,roleNames) => {
    setUserId(userId);
    setRoleSelected(listRoles.filter((item)=> {
      if(roleNames.some((name) => name === item.name))
      return item
    }));
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (userId, status) => {
    setUserId(userId);
    setStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenRestPasswordDialog = (userId) => {
    setUserId(userId);
    setOpenRestPasswordDialog(true);
  };

  const handleCloseRestPasswordDialog = () => {
    setOpenRestPasswordDialog(false);
  };

  //--- Filter
  const [filterSection, setFilterSection] = useState(null);

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const ShowNotificationError = (messages) => {
    ShowNotification(messages, NotificationMessageType.Error);
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;

  const handleClearAllField = () => {
    setEmail("");
    document.getElementById("formSearch").reset();
    GetListUserManagement(1, rowsPerPage, orderBy + " " + order, "");
    handleCloseFilter();
  };

  const onSubmit = async (data) => {
    await GetListUserManagement(1, rowsPerPage, orderBy + " " + order, email);
    handleCloseFilter();
  };

  const refresh = () => {
    setEmail("");
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListUserManagement(1, rowsPerPage);
  };

  const ActiveAccount = () => {
    showLoading(true);
    userManagementAction
      .ActiveUser(userId)
      .then((res) => {
        if (res && res.content && res.content.status) {
          GetListUserManagement(1, rowsPerPage, orderBy + " " + order);
          showLoading(false);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.ActiveUser, NotificationMessageType.Success);
        }
      })
      .catch((err) => {
        showLoading(false);
        err && err.errorType && ShowNotification(viVN.Errors[err.errorType], NotificationMessageType.Error);
      });
  };

  const LockAccount = () => {
    showLoading(true);
    userManagementAction
      .DeActiveUser(userId)
      .then((res) => {
        if (res && res.content && res.content.status) {
          GetListUserManagement(1, rowsPerPage, orderBy + " " + order);
          showLoading(false);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.DeActiveUser, NotificationMessageType.Success);
        }
      })
      .catch((err) => {
        showLoading(false);
        err && err.errorType && ShowNotification(viVN.Errors[err.errorType], NotificationMessageType.Error);
      });
  };

  return (
    <div className="slider">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0 text-gray-800">
          <Tooltip title="Tìm kiếm">
            <Fab color="primary" aria-label="filter" size="small" className="ml-2" aria-describedby={idFilter} onClick={handleClickFilter}>
              <FilterListIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Refresh">
            <Fab color="primary" aria-label="filter" size="small" onClick={refresh} className="ml-2">
              <RefreshIcon />
            </Fab>
          </Tooltip>
          <Popover
            id={idFilter}
            open={openFilter}
            anchorEl={filterSection}
            onClose={handleCloseFilter}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className="p-3 popover-admin-search">
              <div className="text-right border-bottom mb-3 pb-2">
                <IconButton aria-label="close" size="small" onClick={handleCloseFilter}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form id="formSearch" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="text-dark">Email</label>
                  <TextField
                    className="w-100"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    inputRef={register}
                  />
                </div>
                <div className="border-top">
                  <div className="row">
                    <div className="col-12 text-right mt-3">
                      <Button variant="contained" color="primary" onClick={onSubmit}>
                        <SearchIcon fontSize="small" /> Tìm kiếm
                      </Button>
                      <Button variant="contained" className="ml-2" onClick={handleClearAllField}>
                        <ClearAllIcon fontSize="small" /> Bỏ lọc
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Popover>
        </h1>
        <Button variant="contained" color="primary" onClick={handleOpenAddDialog} startIcon={<AddCircle />}>
          Thêm Người Dùng
        </Button>
      </div>
      {userModels ? (
        <ListUserManagement
          totalItemCount={totalItemCount}
          userModels={userModels}
          GetListUserManagement={GetListUserManagement}
          email={email}
          editAction={handleOpenEditDialog}
          deleteAction={handleOpenDeleteDialog}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          order={order}
          orderBy={orderBy}
          page={page}
          rowsPerPage={rowsPerPage}
          restAction={handleOpenRestPasswordDialog}
        />
      ) : (
        ""
      )}
      {openAddDialog && (
        <AddUserManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListUserManagement={GetListUserManagement}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openEditDialog && (
        <EditUserManagement
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          userId={userId}
          ShowNotificationError={ShowNotificationError}
          roleSelected={roleSelected.map((item) => {
            return { ...item, label: item.name, value: item.id };
          })}
          listRoles={listRoles.map((item) => {
            return { ...item, label: item.name, value: item.id };
          })}
          GetListUserManagement={GetListUserManagement}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openRestPasswordDialog && (
        <ResetPassword
          isOpen={handleOpenRestPasswordDialog}
          onClose={handleCloseRestPasswordDialog}
          onSuccess={handleCloseRestPasswordDialog}
          userId={userId}
          ShowNotificationError={ShowNotificationError}
          GetListUserManagement={GetListUserManagement}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openDeleteDialog &&
        (status ? (
          <DeleteDialog
            isOpen={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onSuccess={ActiveAccount}
            header={"Tài khoản này đang bị khóa"}
            content={"Bạn có muốn mở khoá tài khoản này không?"}
            btnName={"Mở khoá tài khoản"}
          />
        ) : (
          <DeleteDialog
            isOpen={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onSuccess={LockAccount}
            header={"Tài khoản này đang hoạt động"}
            content={"Bạn có muốn khoá tài khoản này không?"}
            btnName={"Khoá tài khoản"}
          />
        ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
