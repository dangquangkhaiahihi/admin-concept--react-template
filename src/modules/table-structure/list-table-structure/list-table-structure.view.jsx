import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import * as config from "../../../common/config";
import Link from "@material-ui/core/Link";
import { Transition } from "../../../utils/configuration";
import TableStructureDetail from "../table-structure-detail/table-structure-detail.view";

import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";

//--- Material Icon
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

const headCells = [
  { id: "tableName", hideSortIcon: false, label: "Tên bảng" },
  { id: "createdBy", hideSortIcon: false, label: "Người tạo" },
  { id: "createdDate", hideSortIcon: false, label: "Ngày tạo" },
  { id: "modifiedBy", hideSortIcon: false, label: "Người sửa" },
  { id: "modifiedDate", hideSortIcon: false, label: "Ngày sửa" },
  { id: "action", hideSortIcon: false, label: "" },
];

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
  appBar: {
    position: "relative",
    backgroundColor: "#00923F",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogBody: {
    backgroundColor: "#f8f9fc",
    height: "100%",
  },
}));

function ListTableStructure(props) {
  const classes = useStyles();

  const {
    page,
    setPage,
    order,
    orderBy,
    setOrder,
    setOrderBy,
      tableStructureModels,
      settings
  } = props;

    useEffect(() => {
        setClientSetting(settings);
    }, [settings])

    const [clientSetting, setClientSetting] = useState();

  const [rowsPerPage, setRowsPerPage] = useState(
    config.Configs.DefaultPageSize
  );

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, tableStructureModels.length - page * rowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    let sort = isAsc ? "desc" : "asc";
    let sortExpression = property + " " + sort;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let sortExpression = orderBy + " " + order;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + " " + order;
  };

  //--- Table structure detail dialog
  const [
    openTableStructureDetailDialog,
    setOpenTableStructureDetailDialog,
  ] = useState(false);

  const handleClickOpenTableStructureDetailDialog = () => {
    setOpenTableStructureDetailDialog(true);
  };

  const handleCloseTableStructureDetailDialog = () => {
    setOpenTableStructureDetailDialog(false);
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
              rowCount={tableStructureModels.length}
            />
            <TableBody>
              {tableStructureModels && tableStructureModels.length > 0 ? (
                tableStructureModels.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleClickOpenTableStructureDetailDialog}
                        >
                          {row.tableName}
                        </Link>
                      </TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>{row.created_date}</TableCell>
                      <TableCell>{row.modified_by}</TableCell>
                      <TableCell>{row.modified_date}</TableCell>

                      <TableCell align="right" className="text-nowrap">
                        <Tooltip title="Sửa">
                          <IconButton
                            aria-label="edit"
                            // onClick={() => handleOpenEditDialog(row.code)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            aria-label="delete"
                            // onClick={() => handleOpenDeleteDialog(row.code)}
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
                  <TableCell colSpan={9} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={7}
                    style={{ padding: 0, borderBottom: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={config.Configs.DefaultPageSizeOption}
          component="div"
          count={tableStructureModels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage={"Số hàng mỗi trang"}
          labelDisplayedRows={({ from, to, count }) => {
            return "" + from + "-" + to + " trong " + count;
          }}
        />
      </Paper>

      <Dialog
        fullScreen
        open={openTableStructureDetailDialog}
        onClose={handleCloseTableStructureDetailDialog}
        TransitionComponent={Transition}
          >
              {
                  clientSetting && (
                      <AppBar className={classes.appBar} style={{ background: clientSetting.color }}>
                          <Toolbar>
                              <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={handleCloseTableStructureDetailDialog}
                                  aria-label="close"
                              >
                                  <CloseIcon />
                              </IconButton>
                              <Typography variant="h6" className={classes.title}>
                                  Sửa cấu trúc bảng (Xin ý kiến cộng đồng)
            </Typography>
                              <Button
                                  variant="contained"
                                  color="primary"
                                  size="medium"
                                  onClick={handleCloseTableStructureDetailDialog}
                                  startIcon={<SaveIcon />}
                              >
                                  Lưu
            </Button>
                          </Toolbar>
                      </AppBar>
                      )
              }
        

        <div className={classes.dialogBody}>
          <TableStructureDetail />
        </div>
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => ({
    settings: state.clientSetting.clientSetting,
});

export default connect(mapStateToProps)(ListTableStructure);
//export default ListTableStructure;
