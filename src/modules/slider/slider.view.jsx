import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";
import { useForm } from "react-hook-form";

//--- Material Control
import { Button, TextField, IconButton, Tooltip, Popover, Fab } from "@material-ui/core";

//--- Styles
import "./slider.scss";

//--- Material Icon
import AddCircle from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RefreshIcon from "@material-ui/icons/Refresh";

//--- Component
import ListSlider from "./list-slider/list-slider.view";
import AddSlider from "./add-slider/add-slider.view";
import EditSlider from "./edit-slider/edit-slider.view";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";

//--- Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

//--- Redux store
import * as homePageAction from "../../redux/store/home-page/home-page.store";

export default function Slider(props) {
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [homePageModels, setHomePageModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [title, setTitle] = useState();
  const [sliderId, setSliderId] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("order");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  //--- Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  //--- Filter
  const [filterSection, setFilterSection] = useState(null);

  useEffect(() => {
    GetListHomePage();
  }, []);

  const GetListHomePage = (pageIndex = 1, pageSize, sortExpression, title) => {
    setPage(pageIndex - 1);
    homePageAction
      .GetListHomePage(pageIndex, pageSize, sortExpression, title)
      .then((res) => {
        if (res && res.content) {
          setHomePageModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      })
      .catch((err) => {
        err.errorMessage && ShowNotification(viVN.Errors.AccessDenied, NotificationMessageType.Error);
      });
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (sliderId) => {
    setSliderId(sliderId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (sliderId) => {
    setSliderId(sliderId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const ShowNotificationError = (messages) => {
    ShowNotification(messages, NotificationMessageType.Error);
  };

  const handleDelete = () => {
    homePageAction.DeleteHomePage(sliderId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListHomePage(1, rowsPerPage, orderBy + " " + order);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.SliderDeleteSuccess, NotificationMessageType.Success);
        }
      },
      (err) => {
        handleCloseDeleteDialog();
        err.errorMessage && ShowNotification(
          err.errorMessage, NotificationMessageType.Error);
      }
    );
  };

  const handleClearAllField = () => {
    setTitle("");
    document.getElementById("formSearch").reset();
  };

  const onSubmit = async (data) => {
    await GetListHomePage(1, rowsPerPage, orderBy + " " + order, title);
    handleCloseFilter();
  };

  const refresh = () => {
    setTitle("");
    setOrderBy("order");
    setOrder("asc");
    GetListHomePage(1, rowsPerPage);
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;

  return (
    <div className="slider">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0 text-gray-800">
          <Tooltip title="Tìm kiếm">
            <Fab color="primary" aria-label="filter" size="small" className="ml-2" onClick={handleClickFilter} aria-describedby={idFilter}>
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
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onClose={handleCloseFilter}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
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
                  <label className="text-dark">Tiêu đề</label>
                  <TextField
                    className="w-100"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
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
          Thêm Slider
        </Button>
      </div>
      {homePageModels ? (
        <ListSlider
          totalItemCount={totalItemCount}
          homePageModels={homePageModels}
          GetListHomePage={GetListHomePage}
          title={title}
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
        />
      ) : (
        ""
      )}
      {openAddDialog && (
        <AddSlider
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListHomePage={GetListHomePage}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}

      {openEditDialog && (
        <EditSlider
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          sliderId={sliderId}
          ShowNotificationError={ShowNotificationError}
          GetListHomePage={GetListHomePage}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}

      {openDeleteDialog && (
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
          header={"Xác nhận xóa"}
          content={"Bạn có chắc chắn muốn xóa?"}
        />
      )}
    </div>
  );
}
