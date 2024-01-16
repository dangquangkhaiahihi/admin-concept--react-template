import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as appActions from "../../core/app.store";
import { bindActionCreators } from "redux";
//--- Styles
import "./news.scss";

//--- Component
import ListPlanning from "./list-planning-sync-down/list-planning-sync-down.view";
import CheckLoginDialog from "./check-login/check-login.view";
import UploadBlueprint from "./upload-blueprint/upload-blueprint.view";
import SearchPLanningSync from "./search-planning-sync/search-planning-sync.view";

//--- Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

//--- Redux store
import * as syncAction from "../../redux/store/planning-sync/planning-sync.store";
import * as crawlAction from "../../redux/store/planning-crawl/planning-crawl.store";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";
import StackedGroupedColumnChartReport from "./modal-statistic-planning-sync-up/stacked-grouped-column-chart-report";
import InfoDialog from "./modal-statistic-planning-sync-up/dialog-info.view";

const useStyles = makeStyles((theme) => ({
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
}));

function PlanningSync(props) {
  const { showLoading,isSyncUp,showSyncLoading } = props;
  const classes = useStyles();
  const [selectId, setSelectId] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [isLogin, SetIsLogin] = useState();
  const [newsModels, setNewsModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSyncManyDialog, setOpenSyncManyDialog] = useState(false);

  const [statisticModel, setStatisticModel] = useState([]);
  const [openShowChartDialog, setOpenShowChartDialog] = useState(false);

  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    GetListAll();
    CheckLogin();
  }, []);

  const CheckLogin = (
    userName = "",
    passWord = "",
    isRemember = true
  )=>
  {
    showLoading(true);
    syncAction.CheckLogin(userName,passWord,isRemember).then((res)=>{
      if(res && res.content && res.content.status)
      {
        SetIsLogin(true)
        ShowNotification(
          "Đăng nhập thành công!",
          NotificationMessageType.Success
      );
      }
      else
      {
        SetIsLogin(false)
        ShowNotification(
          viVN.Errors.EmailNotRegister,
          NotificationMessageType.Error
      );
      }
      showLoading(false);
    })
    .catch((err) => {
      SetIsLogin(false)
      showLoading(false);
    });
  }
  useEffect(() => {
    console.log("newsModels",newsModels)
  }, [newsModels]);

  const GetListAll = (
    pageIndex = 1,
    pageSize,
    sort,
    keyword,
    status,
    isSuccess
  ) => {
    setPage(pageIndex - 1);
    if(isSyncUp){
      syncAction.GetListPlanningSyncUp(
        pageIndex,
        pageSize,
        sort,
        keyword,
        status,
        isSuccess
      ).then((res) => {
        syncAction.GetStatisticPlanningSyncUp().then(res => {
          if (res && res.content) {
            // //fake data
            // res.content.map((item,index) => {
            //   if(index == 0) {
            //     item.fail = 2;
            //     item.success = 1
            //   }
            //   if(index == 1) {
            //     item.syncied = 12;
            //     item.unsync = 13
            //     item.fail = 6;
            //     item.success = 6
            //   }
            //   if(index == 2) {
            //     item.syncied = 6;
            //     item.unsync = 4
            //     item.fail = 4;
            //     item.success = 2
            //   }
            //   if(index == 3) {
            //     item.syncied = 17;
            //     item.unsync = 3
            //     item.fail = 10;
            //     item.success = 7
            //   }
            // })
            setStatisticModel(res.content);
          }
        });

        if (res && res.content) {
          setNewsModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      })
      .catch((err) => {
        ShowNotification(
          viVN.Errors.AccessDenied,
          NotificationMessageType.Error
        );
      });
    }
    else{
      syncAction.GetListPlanningSyncDown(
        pageIndex,
        pageSize,
        sort,
        keyword,
        status
      ).then((res) => {
        console.log(res)
        if (res && res.content) {
          setNewsModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      }).catch((err) => {
        ShowNotification(
          viVN.Errors.AccessDenied,
          NotificationMessageType.Error
        );
      });
    }
  };

  const handleOpenSyncDialog = (currentId) => {
    setCurrentId(currentId);
    setOpenDeleteDialog(true);
  };
  const handleOpenSyncManyDialog = (currentId) => {
    setOpenSyncManyDialog(true);
  };
  
  const handleSyncDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleCloseSyncManyDialog = () => {
    setOpenSyncManyDialog(false);
  };
  
  const [openEditDialog, setOpenEditDialog] = useState(false);


  const handleOpenEditDialog = (id) => {
    setCurrentId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const ShowNotificationError = (messages) => {
    ShowNotification(messages, NotificationMessageType.Error);
  };


  const onSubmit = async () => {
    await GetListAll(
      page + 1,
      rowsPerPage,
      orderBy + " " + order,
      keyword,
      status,
      isSuccess
    );
  };

  const refresh = () => {
    setOrderBy("modifiedDate");
    setOrder("desc");
    setKeyword("");
    setStatus(null);
    GetListAll(
      1,
      rowsPerPage,
      orderBy + " " + order,
      keyword,
      status,
    );
  };

  const crawlData = () =>
  {
    showLoading(true);
    crawlAction.CrawlData().then((res)=>{
      if(res && res.content)
      {
        ShowNotification(
          "Cập nhật dữ liệu thành công!",
          NotificationMessageType.Success
      );
      }
      else
      {
        ShowNotification(
          "Cập nhật dữ liệu thất bại!",
          NotificationMessageType.Warning
      );
      }
      showLoading(false);
    })
    .catch((err) => {
      showLoading(false);
    });
  }
  const disconnect = () =>{
   
    syncAction.RemoveConection().then((res)=>{
      if(res && res.content)
      {
        showLoading(false);
        ShowNotification(
          "Hủy kết nối thành công!",
          NotificationMessageType.Success
      );     
      SetIsLogin(false);
      }
      else
      {
        showLoading(false);
        ShowNotification(
          "Hủy kết nối  thất bại!",
          NotificationMessageType.Warning
      );
      }
      
     
    })
    .catch((err) => {
      showLoading(false);
    });
  }
  const sync = () =>
  {

    showLoading(true);
    let params = {planningId: currentId}
    syncAction.Sync(params).then((res)=>{
      if(res && res.content)
      {
        ShowNotification(
          "Đồng bộ dữ liệu thành công!",
          NotificationMessageType.Success
      );
      }
      else
      {
        ShowNotification(
          "Đồng bộ dữ liệu thất bại!",
          NotificationMessageType.Warning
      );
      }
      onSubmit();
      showLoading(false);
      setOpenDeleteDialog(false);
    })
    .catch((err) => {
      showLoading(false);
      setOpenDeleteDialog(false);
    });
  }  
  const syncDown = () =>
  {

    showLoading(true);
    let params = {craw: currentId}
    crawlAction.Sync(currentId).then((res)=>{
      if(res && res.content)
      {
        ShowNotification(
          "Đồng bộ dữ liệu thành công!",
          NotificationMessageType.Success
      );
      }
      else
      {
        ShowNotification(
          "Đồng bộ dữ liệu thất bại!",
          NotificationMessageType.Warning
      );
      }
      onSubmit();
      showLoading(false);
      setOpenDeleteDialog(false);
    })
    .catch((err) => {
      showLoading(false);
      setOpenDeleteDialog(false);
    });
  }  
  const SyncMany = () =>
  {
    showSyncLoading(true);
    if(selectId.length == 0)
    {
      ShowNotification("Bạn chưa chọn quy hoạch nào!",NotificationMessageType.Warning);
      showSyncLoading(false);
    return;
    }
    let params = {planningId: selectId}
    syncAction.SyncMany(params).then((res)=>{
      if(res && res.content)
      {
        ShowNotification(
          "Đồng bộ dữ liệu thành công!",
          NotificationMessageType.Success
      );
      }
      else
      {
        ShowNotification(
          "Đồng bộ dữ liệu thất bại!",
          NotificationMessageType.Warning
      );
      }
      onSubmit();
      showSyncLoading(false);
      setOpenDeleteDialog(false);
      handleCloseSyncManyDialog();
    })
    .catch((err) => {
      showSyncLoading(false);
      setOpenDeleteDialog(false);
      handleCloseSyncManyDialog();
    });
  } 
  return (
    <div className={`slider ${classes.positionRelative}`}>
      <SearchPLanningSync
        status={status}
        keyword={keyword}
        setKeyword={setKeyword}
        setStatus={setStatus}
        refresh={refresh}
        onSubmit={onSubmit}
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
      />
      {/* {
        isSyncUp ?? (
        <div className="form-row">
          <div class={`form-group col-12 col-lg-12 'd-flex flex-column'}`} style={{ display: "flex" }}>
            <div className="col-6" style={{ paddingLeft: "0px" }}>
              <button class="btn btn-ct btn-primary-ct" onClick={crawlData} style={{ color: "white", margin: "0px 0px" }}>
                Cập nhật danh sách
              </button>
            </div>
          </div>
        </div>
        )
      } */}
      {isLogin && (
        <div className="form-row">
          <div
            class={`form-group col-12 col-lg-12 'd-flex flex-column'}`}
            style={{ display: "flex" }}
          >
            {isSyncUp ?? (
              <div style={{ paddingLeft: "0px" }}>
                <button
                  class="btn btn-ct btn-primary-ct"
                  onClick={crawlData}
                  style={{ color: "white", margin: "0px 0px" }}
                >
                  Cập nhật danh sách
                </button>
              </div>
            )}
            {isSyncUp && (
              <div style={{ paddingLeft: "0px" }}>
                <button
                  class="btn btn-ct btn-primary-ct"
                  onClick={() => {setOpenShowChartDialog(true)}}
                  style={{ color: "white", margin: "0px 0px" }}
                >
                  Biểu đồ thống kê
                </button>
              </div>
            )}
            <div className="col-6" style={{ paddingLeft: "10px" }}>
              <button
                class="btn btn-ct btn-danger-ct"
                onClick={disconnect}
                style={{ color: "white", margin: "0px 0px" }}
              >
                Hủy kết nối
              </button>
            </div>
          </div>
        </div>
      )}
      {newsModels ? (
        <ListPlanning
          isSyncUp={isSyncUp}
          totalItemCount={totalItemCount}
          GetListAll={GetListAll}
          editAction={handleOpenEditDialog}
          setOrder={setOrder}
          newsModels={newsModels}
          setOrderBy={setOrderBy}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          order={order}
          orderBy={orderBy}
          page={page}
          rowsPerPage={rowsPerPage}
          keyword={keyword}
          status={status}
          syncAction={handleOpenSyncDialog}
          syncManyAction={handleOpenSyncManyDialog}
          selectId={selectId}
          setSelectId={setSelectId}
        />
      ) : (
        ""
      )}
      {openEditDialog && (
        <UploadBlueprint
          currentId={currentId}
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          ShowNotificationError={ShowNotificationError}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setKeyword={setKeyword}
          setStatus={setStatus}
          order={order}
          orderBy={orderBy}
          keyword={keyword}
          status={status}
        />
      )}
      {!isLogin && (
        <CheckLoginDialog
          CheckLogin={CheckLogin}
          SetIsLogin={SetIsLogin}
          isLogin={isLogin}
        />
      )}
      {openDeleteDialog && (
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleSyncDialog}
          onSuccess={isSyncUp ? sync : syncDown}
          btnName={"Đồng bộ"}
          header={"Xác nhận đồng bộ"}
          content={"Quá trình đồng bộ sẽ diễn ra trong ít phút. Vui lòng đợi!"}
        />
      )}
      {openSyncManyDialog && (
        <DeleteDialog
          isOpen={openSyncManyDialog}
          onClose={handleCloseSyncManyDialog}
          onSuccess={SyncMany}
          btnName={"Đồng bộ"}
          header={"Xác nhận đồng bộ"}
          content={"Quá trình đồng bộ sẽ diễn ra trong ít phút. Vui lòng đợi!"}
        />
      )}
      {openShowChartDialog && (
        <InfoDialog
          isOpen={openShowChartDialog}
          onClose={() => setOpenShowChartDialog(false)}
          btnName={"Đồng bộ"}
          // header={"Thống kê theo trạng thái đồng bộ"}
          content={<StackedGroupedColumnChartReport data={statisticModel} />}
        />
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
      showSyncLoading: appActions.ShowSyncLoading,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PlanningSync);