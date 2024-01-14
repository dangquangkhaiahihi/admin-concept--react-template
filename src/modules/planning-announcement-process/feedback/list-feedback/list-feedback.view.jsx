import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Configs } from "../../../../common/config";
import PropTypes from "prop-types";

//--- Material Control
import {
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableBody,
  Tooltip,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextareaAutosize,
  TableSortLabel,
} from "@material-ui/core";

//--- Material Icon
import RateReviewIcon from "@material-ui/icons/RateReview";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";

import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";

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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const tableHead = props.tableHead || [];

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      {tableHead.map((row, rowIndex) => (
        <TableRow key={`row_${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <TableCell
              key={`cell_${cellIndex}`}
              rowSpan={cell.rowSpan}
              colSpan={cell.colSpan}
              className={cell.className}
              align={cell.align || "left"}
              sortDirection={orderBy === cell.id ? order : false}
            >
              {!cell.hideSortIcon ? (
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : "asc"}
                  onClick={createSortHandler(cell.id)}
                  hideSortIcon={cell.hideSortIcon ? true : false}
                >
                  {cell.title}
                  {orderBy === cell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              ) : (
                cell.title
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
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

export default function ListFeedback(props) {
  const {
    callBack,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    totalItemCount,
    answers,
    tableHead,
    tableBody,
    headCellLength,
    showLoading,
    consultTheCommunityAction,
    planningName,
  } = props;

  const classes = useStyles();

  const {
    register: registerFeedbackForm,
    errors: errorsFeedbackForm,
    handleSubmit: handleSubmitFeedbackForm,
  } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const emptyRows =
    pageSize - Math.min(pageSize, tableBody.length - pageIndex * pageSize);

  const handleChangePage = (event, newPage) => {
    setPageIndex(newPage);
    let sortExpression = orderBy + " " + order;
    callBack(newPage + 1, pageSize, sortExpression);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
    let sortExpression = orderBy + " " + order;
    callBack(1, event.target.value, sortExpression);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    let sort = isAsc ? "desc" : "asc";
    let sortExpression = property + " " + sort;
    callBack(pageIndex + 1, pageSize, sortExpression);
  };

  //--- Feedback Comment Dialog
  const [openFeedbackComment, setOpenFeedbackComment] = useState(false);
  const [rowItem, setRowItem] = useState(null);

  const handleClickOpenFeedbackComment = (_item) => {
    if (!_item) return;
    setRowItem(_item);
    setOpenFeedbackComment(true);
  };

  const handleCloseFeedbackComment = () => {
    setRowItem(null);
    setOpenFeedbackComment(false);
  };

  const onSubmitFeedback = (_data) => {
    if (!_data || !rowItem) return;
    showLoading(true);
    let params = {
      PersonId: rowItem.personId,
      PlanningName: planningName,
      PersonEmail: rowItem.email,
      PersonName: rowItem.name,
      Reply: _data.content,
    };

    consultTheCommunityAction.SaveReply(params).then(
      (res) => {
        ShowNotification(
          "Gửi phản hồi thành công",
          NotificationMessageType.Success
        );
        handleCloseFeedbackComment();
        showLoading(false);
        callBack();
      },
      (err) => {
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
        showLoading(false);
      }
    );
  };

  const renderAnswer = (_answer = null, _row = null) => {
    if (!_answer || !_row) return "";

    if (
      _answer.id < 0 &&
      _row.answers.some((item) => item.questionId * -1 === _answer.id)
    ) {
      return (
        _row.answers.find((item) => item.questionId * -1 === _answer.id)
          .additions || ""
      );
    } else if (_row.answers.some((item) => item.answerId === _answer.id)) {
      return <CheckIcon className="text-success" />;
    }

    return "";
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              tableHead={tableHead}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableBody.length || 0}
            />
            <TableBody>
              {tableBody && tableBody.length > 0 ? (
                tableBody.map((row, index) => {
                  return (
                    <Fragment key={`tableBody_${index}`}>
                      <TableRow hover key={index}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.phoneNo}</TableCell>
                        <TableCell>{row.email}</TableCell>

                        {answers.map((answer, answerIndex) => (
                          <TableCell
                            key={`tableCellAnswer_${answerIndex}`}
                            align="center"
                          >
                            {renderAnswer(answer, row)}
                          </TableCell>
                        ))}

                        <TableCell className="text-nowrap">
                          <Tooltip title="Phản hồi ý kiến">
                            <IconButton
                              onClick={() =>
                                handleClickOpenFeedbackComment(row)
                              }
                            >
                              <RateReviewIcon className="text-info" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={headCellLength} className="text-center">
                    Không có phản hồi
                  </TableCell>
                </TableRow>
              )}

              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={headCellLength}
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
        )}
      </Paper>

      {openFeedbackComment && rowItem && (
        <Dialog
          open={openFeedbackComment}
          onClose={handleCloseFeedbackComment}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle disableTypography className="border-bottom">
            <Typography variant="h6">Ý kiến phản hồi</Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseFeedbackComment}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form
            key="feedbackForm"
            onSubmit={handleSubmitFeedbackForm(onSubmitFeedback)}
            id="feedbackForm"
          >
            <DialogContent className="pt-4 pb-2">
              <div className="form-group">
                <label className="text-dark">Nội dung phản hồi (*)</label>
                <TextareaAutosize
                  name="content"
                  rowsMin={5}
                  className="w-100"
                  defaultValue={rowItem.reply}
                  ref={registerFeedbackForm({ required: true })}
                  disabled={rowItem.reply}
                />
                {errorsFeedbackForm.content &&
                  errorsFeedbackForm.content.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
              </div>
            </DialogContent>
            <DialogActions className="border-top">
              <Button
                type="button"
                onClick={handleCloseFeedbackComment}
                variant="contained"
                startIcon={<CloseIcon />}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                hidden={rowItem.reply}
              >
                Phản hồi
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
}
