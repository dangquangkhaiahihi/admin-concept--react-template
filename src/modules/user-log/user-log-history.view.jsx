/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { Configs } from "../../common/config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { useForm } from "react-hook-form";

//--- Material Control
import { Button, TextField, IconButton, Tooltip, Popover, Fab } from "@material-ui/core";

import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import dateformat from "dateformat";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RefreshIcon from "@material-ui/icons/Refresh";

//--- Redux store
import * as userLogAction from "../../redux/store/account/user-log.store";
import ListUserManagement from "./list-user-management/list-user-log-history.view";
import * as appActions from "../../core/app.store";

function UserLogHistory(props) {
  const { showLoading } = props;
  const [userLogModels, setUserLogModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [userName, setUserName] = useState();
  const [action, setAction] = useState();
  const [description, setDescription] = useState();
  const [createDate, setCreateDate] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const GetAllHistoryManagement = useCallback((pageIndex = 1, pageSize, sortExpression = orderBy + " " + order, action, userName, description, createDate) => {
    showLoading(true);
    setPage(pageIndex - 1);
    userLogAction
      .GetAllLogHistory(pageIndex, pageSize, sortExpression, action, userName, description, createDate)
      .then((res) => {
        if (res && res.content) {
          setUserLogModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  });

  useEffect(() => {
    GetAllHistoryManagement();
  }, []);

  //--- Filter
  const [filterSection, setFilterSection] = useState(null);

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;

  const handleClearAllField = () => {
    setUserName("");
    document.getElementById("formSearch").reset();
  };

  const onSubmit = async (data) => {
    await GetAllHistoryManagement(1, rowsPerPage, orderBy + " " + order, action, userName, description, createDate);
    handleCloseFilter();
  };

  const refresh = () => {
    setUserName("");
    setAction("");
    setDescription("");
    setCreateDate(null);
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetAllHistoryManagement(1, rowsPerPage);
  };

  const handleDateChange = (date) => {
    setCreateDate(dateformat(date, "yyyy-mm-dd"));
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
            <div className="p-3 popover-admin-search">
              <div className="text-right border-bottom mb-3 pb-2">
                <IconButton aria-label="close" size="small" onClick={handleCloseFilter}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form id="formSearch" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="text-dark">Người truy cập</label>
                  <TextField
                    className="w-100"
                    name="userName"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    inputRef={register}
                  />
                </div>
                <div className="form-group">
                  <label className="text-dark">Số hành động</label>
                  <TextField
                    className="w-100"
                    name="action"
                    value={action}
                    onChange={(e) => {
                      setAction(e.target.value);
                    }}
                    inputRef={register}
                  />
                </div>
                <div className="form-group">
                  <label className="text-dark">Mô tả</label>
                  <TextField
                    className="w-100"
                    name="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    inputRef={register}
                  />
                </div>
                <div className="form-group">
                  <label className="text-dark">Ngày tạo</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      onChange={(date) => date && handleDateChange(date)}
                      format="dd/MM/yyyy"
                      value={createDate}
                      fullWidth
                      showTodayButton={true}
                    />
                  </MuiPickersUtilsProvider>
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
      </div>

      {userLogModels ? (
        <ListUserManagement
          totalItemCount={totalItemCount}
          userLogModels={userLogModels}
          GetAllHistoryManagement={GetAllHistoryManagement}
          userName={userName}
          action={action}
          description={description}
          createDate={createDate}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLogHistory);
