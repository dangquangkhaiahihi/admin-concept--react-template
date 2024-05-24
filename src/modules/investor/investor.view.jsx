import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";

import { Button } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";

import ListInvestor from "./list-investor/list-investor.view";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";
import EditInvestor from "./edit-investor/edit-investor.view";
import AddInvestor from "./add-investor/add-investor.view";

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

import * as investorAction from "../../redux/store/investor/investor.store";

const Investor = () => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [investorId, setInvestorId] = useState();

  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  useEffect(() => {
    GetListAll();
  }, []);

  const GetListAll = (pageIndex = 1, pageSize, sort) => {
    setPage(pageIndex - 1);
    investorAction
      .GetListAll(pageIndex, pageSize, sort)
      .then((res) => {
        if (res && res.content) {
          setData(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      })
      .catch((err) => {
        ShowNotification(
          viVN.Errors.AccessDenied, 
          NotificationMessageType.Error);
      });
  };

  const handleDelete = () => {
    investorAction.DeleteInvestor(investorId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          handleCloseDeleteDialog();
          ShowNotification(viVN.Success.InvestorDeleteSuccess, NotificationMessageType.Success);

        }
      },
      (err) => {
        handleCloseDeleteDialog();
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

  const handleOpenEditDialog = (investorId) => {
    setInvestorId(investorId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (investorId) => {
    setInvestorId(investorId);
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
          Thêm Chủ Đầu Tư
        </Button>
      </div>
      {data && (
        <ListInvestor
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
        />
      )}
      {openAddDialog && (
        <AddInvestor
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}
      {openEditDialog && (
        <EditInvestor
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          investorId={investorId}
          GetListAll={GetListAll}
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
};

export default Investor;
