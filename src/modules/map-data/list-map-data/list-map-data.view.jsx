import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Configs } from "../../../common/config";
import SaveDataToDataBaseButton from "../../init-map-data/save-button/save-button";

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
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

//--- Component
import InitMapDataView from "../../init-map-data/init-map-data.jsx";

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
}));

const headCells = [
  { id: "mapName", hideSortIcon: false, label: "Tên" },
  { id: "mapOwner", hideSortIcon: false, label: "Sở hữu" },
  { id: "modifiedDate", hideSortIcon: false, label: "Sửa đổi lần cuối" },
  { id: "actions", hideSortIcon: true, label: "" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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
            className="pt-3 pb-3"
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ListMapData(props) {

    useEffect(() => {
        setClientSetting(props.settings)
    }, [props.settings])
    const [clientSetting, setClientSetting] = useState();

  const { rows, editAction, deleteAction } = props;

  //--- Config table
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
  const [mapSelected, setMapSelected] = useState({});

  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const [openMapDialog, setOpenMapDialog] = React.useState(false);

  const handleOpenMapDialog = (map) => {
    setMapSelected(map);
    setOpenMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
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
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" id={labelId} scope="row">
                        <a href="#" onClick={() => handleOpenMapDialog(row)}>
                          {row.mapName}
                        </a>
                      </TableCell>
                      <TableCell>{row.mapOwner}</TableCell>
                      <TableCell>{row.modifiedDate}</TableCell>
                      <TableCell align="right" width="130">
                        <Tooltip title="Sửa">
                          <IconButton aria-label="edit" onClick={editAction}>
                            <EditIcon className="text-primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            aria-label="delete"
                            onClick={deleteAction}
                          >
                            <DeleteIcon className="text-danger" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={9}
                    style={{ padding: 0, borderBottom: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {rows && rows.length > 0 ? (
          <TablePagination
            rowsPerPageOptions={Configs.DefaultPageSizeOption}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
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

      <div>
        <Dialog
          fullScreen
          open={openMapDialog}
          onClose={handleCloseMapDialog}
          TransitionComponent={Transition}
              >
                  {
                      clientSetting && (
                          <AppBar className={classes.appBar} style={{background: clientSetting.color}}>
                              <Toolbar>
                                  <IconButton
                                      edge="start"
                                      color="inherit"
                                      onClick={handleCloseMapDialog}
                                      aria-label="close"
                                  >
                                      <CloseIcon />
                                  </IconButton>
                                  <Typography variant="h6" className={classes.title}>
                                      Map Creator (Bản đồ cảnh báo)
              </Typography>
                                  <SaveDataToDataBaseButton handleClick={handleCloseMapDialog} />
                              </Toolbar>
                          </AppBar>
                          )
                  }
          <div className="h-100">
            <InitMapDataView mapSelected={mapSelected} />
          </div>
        </Dialog>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
    settings: state.clientSetting.clientSetting,
})

export default connect(mapStateToProps)(ListMapData)