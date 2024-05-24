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
import * as landTypeAction from "../../redux/store/land-type/land-type.store";
import ListLandTypeManagement from "./list-land-type-management/list-land-type-management.view";
import EditLandTypeManagement from "./edit-land-type-management/edit-land-type-management.view";
import AddLandTypeManagement from "./add-land-type-management/add-land-type-management.view";
import * as appActions from "../../core/app.store";

function LandTypeManagement(props) {
  const { showLoading } = props;
  const [landTypeModels, setLandTypeModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [name, setName] = useState();
  const [landTypeId, setLandTypeId] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [status, setStatus] = useState();

  const { register, handleSubmit } = useForm({ mode: "all", reValidateMode: "onBlur" });

  const GetListLandType = useCallback((pageIndex = 1, pageSize, sortExpression = orderBy + " " + order, nameSearch = name) => {
    showLoading(true);
    setPage(pageIndex - 1);
    landTypeAction
      .GetListLandType(pageIndex, pageSize, sortExpression, nameSearch)
      .then((res) => {
        if (res && res.content) {
          setLandTypeModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
          showLoading(false);
        }
      })
      .catch((err) => {
        showLoading(false);
      });
  });

  useEffect(() => {
    GetListLandType();
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

  const handleOpenEditDialog = (landTypeId) => {
    setLandTypeId(landTypeId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (landTypeId, status) => {
    setLandTypeId(landTypeId);
    setStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenRestPasswordDialog = (landTypeId) => {
    setLandTypeId(landTypeId);
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
    await GetListLandType(1, rowsPerPage, orderBy + " " + order, name);
    handleCloseFilter();
  };

  const refresh = () => {
    setName("");
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListLandType(1, rowsPerPage);
  };

  const handleDelete = () => {
    landTypeAction.DeleteLandType(landTypeId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          setName("");
          setOrderBy("modifiedDate");
          setOrder("desc");
          GetListLandType(1, rowsPerPage);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.DeleteLandType, NotificationMessageType.Success);
        }
      },
      (err) => {
        err && err.errorType && ShowNotification(viVN.Errors[err.errorType], NotificationMessageType.Error);
      }
    );
  };

  return (
    <div className="slider">
      <div className="d-sm-flex align-items-center justify-content-between mb-3">
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
            <div className="p-3" style={{ width: "30rem" }}>
              <div className="text-right border-bottom mb-3 pb-2">
                <IconButton aria-label="close" size="small" onClick={handleCloseFilter}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form id="formSearch" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="text-dark">Tên loại đất </label>
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
          Thêm mới loại đất
        </Button>
      </div>
      {landTypeModels ? (
        <ListLandTypeManagement
          totalItemCount={totalItemCount}
          landTypeModels={landTypeModels}
          GetListLandType={GetListLandType}
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
        <AddLandTypeManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListLandType={GetListLandType}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openEditDialog && (
        <EditLandTypeManagement
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          landTypeId={landTypeId}
          ShowNotificationError={ShowNotificationError}
          GetListLandType={GetListLandType}
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

export default connect(mapStateToProps, mapDispatchToProps)(LandTypeManagement);
