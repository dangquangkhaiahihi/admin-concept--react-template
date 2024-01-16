import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import "./bottom-control.scss";
import ListAnalysisNote  from "./list-analysis-note"
import {Button} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import AddAnalysisNote from "./add-analysis-note.view";
import EditAnalysisNote from "./edit-analysis-note.view";
import * as analysisNoteAction from "../../../../../redux/store/analysis-note/analysis-note.store";
import { Configs } from "../../../../../common/config";
import DeleteDialog from "../../../../../components/dialog-delete/dialog-delete.view";
import ShowNotification from "../../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../../utils/configuration";
import * as viVN from "../../../../../language/vi-VN.json";
function AnalysisNote(props) {
  const [isHide, setIsHide] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("desc");
  const [noteId,setNoteId] = useState(0);
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState(); 
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const GetListAll = async (pageIndex = 1, pageSize, sort) => {
    setPage(pageIndex - 1);
    try {
      const res = await analysisNoteAction.GetListAll(
        props.analysisId,
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
  const handleDelete = () => {
    analysisNoteAction.DeleteAnalysisNote(noteId).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(1, rowsPerPage, orderBy + " " + order);
          setOpenDeleteDialog(false);
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
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const handleOpenDeleteDialog = (noteId) => {
    setNoteId(noteId);
    setOpenDeleteDialog(true);
  };
  const handleOpenEditDialog = (noteId) => {
    setNoteId(noteId);
    setOpenEditDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  return (
    <>
      <div
        style={!isHide ? { height: "300px" } : { height: "60px" }}
        className={isHide ? "container-bottom-hide" : "container-bottom"}>
        {isHide ? (
          <button
            onClick={() => setIsHide(!isHide)}
            title="Hiện"
            className="hide-button"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        ) : (
          <>
            <div>
              <b className="head__title">Danh sách thuyết minh</b>
              <button
                onClick={() => setIsHide(!isHide)}
                title="Ẩn"
                className="head__button-hide"
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </button>
            </div>
            <div className="d-sm-flex align-items-center justify-content-between mb-3">
              <div></div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddDialog}
                startIcon={<AddCircle />}
              >
                Thêm thuyết minh
              </Button>
            </div>
            <ListAnalysisNote
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
              //openCreatMapModal={handleOpenCreatMapModal}
            >
            </ListAnalysisNote>
          </>
        )}
      </div>
      {openAddDialog && (
        <AddAnalysisNote
          analysisId={props.analysisId}
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          order={order}
          orderBy={orderBy}
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
      {openEditDialog && (
        <EditAnalysisNote
          noteId={noteId}
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      )}
    </>
  );
}

export default AnalysisNote;
