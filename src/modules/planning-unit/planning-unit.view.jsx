import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";

import { Button } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";

import ListPlanningUnit from "./list-planning-unit/list-planning-unit.view";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";
import EditPlanningUnit from "./edit-planning-unit/edit-planning-unit.view";
import AddPlanningUnit from "./add-planning-unit/add-planning-unit.view";

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

import * as planningUnitAction from "../../redux/store/planning-unit/planning-unit.store";

const PlanningUnit = () => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [planningId, setPlanningId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  useEffect(() => {
    GetListAll();
  }, []);

  const GetListAll = (pageIndex = 1, pageSize, sort) => {
    setPage(pageIndex - 1);
    planningUnitAction
      .GetListAll(pageIndex, pageSize, sort)
      .then((res) => {
        if (res && res.content) {
          setData(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      })
      .catch((err) => ShowNotification(
        viVN.Errors.AccessDenied,
        NotificationMessageType.Error
      ));
  };

  const handleDelete = () => {
    planningUnitAction.DeletePlanning(planningId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.PlaningUnitDeleteSuccess,
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
          handleCloseDeleteDialog();
      }
    );
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (planningId) => {
    setPlanningId(planningId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (planningId) => {
    setPlanningId(planningId);
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
          Thêm Đơn Vị
        </Button>
      </div>
      {data && (
        <ListPlanningUnit
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
        <AddPlanningUnit
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
        <EditPlanningUnit
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          planningId={planningId}
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

export default PlanningUnit;
