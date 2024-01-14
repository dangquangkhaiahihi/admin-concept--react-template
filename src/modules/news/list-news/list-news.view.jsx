import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Configs } from "../../../common/config";
import * as configuration from "../../../utils/configuration";
import dateformat from "dateformat";

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
import RestoreIcon from "@material-ui/icons/Restore";

//--- Material Control
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FooterPagination from "../../../components/footer-pagination/footer-pagination";
import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: `calc(100vh - 395px)`,
    '@media (max-width: 1224px)': {
      maxHeight:'50vh',
    }
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
  { id: "image_Url", hideSortIcon: true, label: "Ảnh" },
  { id: "title", hideSortIcon: false, label: "Tiêu đề" },
  //{ id: "category.name", hideSortIcon: false, label: "Danh mục" },
  { id: "viewCount", hideSortIcon: false, label: "Lượt xem" },
  { id: "status", hideSortIcon: false, label: "Kích hoạt" },
  { id: "isHot", hideSortIcon: false, label: "Tin nóng" },
  { id: "createdBy", hideSortIcon: false, label: "Người tạo" },
  { id: "createdDate", hideSortIcon: false, label: "Ngày tạo" },
  { id: "modifiedBy", hideSortIcon: false, label: "Người sửa" },
  { id: "modifiedDate", hideSortIcon: false, label: "Ngày sửa" },
  { id: "actions", hideSortIcon: true, label: "" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isDesktopOrLaptop } = props;

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
            className={
              `pt-3 pb-3 text-nowrap ` +
              ((headCell.id === "planningName" && isDesktopOrLaptop )? "MuiTableCell-freeze" : "")
            }
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

export default function ListNews(props) {
  const {
    editAction,
    deleteAction,
    restoreAction,
    newsModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetListAll,
    title,
    categoryId,
    isDelete,
    order,
    page,
    rowsPerPage,
    orderBy,
  } = props;

  //--- Config table
  const classes = useStyles();

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });


  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    if (property !== "avatar") {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
      let sort = isAsc ? "desc" : "asc";
      let sortExpression = property + " " + sort;

      GetListAll(
        categoryId,
        title,
        undefined,
        undefined,
        isDelete,
        undefined,
        page + 1,
        rowsPerPage,
        sortExpression
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + " " + order;
    GetListAll(
      categoryId,
      title,
      undefined,
      undefined,
      isDelete,
      undefined,
      newPage,
      rowsPerPage,
      sortExpression
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + " " + order;
    console.log(event.target.value);
    GetListAll(
      categoryId,
      title,
      undefined,
      undefined,
      isDelete,
      undefined,
      1,
      event.target.value,
      sortExpression
    );
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, newsModels.length - page * rowsPerPage);
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
              rowCount={newsModels.length}
              isDesktopOrLaptop={isDesktopOrLaptop}
            />
            <TableBody>
              {newsModels && newsModels.length > 0 ? (
                newsModels.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                      }}
                    >
                      <TableCell id={`image_Url-${index}`}>
                        <img
                          src={configuration.APIUrlDefault + row.image_Url}
                          onError={(e) =>
                            (e.target.src =
                              process.env.PUBLIC_URL + "/logo.png")
                          }
                          alt={row.title}
                          className="logo"
                        />
                      </TableCell>
                      <TableCell
                        id={`title-${index}`}
                        className={`${isDesktopOrLaptop ? 'MuiTableCell-freeze' : ''} shadow-sm`}
                        style={isDesktopOrLaptop ? {
                          backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                        } : {backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",minWidth:'220px'}}
                      >
                        {row.title}
                      </TableCell>
                      {/*<TableCell>{row.description}</TableCell>*/}

                      {/*<TableCell>{row.category.name}</TableCell>*/}
                      <TableCell
                        id={`viewCount-${index}`}
                        className="text-center"
                      >
                        {row.viewCount}
                      </TableCell>
                      <TableCell id={`status-${index}`} className="text-center">
                        {row.status ? (
                          <img
                            src={require("../../../assets/icon/tick.png")}
                            alt="Tick"
                          />
                        ) : (
                          <img
                            src={require("../../../assets/icon/cancel.png")}
                            alt="Cancel"
                          />
                        )}
                      </TableCell>
                      <TableCell id={`isHot-${index}`} className="text-center">
                        {row.isHot ? (
                          <img
                            src={require("../../../assets/icon/tick.png")}
                            alt="Tick"
                          />
                        ) : (
                          <img
                            src={require("../../../assets/icon/cancel.png")}
                            alt="Cancel"
                          />
                        )}
                      </TableCell>
                      <TableCell id={`createdBy-${index}`}>
                        {row.created_by}
                      </TableCell>
                      <TableCell id={`createdDate-${index}`}>
                        {dateformat(row.created_date, "dd/mm/yyyy")}
                      </TableCell>
                      <TableCell id={`modifiedBy-${index}`}>
                        {row.modified_by}
                      </TableCell>
                      <TableCell id={`modifiedDate-${index}`}>
                        {dateformat(row.modified_date, "dd/mm/yyyy")}
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
                        {row.isDelete ? (
                          <Tooltip title="Khôi phục">
                            <IconButton
                              aria-label="restore"
                              onClick={() => restoreAction(row.id)}
                            >
                              <RestoreIcon className="text-success" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          ""
                        )}
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
