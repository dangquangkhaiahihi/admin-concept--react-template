/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import dateformat from "dateformat";

//--- Material Control
import {
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TableContainer,
  Table,
  TableBody,
  Tooltip,
  IconButton,
  Collapse,
} from "@material-ui/core";

//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import Feedback from "../../feedback/feedback.view";
import { useLocation } from "react-router-dom";

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
  { id: "feedback", hideSortIcon: true, label: "" },
  { id: "title", hideSortIcon: true, label: "Tiêu đề" },
  { id: "startTime", hideSortIcon: true, label: "Ngày bắt đầu" },
  { id: "endTime", hideSortIcon: true, label: "Ngày kết thúc" },
  { id: "statusId", hideSortIcon: true, label: "Trạng thái" },
  { id: "isHotNew", hideSortIcon: true, label: "Tin nổi bật" },
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
            // sortDirection={orderBy === headCell.id ? order : false}
            className="pt-3 pb-3 text-nowrap"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              // direction={orderBy === headCell.id ? order : 'asc'}
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
  // rowCount: PropTypes.number.isRequired,
};
function Row(props) {
  //const isLock = false;
  const { row, deleteAction, editAction, isLock } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow hover key={row.id}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <b>{row.title}</b>
        </TableCell>
        <TableCell>
          {dateformat(row.startTime, "dd/mm/yyyy")}
        </TableCell>
        <TableCell>
          {dateformat(row.endTime, "dd/mm/yyyy")}
        </TableCell>
        <TableCell>{row.statusName}</TableCell>
        <TableCell>
          {row.isHotNew ? (
            <span className="badge badge-danger p-2">HOT</span>
          ) : (
            ""
          )}
        </TableCell>
        <TableCell align="right" className="text-nowrap">
          <Tooltip title="Sửa">
            <IconButton
              aria-label="edit"
              onClick={() => editAction(row.id, row.typeId, isLock)}
            >
              <EditIcon className="text-primary" />
            </IconButton>
          </Tooltip>
          {!isLock && (
            <Tooltip title="Xóa">
            <IconButton
              aria-label="delete"
              onClick={() => deleteAction(row.id, row.formTemplateId)}
            >
              <DeleteIcon className="text-danger" />
            </IconButton>
          </Tooltip>
          )}
          
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Feedback templateId={row.formTemplateId} planningName={"planningName"} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default function ListConsultTheCommunity(props) {
  const {
    dataList,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    pageSize,
    onGetListData,
    editAction,
    deleteAction,
    searchData,
    showConsult,
    planningName,
    isLock
  } = props;

  const classes = useStyles();

  const [openFeedback, setOpenFeedback] = React.useState(false);
  useEffect(() => {
    if (showConsult) {
      if (document.getElementById("openFeedback")) {
        document.getElementById("openFeedback").click();
      }
    }
  }, [dataList]);

  //--- Handle sort, change page, change row per page
  const checkOnClickBeforeSort = (property) => {
    let headCellById = headCells.find((item) => item.id === property);
    if (headCellById.hideSortIcon === true) {
      return false;
    } else {
      return true;
    }
  };

  const onRequestSort = (event, property) => {
    if (checkOnClickBeforeSort(property)) {
      let isAsc = orderBy === property && order === "asc";
      let sort = isAsc ? "desc" : "asc";
      let sortExpression = property + " " + sort;
      setOrder(sort);
      setOrderBy(property);
      onGetListData(page + 1, pageSize, sortExpression, searchData);
    }
  };

  const templateId = (dataList && dataList.formTemplateId) || 0;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
            // rowCount={dataList.length}
            />
            <TableBody>
              {dataList && dataList.length > 0 ? (
                dataList.map((row, index) => {
                  return (
                    <Row
                      isLock={isLock}
                      key={row.id}
                      row={row}
                      editAction={editAction}
                      deleteAction={deleteAction}
                    />
                  );
                })
              ) : (
                <TableRow hover>
                  <TableCell colSpan={9} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
