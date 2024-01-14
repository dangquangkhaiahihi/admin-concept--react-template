/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core";
//--- Material Icon
import AddCircle from "@material-ui/icons/AddCircle";
//--- Component 
import UnLockDialog from "../../../components/dialog-lock/dialog-unlock.view";
import LockDialog from "../../../components/dialog-lock/dialog-lock.view";
import DeleteDialog from "../../../components/dialog-delete/dialog-delete.view";
import ListRecordsManagement from "../records-management/list-records-management/list-records-management.view";
import AddRecordsManagement from "../records-management/add-records-management/add-records-management.view";
import EditRecordsManagement from "../records-management/edit-records-management/edit-records-management.view";
import CreatMapView from "../../create-map/create-map";
import { Configs } from "../../../common/config";
import SearchRecordManagement from "./search-records-management/search-records-management.view";

import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import * as appActions from "../../../core/app.store";
import * as planningAction from "../../../redux/store/planning/planning.store";
import * as mapAction from "../../../redux/store/init-map/base-map.store";

//--- Material Icon
import { UrlCollection } from "../../../common/url-collection";
import { disable } from "ol/rotationconstraint";

const useStyles = makeStyles((theme) => ({
  popover: {
    maxHeight: "300px",
  },
  box: {
    minWidth: "15rem",
  },
  positionRelative: {
    position: "relative",
    '@media (max-width: 1224px)': {
      top:'-15px',
    }
  },
  btnAdd: {
    display: "flex",
    position: "absolute",
    top: -52,
    zIndex: 10,
    right: 0,
    color: "#3f51b5",
    cursor: "pointer",
  },
  btnAddContent : {
    borderBottom: "2px solid #3f51b5",
    '@media (max-width: 1224px)': {
      fontSize : '14px',
    }
  },
  mr05: {
    marginRight: 5,
  },
  disNone: {
    display: "none",
  },
}));

