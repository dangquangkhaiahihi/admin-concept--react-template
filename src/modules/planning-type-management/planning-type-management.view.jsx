/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import PictureAsPdf from "@material-ui/icons/PictureAsPdf";

//--- Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

//--- Redux store
import * as planningTypeAction from "../../redux/store/planning-type/planning-type.store";

import * as appActions from "../../core/app.store";
import ListPlanningTypeManagement from "./list-planning-type-management/list-planning-type-management.view";
import AddPlanningTypeManagement from "./add-planning-type-management/add-planning-type-management.view";
import EditPlanningTypeManagement from "./edit-planning-type-management/edit-planning-type-management.view";
import { generatePDF } from "../../common/generatePDF";
import { Autocomplete } from "@material-ui/lab";
//--- Export pdf
import { useMediaQuery } from "react-responsive";
import ViewFileDialog from "../../components/dialog-view-file/dialog-view-file.view";

const groupParentList = [
  {
    id: 123,
    name: 'Quy hoạch xây dựng'
  },
  {
    id: 456,
    name: 'Hạ tầng kỹ thuật'
  }
]

function PlanningTypeManagement(props) {
  const { isLoading, showLoading, isSyncSetting, isQHHTKT, isQHCC, isQHT } = props;
  const componentTargerExport = useRef(null);

  //media query
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });


  const [data, setData] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [keyword, setKeyword] = useState();
  const [parentSelected, setParentSelected] = useState();
  
  const [planningTypeId, setPlanningTypeId] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [status, setStatus] = useState();

  const [loader, setLoader] = useState(false);
  
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const GetListPlanningType = useCallback((pageIndex = 1, pageSize, sort = orderBy + " " + order, keyword, parentId) => {
    showLoading(true);
    setPage(pageIndex - 1);
    planningTypeAction
      .GetListPlanningType(pageIndex, pageSize, sort, keyword, parentId)
      .then((res) => {
        if (res && res.content) {
          const temp = [];
          res.content.items.map((item) => {
            if( ((isQHCC || isQHT) && item.parentId == 123) || 
                (isQHHTKT && item.parentId == 456)
              ) {
                temp.push(item);
            }
          })
          setData(temp);
          setTotalItemCount(temp.length < res.content.totalItemCount && temp.length);
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
    GetListPlanningType();
  }, []);

  //--- Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const [openViewFileDialog, setOpenViewFileDialog] = useState(false);
  const [fileType, setFileType] = useState('');
  const [filePath, setFilePath] = useState('');

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (id) => {
    setPlanningTypeId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (planningTypeId, status) => {
    setPlanningTypeId(planningTypeId);
    setStatus(status);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
    setKeyword("");
    setParentSelected(null);
    refresh();
  };

  const onSubmit = async (data) => {
    await GetListPlanningType(1, rowsPerPage, orderBy + " " + order, keyword, parentSelected.id);
    handleCloseFilter();
  };

  const refresh = () => {
    setKeyword("");
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListPlanningType(1, rowsPerPage);
  };

  const handleDelete = () => {
    planningTypeAction.DeletePlanningType(planningTypeId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListPlanningType(page + 1, rowsPerPage, orderBy ? orderBy + " " + order : "", keyword);
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
        <h1 className="h3 mb-0 text-gray-800 row" style={{gap: '10px'}}>
          <Tooltip title="Tìm kiếm">
            <Fab color="primary" aria-label="filter" size="small" className="ml-2" aria-describedby={idFilter} onClick={handleClickFilter}>
              <FilterListIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Refresh">
            <Fab color="primary" aria-label="filter" size="small" onClick ={refresh} className="ml-2">
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
                  <label className="text-dark">Tên chuyên mục</label>
                  <TextField
                    className="w-100"
                    name="keyword"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                    inputRef={register}
                  />
                </div>
                <div class="form-group">
                  <Autocomplete
                    options={groupParentList}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={parentSelected}
                    onChange={(event, newValue) => {
                      console.log("selected" , newValue);
                      setParentSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Danh mục"
                        variant="outlined"
                        size="small"
                      />
                    )}
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
        {
          !isSyncSetting && <div className="row" style={{gap: '10px'}}>
          <Button className="mr-3" variant="contained" color="primary" onClick={handleOpenAddDialog} startIcon={<AddCircle />}>
            Thêm mới
          </Button>
          <Button variant="contained" color="secondary" onClick={() => {
            generatePDF(
              loader,
              setLoader,
              componentTargerExport.current,
              'Bảng biểu',
              (val) => {showLoading(val);}
            ).then((generatedPDF_URL) => {
              if (isTabletOrMobile) {
                setOpenViewFileDialog(true);
                setFileType('pdf');
                setFilePath(generatedPDF_URL);
              }
            })
          }} startIcon={<PictureAsPdf />}>
            {
              loader ? "Đang xuất ..." : "Trích xuất thông tin"
            }
          </Button>
          {/* <Button variant="contained" color="secondary" onClick={exportToPDF} startIcon={<PictureAsPdf />}>
          Export to PDF
          </Button> */}
          </div>
        }
      </div>

      {data ? (
        <ListPlanningTypeManagement
          totalItemCount={totalItemCount}
          data={data}
          GetListPlanningType={GetListPlanningType}
          keyword={keyword}
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
          groupParentList= {groupParentList}
          isSyncSetting={isSyncSetting}
          isQHCC={isQHCC}
          isQHT={isQHT}
          isQHHTKT={isQHHTKT}
          componentTargerExport={componentTargerExport}
        />
      ) : (
        ""
      )}

      {openAddDialog && (
        <AddPlanningTypeManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListPlanningType={GetListPlanningType}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
          groupParentList= {groupParentList}
        />
      )}

      {openEditDialog && (
        <EditPlanningTypeManagement
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          planningTypeId={planningTypeId}
          ShowNotificationError={ShowNotificationError}
          GetListPlanningType={GetListPlanningType}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          showLoading={showLoading}
          orderBy={orderBy}
          order={order}
          searchCriteria={{'page':page,'keyword':keyword,'parentId':parentSelected ? parentSelected.id : null}}
          groupParentList= {groupParentList}
          isSyncSetting={isSyncSetting}
        />
      )}

      {openDeleteDialog ? (
        <DeleteDialog
          isOpen={openDeleteDialog}
          rowsPerPageCommon={rowsPerPage}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
        />
      ) : (
        ""
      )}

      {openViewFileDialog && fileType && filePath && typeof filePath == 'string' ? (
        <ViewFileDialog
          isOpen={openViewFileDialog}
          onClose={() => {
            setOpenViewFileDialog(false);
            setFilePath('');
            setFileType('');
          }}
          header={"PDF file"}
          fileType={fileType}
          filePath={filePath}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanningTypeManagement);
