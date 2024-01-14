/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
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
import * as proviceAction from "../../redux/store/province-management/province.store";
import ListProviceManagement from "./list-provice-management/list-provice-management.view";
import EditProviceManagement from "./edit-provice-management/edit-provice-management.view";
import AddProviceManagement from "./add-provice-management/add-provice-management.view";
import * as appActions from "../../core/app.store";

function ProviceManagement(props) {
  const { showLoading } = props;
  const [proviceModels, setProviceModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [name, setName] = useState();
  const [proviceId, setProviceId] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("defaultProvince");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [status, setStatus] = useState();

  const { register, handleSubmit } = useForm({ mode: "all", reValidateMode: "onBlur" });

  const GetListProvince = useCallback((pageIndex = 1, pageSize, sortExpression = orderBy + " " + order, name) => {
    showLoading(true);
    setPage(pageIndex - 1);
    proviceAction
      .GetListProvince(pageIndex, pageSize, sortExpression, name)
      .then((res) => {
        if (res && res.content) {
          setProviceModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
          showLoading(false);
        }
      })
      .catch((err) => {
        showLoading(false);
        ShowNotification(viVN.Errors.AccessDenied, NotificationMessageType.Error)
      });
  });

  useEffect(() => {
    GetListProvince();
  }, []);

  //--- Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (proviceId) => {
    setProviceId(proviceId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    GetListProvince();
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (proviceId, status) => {
    setProviceId(proviceId);
    setStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenRestPasswordDialog = (proviceId) => {
    setProviceId(proviceId);
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
    setName("");
    document.getElementById("formSearch").reset();
  };

  const onSubmit = async (data) => {
    await GetListProvince(1, rowsPerPage, orderBy + " " + order, name);
    handleCloseFilter();
  };

  const refresh = () => {
    setName("");
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListProvince(1, rowsPerPage);
  };

  const handleDelete = () => {
    proviceAction.DeleteProvince(proviceId).then(
      (res) => {
        proviceAction.DeleteProvincePaht(proviceId)
        if (res && res.content && res.content.status) {
          GetListProvince(1, rowsPerPage, orderBy ? orderBy + " " + order : "", name);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.DeleteProvince, NotificationMessageType.Success);
        }
      },
      (err) => {
        handleCloseDeleteDialog();
        err && err.errorType && ShowNotification(err.errorMessage, NotificationMessageType.Error);
      }
    );
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
                  <label className="text-dark">Tên tỉnh</label>
                  <TextField
                    className="w-100"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
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
          Thêm tỉnh
        </Button>
      </div>
      {proviceModels ? (
        <ListProviceManagement
          totalItemCount={totalItemCount}
          proviceModels={proviceModels}
          GetListProvince={GetListProvince}
          name={name}
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
        <AddProviceManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListProvince={GetListProvince}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openEditDialog && (
        <EditProviceManagement
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          proviceId={proviceId}
          ShowNotificationError={ShowNotificationError}
          GetListProvince={GetListProvince}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}
      {openDeleteDialog ? (
        <DeleteDialog isOpen={openDeleteDialog} rowsPerPageCommon={rowsPerPage} onClose={handleCloseDeleteDialog} onSuccess={handleDelete} />
      ) : (
        ""
      )}
      {/* {openDeleteDialog && (status ?
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSuccess={}
          header={"Tài khoản này sẽ đang bị khoá"}
          content={"Bạn có muốn mở khoá tài khoản này không?"}
          btnName={"Mở khoá tài khoản"}
        />
        :
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSuccess={}
          header={"Tài khoản này đang được hoạt động"}
          content={"Bạn có muốn khoá tài khoản này không?"}
          btnName={"Khoá tài khoản"}
        />)
      } */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProviceManagement);
