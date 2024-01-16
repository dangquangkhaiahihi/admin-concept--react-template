import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import dateformat from "dateformat";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FooterPagination from "../../../components/footer-pagination/footer-pagination";

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
    // overflow: "visible",
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
  { id: "name", hideSortIcon: false, label: "Tên đơn vị" },
  { id: "address", hideSortIcon: false, label: "Địa chỉ" },
  { id: "phone", hideSortIcon: false, label: "Số điện thoại" },
  { id: "createdBy", hideSortIcon: false, label: "Người tạo" },
  { id: "modifiedDate", hideSortIcon: false, label: "Cập nhật mới nhất" },
  { id: "actions", hideSortIcon: true, label: "" },
];

const ListInvestor = ({
  editAction,
  deleteAction,
  data,
  totalItemCount,
  setPage,
  setRowsPerPage,
  GetListAll,
  page,
  rowsPerPage,
  order,
  setOrder,
  orderBy,
  setOrderBy,
}) => {
  const classes = useStyles();

  // useEffect(() => {
  //   document.querySelector(".right-content").style.removeProperty("overflow-y");
  //   document.querySelector(".right-content").style.overflow = "visible";
  // }, []);

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    let sort = isAsc ? "desc" : "asc";
    let sortExpression = property + " " + sort;
    GetListAll(page + 1, rowsPerPage, sortExpression);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage - 1);
    GetListAll(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    GetListAll(1, event.target.value);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
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
              rowCount={data.length}
            />
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                      }}
                    >
                      <TableCell id={`name-${index}`}>{row.name}</TableCell>
                      <TableCell id={`address-${index}`}>
                        {row.address}
                      </TableCell>
                      <TableCell id={`phone-${index}`}>{row.phone}</TableCell>
                      <TableCell id={`createdBy-${index}`}>
                        {row.createdBy}
                      </TableCell>
                      <TableCell id={`modifiedDate-${index}`}>
                        {dateformat(row.modifiedDate, "dd/mm/yyyy")}
                      </TableCell>
                      <TableCell
                        id={`actions-${index}`}
                        align="right"
                        className="text-nowrap"
                      >
                        <Tooltip title="Sửa">
                          <IconButton
                            aria-label="edit"
                            onClick={() => editAction(row.id)}
                          >
                            <EditIcon className="text-primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteAction(row.id, row.xmin)}
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
                  <TableCell colSpan={8} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={8}
                    style={{ padding: 0, borderBottom: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalItemCount && totalItemCount > 0 ? (
          <FooterPagination
            totalItemCount={totalItemCount}
            currentPage={page + 1}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            totalPage={totalPage}
          />
        ) : (
          ""
        )}
      </Paper>
    </div>
  );
};

const EnhancedTableHead = ({ classes, order, orderBy, onRequestSort }) => {
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
            className={`pt-3 pb-3 text-nowrap`}
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
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default ListInvestor;
