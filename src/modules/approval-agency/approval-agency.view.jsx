import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Configs } from "../../common/config";

import { Button } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";

import ListApprovalAgency from "./list-approval-agency/list-approval-agency.view";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";
import EditApprovalAgency from "./edit-approval-agency/edit-approval-agency.view";
import AddApprovalAgency from "./add-approval-agency/add-approval-agency.view";

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

import * as appActions from "../../core/app.store";
import * as approvalAgencyAction from "../../redux/store/approval-agency/approval-agency.store";
import * as planningAction from "../../redux/store/planning/planning.store";

const ApprovalAgency = (props) => {
  const { showLoading } = props;
  const [page, setPage] = useState(0);
  const [data, setData] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [approvalAgencyId, setApprovalAgencyId] = useState();
  const [approvalAgencyLevel, setApprovalAgencyLevel] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  const getData = useCallback(async () => {
    showLoading(true);
    try {
      await GetListAll();
      await getApprovalAgencyLevel();
      showLoading(false);
    } catch (error) {
      showLoading(false);
    }
  }, [showLoading]);

  useEffect(() => {
    getData();
  }, [getData]);

  const GetListAll = async (pageIndex = 1, pageSize, sort) => {
    setPage(pageIndex - 1);
    try {
      const res = await approvalAgencyAction.GetListAll(
        pageIndex,
        pageSize,
        sort
      );
      if (res && res.content) {
        setData(res.content.items);
        setTotalItemCount(res.content.totalItemCount);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getApprovalAgencyLevel = async () => {
    try {
      const res = await planningAction.ApprovalAgencyLevel();
      if (res && res.content) {
        setApprovalAgencyLevel(res.content);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = () => {
    approvalAgencyAction.DeleteApprovalAgency(approvalAgencyId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.ApprovalAgencyDeleteSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        err &&
          err.errorType &&
          ShowNotification(
            err.errorMessage,
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

  const handleOpenEditDialog = (approvalAgencyId) => {
    setApprovalAgencyId(approvalAgencyId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (approvalAgencyId) => {
    setApprovalAgencyId(approvalAgencyId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div className="slider">
      <div className="d-sm-flex align-items-center justify-content-between mb-3">
        <div></div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
          startIcon={<AddCircle />}
        >
          Thêm cơ quan
        </Button>
      </div>
      {data && (
        <ListApprovalAgency
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
          approvalAgencyLevel={approvalAgencyLevel}
        />
      )}
      {openAddDialog && (
        <AddApprovalAgency
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          approvalAgencyLevel={approvalAgencyLevel}
        />
      )}
      {openEditDialog && (
        <EditApprovalAgency
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          approvalAgencyId={approvalAgencyId}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          approvalAgencyLevel={approvalAgencyLevel}
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

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalAgency);