function RecordsManagement(props) {
  const { headCell, showLoading, isQHHTKT, isOtherPlanning, isQHT, isQHCC } = props;

  const classes = useStyles();
  const history = useHistory();

  const [mapIdSelected, setMapIdSelected] = useState(null);
  const [planningIdSelected, setPlanningIdSelected] = useState(null);
  const [planningNameSelected, setPlanningNameSelected] = useState("");
  const [openCreatMapModal, setOpenCreatMapModal] = useState(false);
  const [order, setOrder] = useState(Configs.DefaultOrder);
  const [orderBy, setOrderBy] = useState(Configs.DefaultOrderBy);
  const [page, setPage] = useState(1);
  const [pageSizeDefault, setPageSize] = useState(Configs.DefaultPageSize);

  const [planning, setPlanning] = useState(null);
  const [planningId, setPlanningId] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLockDialog, setOpenLockDialog] = useState(false);
  const [openUnLockDialog, setOpenUnLockDialog] = useState(false);
  const [filterSection, setFilterSection] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [showConsult, setShowConsult] = useState(false);
  const [searchSection, setSearchSection] = useState(null);
  const [dataModel, setDataModel] = useState(null);
  const [planningName, setPlanningName] = useState("");
  const [cgisId, setCgisId] = useState(0);
  const [title, setTitle] = React.useState("");
  const [planningUnitSelected, setPlanningUnitSelected] = useState(null);
  const [approvalAgencySelected, setApprovalAgencySelected] = useState(null);
  const [investorSelected, setInvestorSelected] = useState(null);
  const [typeSelected, setTypeSelected] = useState(null);
  const [levelSelected, setLevelSelected] = useState(null);
  const [statusIdSelected, setStatusIdSelected] = useState(null);
  const [districtSelected, setDistrictSelected] = useState(null);
  const [isLock, setIsLock] = useState(false);
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    onGetListPlanning();
    const showConsult = new URLSearchParams(props?.location?.search).get(
      "showConsult"
    );
    const planningIdURL = new URLSearchParams(props?.location?.search).get(
      "planningId"
    );
    const planningNameURL = new URLSearchParams(props?.location?.search).get(
      "planningName"
    );
    if (showConsult) {
      setPlanningId(planningIdURL);
      setShowConsult(true);
      setPlanningName(planningNameURL);
    }
  }, []);

  const onGetListPlanning = (
    pageIndex = page,
    pageSize = pageSizeDefault,
    sortExpression = Configs.DefaultSortExpression,
    name = planningName || "",
    type,
    level,
    status,
    planningunit,
    investor,
    approvalAgency,
    district,
  ) => {
    showLoading(true);
    setPage(pageIndex > 0 ? pageIndex : 0);
    planningAction
      .GetListPlanning(
        pageIndex,
        pageSize,
        sortExpression,
        name.trim(),
        type,
        level,
        status,
        planningunit,
        investor,
        approvalAgency,
        district,
        isQHHTKT,
        isOtherPlanning,
        isQHT,
        isQHCC,
      )
      .then(
        (res) => {
          res && res.content && setDataModel(res.content);
          res && res.content && setCgisId(res.content.cgisId);

          res &&
            res.content &&
            localStorage.setItem("cgisId", res.content.cgisId); //should wrapper into a common service to localStorage
          showLoading(false);
        },
        (err) => {
          showLoading(false);
        }
      );
  };

  //--- Add Dialog
  // const handleOpenAddDialog = () => {
  //   setOpenAddDialog(true);
  // };

  const createRecordManagement = () => {
    history.push({
      pathname: isOtherPlanning ? UrlCollection.AddOtherPlanning : 
      isQHCC ? UrlCollection.AddPlanningCC : 
      UrlCollection.AddPlanningAnnouncementProcess 
    });
  };

  const onSuccessAdd = () => {
    onGetListPlanning(1, pageSizeDefault, orderBy ? orderBy + " " + order : "");
    handleCloseAddDialog();
    ShowNotification(
      viVN.Success.CreateSuccess,
      NotificationMessageType.Success
    );
  };

  const handleCloseAddDialog = () => {
    history.push({
      pathname: UrlCollection.PlanningAnnouncementProcess,
    });
  };

  //--- Edit Dialog
  const handleOpenEditDialog = (id) => {
    if (id) {
      setPlanningId(id);
      //setOpenEditDialog(true);
      history.push({
        pathname: (isOtherPlanning ? UrlCollection.EditOtherPlanning : 
          isQHCC ? UrlCollection.EditPlanningCC : 
          isQHHTKT ? UrlCollection.Edit_QH_HTKT:  
          UrlCollection.EditPlanningAnnouncementProcess).replace(
          ":id",
          id
        ),
        state: { planningId: id },
      });
    }
  };

  const onSuccessEdit = () => {
    onGetListPlanning(
      page > 0 ? page : 1,
      pageSizeDefault,
      orderBy ? orderBy + " " + order : ""
    );
    handleCloseEditDialog();
    ShowNotification(
      viVN.Success.UpdateSuccess,
      NotificationMessageType.Success
    );
  };

  const handleCloseEditDialog = () => {
    setPlanningId(null);
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (id) => {
    if (id) {
      setPlanningId(id);
      setOpenDeleteDialog(true);
    }
  };
  const handleOpenLockDialog = (id) => {
    if (id) {
      setPlanningId(id);
      setOpenLockDialog(true);
    }
  };
  const handleOpenUnLockDialog = (id) => {
    if (id) {
      setPlanningId(id);
      setOpenUnLockDialog(true);
    }
  };
  const onDeletePlanning = () => {
    if (!planningId) return;
    showLoading(true);
    planningAction.DeletePlanning(planningId).then(
      (res) => {
        onGetListPlanning(
          1,
          pageSizeDefault,
          orderBy ? orderBy + " " + order : ""
        );
        handleCloseDeleteDialog();
        ShowNotification(
          viVN.Success.DeleteSuccess,
          NotificationMessageType.Success
        );
      },
      (err) => {
        handleCloseDeleteDialog();
        showLoading(false);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };
  const onLockPlanning = () => {
    if (!planningId) return;
    showLoading(true);
    planningAction.LockPlanning(planningId).then(
      (res) => {
        onGetListPlanning(
          1,
          pageSizeDefault,
          orderBy ? orderBy + " " + order : ""
        );
        handleCloseLockDialog();
        ShowNotification(
          viVN.Success.LockSuccess,
          NotificationMessageType.Success
        );
      },
      (err) => {
        handleCloseLockDialog();
        showLoading(false);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };
  const onUnLockPlanning = () => {
    if (!planningId) return;
    showLoading(true);
    planningAction.UnLockPlanning(planningId).then(
      (res) => {
        onGetListPlanning(
          1,
          pageSizeDefault,
          orderBy ? orderBy + " " + order : ""
        );
        handleCloseUnLockDialog();
        ShowNotification(
          viVN.Success.UnLockSuccess,
          NotificationMessageType.Success
        );
      },
      (err) => {
        handleCloseUnLockDialog();
        showLoading(false);
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };
  const handleCloseDeleteDialog = () => {
    setPlanningId(null);
    setOpenDeleteDialog(false);
  };
  const handleCloseLockDialog = () => {
    setPlanningId(null);
    setOpenLockDialog(false);
  };
  const handleCloseUnLockDialog = () => {
    setPlanningId(null);
    setOpenUnLockDialog(false);
  };
  //--- Filter
  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };
  const handleClickSearch = (event) => {
    setOpenSearch(true);
    setSearchSection(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setSearchSection(null);
    setOpenSearch(false);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
    setOpenSearch(false);
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;
  const idFilterSearch = openSearch ? "poppoverSearchSlide" : undefined;
  //--- Map modal
  const handleOpenCreatMapModal = (mapId, planningId, planningName, status) => {
    console.log(planningId)
    console.log(mapId)
    showLoading(true);
    if (mapId === null || mapId ===0) {
      mapAction.InitMap(planningId).then((res) => {
        setMapIdSelected(res.content.id)
      }).then((res) => {    
        setOpenCreatMapModal(true);
      })
    } else {
      setMapIdSelected(mapId);
      setOpenCreatMapModal(true);
    }
    setIsLock(status);
    setPlanningNameSelected(planningName);
    setPlanningIdSelected(planningId);
    showLoading(false);
  };

  const handleCloseCreatMapModal = () => {
    onGetListPlanning();
    setOpenCreatMapModal(false);
  };

  //--- Header Default
  let headCellDefault =
    //props?.headCell?
    [
      {
        id: "planningName",
        hideSortIcon: false,
        label: isOtherPlanning ? "Tên quy hoạch" : "Tên đồ án QH",
        visibleColumn: true,
      },
      {
        id: "planningCode",
        hideSortIcon: false,
        label: "Mã quy hoạch",
        visibleColumn: true,
      },
      {
        id: "planningTypeName",
        hideSortIcon: false,
        label: "Loại quy hoạch",
        visibleColumn: true,
      },
      {
        id: "place",
        hideSortIcon: false,
        label: "Địa điểm",
        visibleColumn: true,
      },
      {
        id: "mapLink",
        hideSortIcon: true,
        label: isQHT? '' : "Link bản đồ",
        visibleColumn: true,
      },
      {
        id: "planningStatusName",
        hideSortIcon: false,
        label: "Trạng thái",
        visibleColumn: true,
      },
      {
        id: "planningLevelName",
        hideSortIcon: false,
        label: "Cấp quy hoạch",
        visibleColumn: true,
      },
      {
        id: "planningAgency",
        hideSortIcon: false,
        label: "Cơ quan phê duyệt",
        visibleColumn: true,
      },
      {
        id: "planningUnit",
        hideSortIcon: false,
        label: "Đơn vị lập quy hoạch",
        visibleColumn: true,
      },
      {
        id: "agencySubmitted",
        hideSortIcon: false,
        label: "Cơ quan trình",
        visibleColumn: true,
      },
      {
        id: "consultingUnit",
        hideSortIcon: false,
        label: "Đơn vị tư vấn",
        visibleColumn: true,
      },
      {
        id: "investor",
        hideSortIcon: false,
        label: "Chủ đầu tư",
        visibleColumn: true,
      },
      {
        id: "documentTypeName",
        hideSortIcon: false,
        label: "Loại hồ sơ",
        visibleColumn: true,
      },
      {
        id: "modifiedDate",
        hideSortIcon: false,
        label: "Cập nhật mới nhất",
        visibleColumn: true,
      },
      {
        id: "consultTheCommunity",
        hideSortIcon: false,
        label: "Xin ý kiến",
        visibleColumn: true,
      },
      {
        id: "announced",
        hideSortIcon: false,
        label: "Công bố",
        visibleColumn: true,
      },
      {
        id: "planningRelated",
        hideSortIcon: false,
        label: "Quy hoạch liên quan",
        visibleColumn: true,
      },
      {
        id: "documentSettings",
        hideSortIcon: false,
        label: "Thiết lập HS",
        visibleColumn: true,
      },
      { id: "actions", hideSortIcon: true, label: "", visibleColumn: true },
    ];
  //: props?.headCell;
  if (headCell != null) {
    headCellDefault = headCell;
  }

  //--- Visible checkbox default
  const visibleCheckboxDefault = {
    planningName: true,
    planningCode: true,
    planningTypeName: true,
    place: true,
    mapLink: true,
    planningStatusName: true,
    planningLevelName: true,
    planningAgency: true,
    planningUnit: true,
    agencySubmitted: true,
    consultingUnit: true,
    investor: true,
    documentTypeName: true,
    modifiedDate: true,
    consultTheCommunity: true,
    announced: true,
    planningRelated: true,
    documentSettings: true,
    actions: true,
  };

  //--- Visible Column
  const [visibleColumn, setVisibleColumn] = useState(visibleCheckboxDefault);

  //--- Header cell
  const [headCells, setHeadCells] = useState(
    headCellDefault.map((value) => {
      return Object.assign({}, value);
    })
  );

  const [headCellsTemp, setHeadCellsTemp] = useState(
    headCellDefault.map((value) => {
      return Object.assign({}, value);
    })
  );

  const handleChangeVisibleCheckbox = (event) => {
    setVisibleColumn({
      ...visibleColumn,
      [event.target.name]: event.target.checked,
    });

    headCellsTemp.map((headItem, headIndex) => {
      if (headItem.id === event.target.name) {
        headItem.visibleColumn = event.target.checked;
      }
    });

    setHeadCellsTemp(headCellsTemp);
  };
  const handleClearAllField = () => {
    setPlanningName("");
  };
  const refresh = () => {
    setPlanningName("");
    onGetListPlanning(1, pageSizeDefault, Configs.DefaultSortExpression, "");
  };
  const onSubmit = (data) => {
    onGetListPlanning(
      1,
      pageSizeDefault,
      orderBy + " " + order,
      data.planningName
    );
    handleCloseFilter();
    handleCloseSearch();
  };

  const handleChangeVisibleColumn = () => {
    setHeadCells(
      headCellsTemp.map((value) => {
        return Object.assign({}, value);
      })
    );
    handleCloseFilter();
  };
  const filterheadCells = useMemo(() => {
    if (isQHT) {
      return headCells?.filter(
        (x) =>
          x.id !== "planningLevelName"
      )
    }
    if (isQHHTKT) {
      return headCells?.filter(
        (x) =>
          x.id !== "planningTypeName" &&
          // x.id !== "planningRelated" &&
          // x.id !== "actions" &&
          x.id !== "announced"
      )
    }
    if (isOtherPlanning) {
      return headCells?.filter(
        (x) =>
          x.id !== "planningTypeName" &&
          x.id !== "consultTheCommunity" &&
          x.id !== "announced" &&
          x.id !== "planningRelated" &&
          x.id !== "documentSettings" &&
          x.id !== "place" &&
          x.id !== "planningLevelName" &&
          x.id !== "planningUnit" &&
          x.id !== "investor" &&
          x.id !== "investor" &&
          x.id !== "consultingUnit"
      )
    }
    return headCells;
  }, [headCell]);

  return (
    <div className={`consult-the-community ${classes.positionRelative}`}>
      {!isQHHTKT && (
        <div
          className={`${classes.btnAdd} ${
            props?.hiddenAddButton ? classes.disNone : ''
          }`}
          onClick={createRecordManagement}
        >
          <span className={`${classes.btnAddContent}`}>
            <AddCircle className={classes.mr05} />
            Thêm mới
          </span>
        </div>
      )}

      <SearchRecordManagement
        isQHHTKT={isQHHTKT}
        isQHT={isQHT}
        isQHCC={isQHCC}
        isOtherPlanning={isOtherPlanning}
        onGetListPlanning={onGetListPlanning}
        pageSize={pageSizeDefault}
        refresh={refresh}
        title={title}
        setTitle={(data) => setTitle(data)}
        planningUnitSelected={planningUnitSelected}
        setPlanningUnitSelected={(data) => setPlanningUnitSelected(data)}
        approvalAgencySelected={approvalAgencySelected}
        setApprovalAgencySelected={(data) => setApprovalAgencySelected(data)}
        investorSelected={investorSelected}
        setInvestorSelected={(data) => setInvestorSelected(data)}
        typeSelected={typeSelected}
        setTypeSelected={(data) => setTypeSelected(data)}
        levelSelected={levelSelected}
        setLevelSelected={(data) => setLevelSelected(data)}
        statusIdSelected={statusIdSelected}
        setStatusIdSelected={(data) => setStatusIdSelected(data)}
        districtSelected={districtSelected}
        setDistrictSelected={(data) => setDistrictSelected(data)}
      />

      {/* {!isQHHTKT && (
        <div
          className={`${classes.btnAdd} ${
            props?.hiddenAddButton ? classes.disNone : ''
          }`}
          onClick={createRecordManagement}
        >
          <AddCircle className={classes.mr05} />
          Thêm quy hoạch
        </div>
      )} */}

      <ListRecordsManagement
        openCreatMapModal={handleOpenCreatMapModal}
        dataList={(dataModel && dataModel.items) || []}
        showConsult={showConsult}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        page={page}
        setPage={setPage}
        pageSize={pageSizeDefault}
        setPageSize={setPageSize}
        onGetListData={onGetListPlanning}
        planning={planning}
        setPlanning={setPlanning}
        planningId={planningId}
        setPlanningId={setPlanningId}
        editAction={handleOpenEditDialog}
        deleteAction={handleOpenDeleteDialog}
        lockAction={handleOpenLockDialog}
        unLockAction={handleOpenUnLockDialog}
        totalItemCount={(dataModel && dataModel.totalItemCount) || 0}
        headCells={filterheadCells}
        planningName={planningName}
        setShowConsult={setShowConsult}
        isQHHTKT={isQHHTKT}
        isQHT={isQHT}
        isQHCC={isQHCC}
        isOtherPlanning={isOtherPlanning}
        title={title}
        planningUnitSelected={planningUnitSelected}
        approvalAgencySelected={approvalAgencySelected}
        investorSelected={investorSelected}
        typeSelected={typeSelected}
        levelSelected={levelSelected}
        statusIdSelected={statusIdSelected}
        districtSelected={districtSelected}
      />

      {openAddDialog && (
        <AddRecordsManagement
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={onSuccessAdd}
          cgisId={cgisId}
        />
      )}

      {openEditDialog && (
        <EditRecordsManagement
          isOpen={openEditDialog}
          planningId={planningId}
          onClose={handleCloseEditDialog}
          onSuccess={onSuccessEdit}
          cgisId={cgisId}
        />
      )}

      {openDeleteDialog && (
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSuccess={onDeletePlanning}
          header={"Xác nhận xóa"}
          content={"Bạn có chắc chắn muốn xóa?"}
        />
      )}
      {openLockDialog && (
        <LockDialog
          isOpen={openLockDialog}
          onClose={handleCloseLockDialog}
          onSuccess={onLockPlanning}
          header={"Xác nhận khóa"}
          content={"Bạn có chắc chắn muốn khóa?"}
        />
      )}
      {openUnLockDialog && (
        <UnLockDialog
          isOpen={openUnLockDialog}
          onClose={handleCloseUnLockDialog}
          onSuccess={onUnLockPlanning}
          header={"Xác nhận mở khóa"}
          content={"Bạn có chắc chắn muốn mở khóa?"}
        />
      )}
      {/* Create map modal */}
      <CreatMapView
        open={openCreatMapModal}
        isLock={isLock}
        mapId={mapIdSelected}
        planningId={planningIdSelected}
        handleClose={() => handleCloseCreatMapModal()}
        planningName={planningNameSelected}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(RecordsManagement);
