import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Configs } from "../../../common/config";
import * as configuration from "../../../utils/configuration";

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

//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

//--- Material Control
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
  { id: "title", hideSortIcon: false, label: "Tiêu đề" },
  { id: "avatar", hideSortIcon: true, label: "Ảnh" },
  { id: "link", hideSortIcon: false, label: "Đường dẫn" },
  { id: "order", hideSortIcon: false, label: "Thứ tự" },
  { id: "status", hideSortIcon: false, label: "Trạng thái" },
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ListSlider(props) {
  const {
    editAction,
    deleteAction,
    homePageModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetListHomePage,
    title,
    order,
    page,
    rowsPerPage,
    orderBy,
  } = props;

  //--- Config table
  const classes = useStyles();

  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    if (property !== "avatar") {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
      let sort = isAsc ? "desc" : "asc";
      let sortExpression = property + " " + sort;
      GetListHomePage(page + 1, rowsPerPage, sortExpression, title);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + " " + order;
    GetListHomePage(newPage, rowsPerPage, sortExpression, title);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + " " + order;
    GetListHomePage(1, event.target.value, sortExpression, title);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, homePageModels.length - page * rowsPerPage);
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
              rowCount={homePageModels.length}
            />
            <TableBody>
              {homePageModels && homePageModels.length > 0 ? (
                homePageModels.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>
                        <img
                          src={configuration.APIUrlDefault + row.avatar}
                          onError={(e) =>
                            (e.target.src = process.env.PUBLIC_URL + "/logo.png")
                          }
                          alt="logo192"
                          className="logo"
                        />
                      </TableCell>
                      <TableCell>{row.link}</TableCell>
                      <TableCell>{row.order}</TableCell>
                      <TableCell>{row.status ? "Hiện" : "Ẩn"}</TableCell>
                      <TableCell align="right" className="text-nowrap">
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
                            onClick={() => deleteAction(row.id)}
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
                  <TableCell colSpan={6} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={6}
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
}
