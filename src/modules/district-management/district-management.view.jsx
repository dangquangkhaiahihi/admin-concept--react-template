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
import * as districtAction from "../../redux/store/district-management/district.store";
import ListDistrictManagement from "./list-district-management/list-provice-management.view";
import EditDistrictManagement from "./edit-district-management/edit-district-management.view";
import AddDistrictManagement from "./add-district-management/add-district-management.view";
import * as appActions from "../../core/app.store";

function DistrictManagement(props) {
  const { isLoading, showLoading } = props;
  const [districtModels, setDistrictModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [name, setName] = useState();
  const [districtId, setDistrictId] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [status, setStatus] = useState();

  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const GetListDistrict = useCallback((pageIndex = 1, pageSize, sortExpression = orderBy + " " + order, name) => {
    showLoading(true);
    setPage(pageIndex - 1);
    districtAction
      .GetListDistrict(pageIndex, pageSize, sortExpression, name)
      .then((res) => {
        if (res && res.content) {
          setDistrictModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
          showLoading(false);
        }
      })
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors.AccessDenied, 
          NotificationMessageType.Error);
      });
  });
  useEffect(() => {
    GetListDistrict();
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

  const handleOpenEditDialog = (districtId) => {
    setDistrictId(districtId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (districtId, status) => {
    setDistrictId(districtId);
    setStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenRestPasswordDialog = (districtId) => {
    setDistrictId(districtId);
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
    await GetListDistrict(1, rowsPerPage, orderBy + " " + order, name);
    handleCloseFilter();
  };

  const refresh = () => {
    setName("");
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListDistrict(1, rowsPerPage);
  };

  const handleDelete = () => {
    districtAction.DeleteDistrict(districtId).then(
      (res) => {
        districtAction.DeleteDistrictPaht(districtId)
        if (res && res.content && res.content.status) {
          GetListDistrict(1, rowsPerPage, orderBy ? orderBy + " " + order : "", name);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.DeleteDistrict, NotificationMessageType.Success);
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
                  <label className="text-dark">Tên quận - huyện</label>
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
          Thêm quận/huyện
        </Button>
      </div>

      {districtModels ? (
        <ListDistrictManagement
          totalItemCount={totalItemCount}
          districtModels={districtModels}
          GetListDistrict={GetListDistrict}
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
        <AddDistrictManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListDistrict={GetListDistrict}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
        />
      )}

      {openEditDialog && (
        <EditDistrictManagement
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          districtId={districtId}
          ShowNotificationError={ShowNotificationError}
          GetListDistrict={GetListDistrict}
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

export default connect(mapStateToProps, mapDispatchToProps)(DistrictManagement);
