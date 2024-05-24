import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as logTemplateAction from "../../redux/store/log/log.store";
import * as appActions from "../../core/app.store";

//--- Component
import LogDetailDiaLog from "./detail-log/detail-log.view";
import SearchLog from "./search-log/search-log.view";
import ListLog from "./list-log/list-log.view";
import DiaLogDelete from "../../components/dialog-delete/dialog-delete.view";

function Log(props) {
  const { isLoading, showLoading } = props;
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [isDelete, setIsDelete] = useState("");
  const [logModels, setLogModels] = useState([]);
  const [logDel, setLogDel] = useState([]);
  const [contentModel, setContentModel] = useState("");
  const [logEditCode, setEditLogCode] = useState("");
  const [dataSearch, setDataSearch] = useState({
    level: "",
    startDate: "",
    endDate: ""
  });
  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("raiseDate");

  useEffect(() => {
    getListLogModels();
  }, []);

  // --- Add Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const getListLogModels = (
    pageIndex = 1,
    pageSize = 10,
    sortExpression = "raiseDate desc",
    level = "",
    startDate = "",
    endDate =  "",
    message = ""
  ) => {
    showLoading(true);
    setPage(pageIndex - 1);
    logTemplateAction
      .Log_GetListAll(message,sortExpression,pageIndex, pageSize, level,startDate, endDate)
      .then(
        (res) => {
          if (res && res.content && res.content.items) {
            setLogModels(res.content.items);
            setContentModel(res.content);
          }
          showLoading(false);
        },
        (err) => {
          showLoading(false)
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
  };
  const onChangeFormSearch = (e) =>{
    const { name, value } = e.target;
    setDataSearch({...dataSearch, [name]: value});
   
  }
  const handleOpenAddDialog = () => {
    setIsAddDialog(true);
    setOpenAddDialog(true);
  };

  const onHideModal = () => {
    setOpenAddDialog(false);
  };

  //Edit Dialog
  const handleOpenEditDialog = (data) => {
    setIsAddDialog(false);
    setEditLogCode(data);
    setOpenAddDialog(true);
  };

  //--- Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenDeleteDialog =  () => {
    if(logDel.length == 0) 
    ShowNotification(
      "Bạn chưa chọn bản ghi nào!",
      NotificationMessageType.Warning
    )
    else
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {

    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    logTemplateAction.Log_Delete(logDel).then(
      (res) => {
        if (res && res.content) {
          handleCloseDeleteDialog();
          document.getElementById("cbAll").checked = false;        
          for(let i = 0 ; i < logDel.length; i++ )
          {
            document.getElementById(logDel[i]).checked = false;
          }
          setLogDel([])
          getListLogModels(1, rowsPerPageCommon, dataSearch.level, dataSearch.startDate, dataSearch.endDate,dataSearch.message);

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

  return (
    <div className="logs">
        <SearchLog
          getListLogModels={getListLogModels}
          dataSearch={dataSearch}
          setDataSearch={setDataSearch}
          rowsPerPageCommon={rowsPerPageCommon}
          setOrderBy={setOrderBy}
          setOrder={setOrder}
          orderBy={orderBy}
          order={order}
          isDelete={isDelete}
          setIsDelete={setIsDelete}
          onChangeFormSearch={onChangeFormSearch}
          handleOpenAddDialog={handleOpenAddDialog}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
        ></SearchLog>

      {/* List Element Logs */}
      <ListLog
        logModels={logModels}
        handleOpenEditDialog={handleOpenEditDialog}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        getListLogModels={getListLogModels}
        dataSearch={dataSearch}
        contentModel={contentModel}
        setRowsPerPageCommon={setRowsPerPageCommon}
        page={page}
        setDataSearch={setDataSearch}
        setPage={setPage}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        order={order}
        orderBy={orderBy}
        logDel={logDel}
        setLogDel={setLogDel}
        logEditCode ={logEditCode}
        setEditLogCode ={setEditLogCode}
      />

      {openAddDialog ? (
            <LogDetailDiaLog
              logEditCode={logEditCode}
              openAddDialog={openAddDialog}
              onHideModal={onHideModal}
              getListLogModels={getListLogModels}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
            />
      ) : (
          ""
        )}

      {openDeleteDialog ? (
        <DiaLogDelete
          isOpen={openDeleteDialog}
          rowsPerPageCommon={rowsPerPageCommon}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
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

export default connect(mapStateToProps, mapDispatchToProps)(Log);
