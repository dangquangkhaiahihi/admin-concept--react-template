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
import MapIcon from "@material-ui/icons/Map";
//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreIcon from "@material-ui/icons/Restore";
import SyncIcon from '@material-ui/icons/Sync';
//--- Material Control
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FooterPagination from "../../../components/footer-pagination/footer-pagination";
import { useMediaQuery } from "react-responsive";
import {
  Checkbox,
} from "@material-ui/core";
import ShowNotification from "../../../components/react-notifications/react-notifications";
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
  { id: "name", hideSortIcon: true, label: "Tên quy hoạch " },
  { id: "viewCount", hideSortIcon: true, label: "Loại quy hoạch" },
  { id: "isHot", hideSortIcon: true, label: "Trạng thái gửi" },
  { id: "isSuccess", hideSortIcon: true, label: "Trạng thái đồng bộ" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isDesktopOrLaptop,rowCount,syncManyAction, isSyncUp } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          if (headCell.id == 'isSuccess') {
            if ( isSyncUp ) {
              return  <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  className={
                    `pt-3 pb-3 text-nowrap ` +
                    ((headCell.id === "planningName" && isDesktopOrLaptop )? "MuiTableCell-freeze" : "")
                  }
                >
                  {headCell.label}
                </TableCell>
              }
          } else {
            return <TableCell
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
              className={
                `pt-3 pb-3 text-nowrap ` +
                ((headCell.id === "planningName" && isDesktopOrLaptop )? "MuiTableCell-freeze" : "")
              }
            >
              {headCell.label}
            </TableCell>
          }
        })}
        <TableCell
          className={`pt-3 pb-3 text-nowrap `}
        >
          {rowCount > 0 ? (              
            <button class="btn btn-ct btn-primary-ct" style={{margin:"0px", minWidth:"0px"}} onClick={syncManyAction}>
              Đồng bộ
            </button>):""}

        </TableCell>
          
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

export default function ListPlanning(props) {
  const {
    newsModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetListAll,
    order,
    page,
    rowsPerPage,
    orderBy,
    keyword,
    status,
    isSyncUp,
    editAction,
    syncAction,
    selectId,
    setSelectId,
    syncManyAction
  } = props;

  //--- Config table
  const classes = useStyles();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    if (property !== "avatar") {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
      let sort = isAsc ? "desc" : "asc";
      let sortExpression = property + " " + sort;
      GetListAll(
        page + 1,
        rowsPerPage,
        sortExpression,
        keyword,
        status,
      )
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + " " + order;
    GetListAll(
      newPage,
      rowsPerPage,
      sortExpression,
      keyword,
      status,
    )
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + " " + order;
    GetListAll(
      1,
      event.target.value,
      sortExpression,
      keyword,
      status,
    )
  };

  const handleClickCheckBox = (event) => {
    console.log("event.target", event.target);
    if (!event.target.checked) {
      setSelectId(selectId.filter((x) => x !== event.target.name));
    } else {
      setSelectId([...selectId, event.target.name]);
    }
    console.log("selectId-after", selectId);
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
              syncManyAction={syncManyAction}
              isSyncUp={isSyncUp}
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
                      <TableCell
                        id={`name-${index}`}
                        className={` shadow-sm`}
                        style={isDesktopOrLaptop ? {
                          backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                        } : {backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",minWidth:'220px'}}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        id={`planningType-${index}`}
                      >
                        {row.planningType}
                      </TableCell>
                      <TableCell id={`isSync-${index}`} className="text-center">
                        {row.isSync ? (
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
                      {
                        isSyncUp && 
                        <TableCell id={`isSuccess-${index}`} className="text-center">
                          {row.isSuccess ? (
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
                      }
                      <TableCell
                        id={`actions-${index}`}
                        align="right"
                        className="text-nowrap"
                      >
                        {
                          !row.isSuccess && isSyncUp ?(     
                            <>                  
                          <Tooltip title="Cập nhật file bản vẽ">
                            <IconButton
                              aria-label="edit"
                              onClick={() => editAction(row.id)}
                            >
                              <EditIcon className="text-primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Đồng bộ dữ liệu">
                            <IconButton
                              aria-label="sync"
                              onClick={() => syncAction(row.id)}
                            >
                              <SyncIcon className="text-primary" />
                            </IconButton>
                          </Tooltip>
                        </> 
                        ):(
                          <Tooltip title="Đồng bộ dữ liệu">
                            <IconButton
                              aria-label="sync"
                              onClick={() => syncAction(row.id)}
                            >
                              <SyncIcon className="text-primary" />
                            </IconButton>
                          </Tooltip>
                                               

                        )
                        }
                        {
                          !row.isSync ? ( <Checkbox name={row.id} color="success" onClick={handleClickCheckBox} />) : (<Checkbox checked disabled color="success" />)
                        }
                       
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
}
