import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Configs } from "../../../common/config";

import { Button } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";

import ListAnalysis from "./list-analysis/list-analysis.view.jsx";
import DeleteDialog from "../../../components/dialog-delete/dialog-delete.view";
import EditAnalysis from "./edit-analysis/edit-analysis.view";
import AddAnalysis from "./add-analysis/add-analysis.view";

import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import CreatMapView from "./create-map/create-map";
import * as appActions from "../../../core/app.store";
import * as analysisAction from "../../../redux/store/analysis/analysis.store";
import * as planningAction from "../../../redux/store/planning/planning.store";
import SearchAnalysis from "./search-analysis/search-analysis";
import { makeStyles } from "@material-ui/core/styles";
import ModalReportAnalysis from "./analysis-planning-statistic/document-planning-statistic.view";

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
    top: '38px',
    zIndex: 10,
    right: '28px',
    color: "#3f51b5",
    cursor: "pointer",
    '@media (max-width: 1224px)': {
      top: '8px',
      right: '20px',
    }
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

const Analysis = (props) => {
  const classes = useStyles();

  const { showLoading } = props;
  const [mapIdSelected, setMapIdSelected] = useState(null);
  const [planningIdSelected, setPlanningIdSelected] = useState(null);
  const [planningNameSelected, setPlanningNameSelected] = useState("");
  const [key, setKeyWord] = useState();
  const [page, setPage] = useState(0);
  const [data, setData] = useState();
  const [dataStatistic, setDataStatistic] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [analysisId, setAnalysisId] = useState();
  const [openCreatMapModal, setOpenCreatMapModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  const [isOpenReportDialog, setIsOpenReportDialog] = useState(false);

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

  const getData = useCallback(async () => {
    showLoading(true);
    try {
      await GetListAll();
      showLoading(false);
    } catch (error) {
      showLoading(false);
    }
  }, [showLoading]);

  useEffect(() => {
    getData();
  }, [getData]);
  const handleCloseCreatMapModal = () => {
    //onGetListPlanning();
    setOpenCreatMapModal(false);
  };
  const handleOpenCreatMapModal = (analysisId,mapId, planningId, planningName, status) => {
    showLoading(true);
    setAnalysisId(analysisId);
    setMapIdSelected(mapId);
    setOpenCreatMapModal(true);
    setPlanningNameSelected(planningName);
    setPlanningIdSelected(planningId);
    showLoading(false);
  };
  const GetListAll = async (pageIndex = 1, pageSize, sort,keyword= '') => {
    setPage(pageIndex - 1);
    try {
      const res = await analysisAction.GetListAll(
        pageIndex,
        pageSize,
        sort,
        keyword
      );
      if (res && res.content) {
        setData(res.content.items);
        setTotalItemCount(res.content.totalItemCount);
        const temp = countObjectsWithSamePlanningId(res.content.items);
        console.log("sadasdasdasd",temp);
        setDataStatistic(temp);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function countObjectsWithSamePlanningId(data) {
    const planningIdCountMap = {};
  
    // Iterate through the input data and count objects with the same planningId
    data.forEach((item) => {
      const planningId = item.planningId;
  
      if (planningIdCountMap[planningId]) {
        planningIdCountMap[planningId].count++;
      } else {
        planningIdCountMap[planningId] = {
          planningId: planningId,
          planningName: item.planningName,
          count: 1,
        };
      }
    });
  
    // Convert the count map into an array of objects
    const result = Object.values(planningIdCountMap);
  
    return result;
  }
  

  const handleDelete = () => {
    analysisAction.DeleteAnalysis(analysisId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.DeleteSuccess,
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
      }
    );
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (analysisId) => {
    setAnalysisId(analysisId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (analysisId) => {
    setAnalysisId(analysisId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const refresh = () => {
    getData(1, rowsPerPage, Configs.DefaultSortExpression, '');
  };
  return (
    <div className="slider">
      <div
        className={`${classes.btnAdd} ${
          props?.hiddenAddButton ? classes.disNone : ''
        }`}
        onClick={handleOpenAddDialog}
      >
        <span className={`${classes.btnAddContent}`}>
          <AddCircle className={classes.mr05} />
          Thêm mới
        </span>
      </div>

      <SearchAnalysis
        onGetList={GetListAll}
        pageSize={rowsPerPage}
        refresh={refresh}
        keywword ={key}
      />
      {/* <div className="d-sm-flex align-items-center justify-content-between mb-3">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
          startIcon={<AddCircle />}
        >
          Thêm Phân tích
        </Button>
      </div> */}
      
      <div className="form-row">
        <div
          class={`form-group col-12 col-lg-12 'd-flex flex-column'}`}
          style={{ display: "flex" }}
        >
          <div style={{ paddingLeft: "0px" }}>
            <button
              class="btn btn-ct btn-primary-ct"
              onClick={() => {setIsOpenReportDialog(true)}}
              style={{ color: "white", margin: "0px 0px" }}
            >
              Bảng thống kê
            </button>
          </div>
        </div>
      </div>

      {data && (
        <ListAnalysis
          totalItemCount={totalItemCount}
          data={data}
          GetListAll={GetListAll}
          editAction={handleOpenEditDialog}
          deleteAction={handleOpenDeleteDialog}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          openCreatMapModal = {handleOpenCreatMapModal}
          setMapIdSelected={setMapIdSelected}
          setPlanningIdSelected={setPlanningIdSelected}
        />
      )}
      {openAddDialog && (
        <AddAnalysis
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setOpenEditDialog={setOpenEditDialog}
          setAnalysisId={setAnalysisId}
          openCreatMapModal = {handleOpenCreatMapModal}
          groupParentList= {groupParentList}
        />
      )}
      {openEditDialog && (
        <EditAnalysis
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          analysisId={analysisId}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          groupParentList= {groupParentList}
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

      {
        isOpenReportDialog && 
        <ModalReportAnalysis
          isOpen={isOpenReportDialog}
          onClose={() => setIsOpenReportDialog(false)}
          data={dataStatistic}
        />
      }

      <CreatMapView
        open={openCreatMapModal}
        isLock={false}
        analysisId={analysisId}
        mapId={mapIdSelected}
        planningId={planningIdSelected}
        handleClose={() => handleCloseCreatMapModal()}
        planningName={planningNameSelected}
      />
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
