/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Material Control
import Button from "@material-ui/core/Button";

//--- Material Icon
import AddCircle from "@material-ui/icons/AddCircle";

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as opinionFormAction from "../../redux/store/opinion-form/opinion-form.store";
import * as config from "../../common/config";
import * as appActions from "../../core/app.store";

//--- Component
import CreateFormComponent from "./add-opinion-form/add-opinion-form.view";
import EditFormComponent from "./edit-opinion-form/edit-opinion-form.view";
import PreviewOpinionForm from "./preview-opinion-form/preview-opinion-form.view";
import SearchFormComponent from "./search-opinion-form/search-opinion-form.view";
import ListFormComponent from "./list-opinion-form/list-opinion-form.view";
import DiaLogDelete from "../../components/dialog-delete/dialog-delete.view";

function OpinionForm(props) {
  const { showLoading } = props;

  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [isShowUpdateModal, setShowUpdateModal] = useState(false);
  const [isShowDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowPreviewModal, setShowPreviewModal] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [pageIndex, setPageIndex] = useState(config.Configs.DefaultPageIndex);
  const [pageSize, setPageSize] = useState(config.Configs.DefaultPageSize);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");

  const [title, setTitle] = useState("");

  const [dataItem, setDataItem] = useState("");

  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();

  useEffect(() => {
    GetAllData();
  }, []);

  const GetAllData = () => {
    showLoading(true);
    Promise.all([onGetFirstListData()])
      .then((res) => {
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const onGetFirstListData = () => {
    return new Promise((resolve, reject) => {
      opinionFormAction
        .GetListFormTemplate(pageIndex, pageSize, `${orderBy} ${order}`)
        .then(
          (res) => {
            let _dataList = (res && res.content && res.content.items) || [];
            let _totalItemCount =
              (res && res.content && res.content.totalItemCount) || 0;

            setDataList(_dataList);
            setTotalItemCount(_totalItemCount);
            resolve(res);
          }
        ).catch((err) => {
          showLoading(false)
          err.errorMessage && ShowNotification(viVN.Errors.AccessDenied, NotificationMessageType.Error);
        })
    });
  };

  const onGetData = (
    _pageIndex = config.Configs.DefaultPageIndex,
    _pageSize = config.Configs.DefaultPageSize,
    _sortExpression = `modifiedDate desc`,
    _title = "",
    _consultantCommunityId = null,
    callBack
  ) => {
    showLoading(true);
    setPageIndex(_pageIndex - 1);
    setPageSize(_pageSize);
    opinionFormAction
      .GetListFormTemplate(
        _pageIndex,
        _pageSize,
        _sortExpression,
        _title,
        _consultantCommunityId
      )
      .then(
        (res) => {
          let _dataList = (res && res.content && res.content.items) || [];
          let _totalItemCount =
            (res && res.content && res.content.totalItemCount) || 0;

          setDataList(_dataList);
          setTotalItemCount(_totalItemCount);
          callBack && callBack();
          showLoading(false);
        },
        (err) => {
          showLoading(false);
        }
      );
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  //Edit Dialog
  const handleOpenEditDialog = (_data) => {
    if (!_data) return;

    setShowUpdateModal(true);
    setDataItem(_data);
  };

  const handleCloseEditDialog = () => {
    setShowUpdateModal(false);
    setDataItem(null);
  };

  //--- Delete Dialog
  const handleOpenDeleteDialog = (_data) => {
    if (!_data) return;

    setShowDeleteModal(true);
    setDataItem(_data);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteModal(false);
    setDataItem(null);
  };

  //--- Preview Dialog
  const handleOpenPreviewDialog = (_data) => {
    if (!_data) return;

    setShowPreviewModal(true);
    setDataItem(_data);
  };

  const handleClosePreviewDialog = () => {
    setShowPreviewModal(false);
    setDataItem(null);
  };

  const handleDelete = () => {
    if (!dataItem) return;
    showLoading(true);
    opinionFormAction.DeleteFormTemplate({ formTemplateId: dataItem.id }).then(
      (res) => {
        if (res && res.content && res.content.status) {
          onGetData(
            config.Configs.DefaultPageIndex,
            pageSize,
            orderBy ? orderBy + " " + order : "",
            title
          );
          handleCloseDeleteDialog();
          showLoading(false);
          ShowNotification(
            viVN.Success.FormTemplateDeleteSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        showLoading(false);
        handleCloseDeleteDialog();
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        );
      }
    );
  };

  return (
    <div className="email-templates">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <SearchFormComponent
          callBack={onGetData}
          setTitle={setTitle}
          title={title}
          rowsPerPageCommon={rowsPerPageCommon}
          setOrderBy={setOrderBy}
          setOrder={setOrder}
          orderBy={orderBy}
          order={order}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
          startIcon={<AddCircle />}
        >
          Thêm form
        </Button>
      </div>

      <ListFormComponent
        callBack={onGetData}
        dataList={dataList}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItemCount={totalItemCount}
        setTotalItemCount={setTotalItemCount}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        handleOpenEditDialog={handleOpenEditDialog}
        handleOpenPreviewDialog={handleOpenPreviewDialog}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      />

      {isShowCreateModal && (
        <CreateFormComponent
          isShow={isShowCreateModal}
          onShow={handleCloseCreateModal}
          callBack={onGetData}
        />
      )}

      {isShowUpdateModal && (
        <EditFormComponent
          isShow={isShowUpdateModal}
          onShow={handleCloseEditDialog}
          callBack={onGetData}
          dataItem={dataItem}
        />
      )}

      {isShowPreviewModal && (
        <PreviewOpinionForm
          isShow={isShowPreviewModal}
          onShow={handleClosePreviewDialog}
          callBack={onGetData}
          dataItem={dataItem}
        />
      )}

      {isShowDeleteModal && (
        <DiaLogDelete
          isOpen={isShowDeleteModal}
          rowsPerPageCommon={rowsPerPageCommon}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OpinionForm);
