import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import dateformat from "dateformat";
import * as config from "../../../common/config";

//--- Material Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FooterPagination from '../../../components/footer-pagination/footer-pagination';

//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

const headCells = [
  { id: "title", hideSortIcon: false, label: "Tên form" },
  { id: "modifiedDate", hideSortIcon: false, label: "Ngày sửa" },
  { id: "action", hideSortIcon: false, label: "" },
];

//Header for table cells
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} className="pt-3 pb-3 text-nowrap">
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.hideSortIcon ? true : false}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
function ListOpinionForm(props) {
  const {
    callBack,
    dataList,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    totalItemCount,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    handleOpenEditDialog,
    handleOpenPreviewDialog,
    handleOpenDeleteDialog,
  } = props;

  console.log("form props : ", props);

  const classes = useStyles();

  const emptyRows =
    pageSize - Math.min(pageSize, dataList.length - pageIndex * pageSize);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    let sort = isAsc ? "desc" : "asc";
    let sortExpression = property + " " + sort;
    callBack(pageIndex + 1, pageSize, sortExpression);
  };

  const handleChangePage = (event, newPage) => {
    setPageIndex(newPage);
    let sortExpression = orderBy + " " + order;
    callBack(newPage, pageSize, sortExpression);
  };

  const handleChangeRowsPerPage = (event) => {
    let _pageSize = parseInt(
      event.target.value,
      config.Configs.DefaultPageSize
    );
    setPageSize(_pageSize);
    setPageIndex(1);
    let sortExpression = orderBy + " " + order;
    callBack(1, _pageSize, sortExpression);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={dataList.length}
            />
            <TableBody>
              {dataList && dataList.length > 0 ? (
                dataList.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>
                        {dateformat(row.modified_date, "dd/mm/yyyy")}
                      </TableCell>

                      <TableCell align="right" className="text-nowrap">
                        <Tooltip title="Preview">
                          <IconButton
                            aria-label="preview"
                            color='primary'
                            onClick={() => handleOpenPreviewDialog(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <IconButton
                            aria-label="edit"
                            color='primary'
                            onClick={() => handleOpenEditDialog(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            aria-label="delete"
                            color='secondary'
                            onClick={() => handleOpenDeleteDialog(row)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={3} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={3}
                    style={{ padding: 0, borderBottom: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* {totalItemCount && totalItemCount > 0 ? (
          <TablePagination
            rowsPerPageOptions={config.Configs.DefaultPageSizeOption}
            component="div"
            count={totalItemCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={"Số hàng mỗi trang"}
            labelDisplayedRows={({ from, to, count }) => {
              return "" + from + "-" + to + " trong " + count;
            }}
          />
        ) : (
          ""
        )} */}
        {totalItemCount && totalItemCount > 0 ? (
          <FooterPagination
            totalItemCount={totalItemCount}
            currentPage={pageIndex}
            rowsPerPage={pageSize}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            totalPage={Math.ceil(dataList.length / pageSize)}
          />
        ) : (
          ''
        )}
      </Paper>
    </div>
  );
}
export default ListOpinionForm;
