import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Configs } from "../../../common/config";

//--- Material Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import dateformat from "dateformat";

//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

//--- Material Control
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import * as documentStore from '../../../redux/store/document/document-management.store';
import DeleteDialog from "../../../components/dialog-delete/dialog-delete.view";
import DocumentPreviewView from '../document-dialog/document-preview-dialog.view'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: window.outerHeight - 365,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const headCells = [
  { id: "name", hideSortIcon: false, label: "Tên file" },
  { id: "title", hideSortIcon: false, label: "Tiêu đề" },
  //{ id: "createdBy", hideSortIcon: false, label: "Người tạo" },
  //{ id: "createdDate", hideSortIcon: false, label: "Ngày tạo" },
  //{ id: "modifiedBy", hideSortIcon: false, label: "Người sửa" },
  //{ id: "modifiedDate", hideSortIcon: false, label: "Ngày sửa" },
  { id: "actions", hideSortIcon: true, label: "" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            className="pt-3 pb-3 text-nowrap"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.hideSortIcon ? true : false}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//EnhancedTableHead.propTypes = {
//  classes: PropTypes.object.isRequired,
//  onRequestSort: PropTypes.func.isRequired,
//  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//  orderBy: PropTypes.string.isRequired,
//  rowCount: PropTypes.number.isRequired,
//};

function IconPDF() {
    return (
        <img
            src={require("../../../assets/icon/pdf.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function IconDOCX() {
    return (
        <img
            src={require("../../../assets/icon/microsoft-word.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function IconXLSX() {
    return (
        <img
            src={require("../../../assets/icon/excel.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function IconImages() {
    return (
        <img
            src={require("../../../assets/icon/picture.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function IconOtherFile() {
    return (
        <img
            src={require("../../../assets/icon/paper.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function DocumentListFileView(props) {
    const {
        editAction,
        parentId,
        setOrder,
        setOrderBy,
        setPage,
        setRowsPerPage,
        order,
        page,
        rowsPerPage,
        orderBy,
        GetLookupCommune,
        totalItemCount,
        GetAllFileByFolder,
        SaveCurrentData,
    } = props;
  //--- Config table
    const classes = useStyles();
    const [openDeleteFileDialog, setOpenDeleteFileDialog] = useState(false);
    const [currentFile, setCurrentFile] = useState();
    const [isShowPreviewDialog, setIsShowPreviewDialog] = useState(false);

  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    let sort = isAsc ? "desc" : "asc";
      let sortExpression = property + " " + sort;
      GetAllFileByFolder(parentId, page + 1, rowsPerPage);
    //GetListDistrict(page + 1, rowsPerPage, sortExpression, userName);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
      let sortExpression = orderBy + " " + order;
      GetAllFileByFolder(parentId, newPage + 1, rowsPerPage);
    //GetListDistrict(newPage + 1, rowsPerPage, sortExpression, userName);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
      let sortExpression = orderBy + " " + order;
      GetAllFileByFolder(parentId, 1, event.target.value);
    //GetListDistrict(1, event.target.value, sortExpression, userName);
  };

    const onCloseAddOrEditDialog=() =>{
        setCurrentFile(null);
        setOpenDeleteFileDialog(false);
    }

    const handleDeleteFile = (data) => {
        setCurrentFile(data);
        setOpenDeleteFileDialog(true);
    }

    const onSuccessDeleteFile = () => {
        if (!currentFile) return;
        props.DeleteFile(currentFile, page+1, rowsPerPage);
        onCloseAddOrEditDialog();
    }

    const onEdit = (data) => {
        if (data && data.districtId)
            GetLookupCommune(data.districtId);
        editAction(data);
    }

    const onPreview = (data) => {
        SaveCurrentData(data);
        setIsShowPreviewDialog(true);
    }

    const onClosePreviewDialog = () => {
        setIsShowPreviewDialog(false);
    }
  const emptyRows =
    rowsPerPage -
      Math.min(rowsPerPage, props.listAllFile.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
          <TableContainer className={classes.tableContainer}>
              <Table className={classes.table} size="small" stickyHeader>
                  <EnhancedTableHead
                      classes={classes}
                      //order={order}
                      //orderBy={orderBy}
                      //onRequestSort={handleRequestSort}
                      rowCount={props.listAllFile.length}
                  />
                  <TableBody>
                      {props.listAllFile && props.listAllFile.length > 0 ? (
                          props.listAllFile.map((row, index) => {
                              return (
                                  <TableRow hover tabIndex={-1} key={row.id}>
                                      <TableCell>
                                          {
                                              row.extension === "PDF"
                                                  ? <IconPDF />
                                                  : row.extension === "DOCX"
                                                      ? <IconDOCX />
                                                      : row.extension === "XLSX"
                                                          ? <IconXLSX />
                                                          : row.extension === "PNG" ||
                                                              row.extension === "JPEG" ||
                                                              row.extension === "JPG"
                                                              ? <IconImages />
                                                              : <IconOtherFile />
                                          }
                                          {row.name}</TableCell>
                                      <TableCell>{row.title}</TableCell>
                                      {
                                      //<TableCell>{row.created_by}</TableCell>
                                      //<TableCell>
                                      //    {row.createdDate
                                      //        ? dateformat(row.created_date, "dd-mm-yyyy")
                                      //        : null}
                                      //</TableCell>
                                      //<TableCell>{row.modified_by}</TableCell>
                                      //<TableCell>
                                      //    {row.modifiedDate
                                      //        ? dateformat(row.modified_date, "dd-mm-yyyy")
                                      //        : null}
                                      //</TableCell>
                                      }
                                      <TableCell align="right" className="text-nowrap">
                                          <Tooltip title="Xem">
                                              <IconButton
                                                  aria-label="view"
                                                  onClick={() => onPreview(row)}
                                              >
                                                  <VisibilityIcon className="text-primary" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Sửa">
                                              <IconButton
                                                  aria-label="edit"
                                                  onClick={() => onEdit(row)}
                                              >
                                                  <EditIcon className="text-primary" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Xóa">
                                              <IconButton
                                                  aria-label="delete"
                                                  onClick={()=>handleDeleteFile(row)}
                                              >
                                                  <DeleteIcon className="text-danger" />
                                              </IconButton>
                                          </Tooltip>
                                      </TableCell>
                                  </TableRow>
                              );
                          })
                      ) : (
                              <TableRow hover tabIndex={-1}>
                                   <TableCell colSpan={9} className="text-center">
                                        Không có dữ liệu
                                   </TableCell>
                              </TableRow>
                          )}
                      {emptyRows > 0 && (
                          <TableRow style={{ height: 0 }}>
                              <TableCell
                                  colSpan={4}
                                  style={{ padding: 0, borderBottom: 0 }}
                              />
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </TableContainer>

          {totalItemCount && totalItemCount > 0 ? (
              <TablePagination
                  rowsPerPageOptions={Configs.DefaultPageSizeOption}
                  component="div"
                  count={totalItemCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  labelRowsPerPage={"Số hàng mỗi trang"}
                  labelDisplayedRows={({ from, to, count }) => {
                      return "" + from + "-" + to + " trong " + count || "";
                  }}
              />
          ) : (
                  ""
              )}

          {openDeleteFileDialog && (
              <DeleteDialog
                  isOpen={openDeleteFileDialog}
                  onClose={onCloseAddOrEditDialog}
                  onSuccess={onSuccessDeleteFile}
                  header={"Xóa file"}
                  content={"Bạn có chắc chắn muốn xóa?"}
              />
          )}

          {isShowPreviewDialog &&
              <DocumentPreviewView
              onClosePreviewDialog={onClosePreviewDialog}
              isShowPreviewDialog={isShowPreviewDialog}
          />
          }
    </div>
  );
}

const mapStateToProps = state => ({
    InitDocument: state.InitDocument,
    totalItemCount: state.InitDocument.totalItemCount,
    listAllFile: state.InitDocument.listAllFile,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    SaveCurrentData: documentStore.SaveCurrentData,
    GetAllFileByFolder: documentStore.GetAllFileByFolder,
    GetLookupCommune: documentStore.GetLookupCommune,
    DeleteFile: documentStore.DeleteFile,
    CreateFile: documentStore.CreateFile,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListFileView)