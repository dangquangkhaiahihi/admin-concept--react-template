import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Configs } from '../../../common/config';

//--- Material Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import dateformat from 'dateformat';
import FooterPagination from '../../../components/footer-pagination/footer-pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
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
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const headCells = [
  { id: 'userName', hideSortIcon: false, label: 'Tên truy cập' },
  { id: 'action', hideSortIcon: false, label: 'Số hành động' },
  { id: 'actionName', hideSortIcon: false, label: 'Tên hành động' },
  { id: 'description', hideSortIcon: false, label: 'Mô tả' },
  { id: 'createdBy', hideSortIcon: false, label: 'Người tạo' },
  { id: 'createdDate', hideSortIcon: false, label: 'Ngày tạo' },
  { id: 'modifiedBy', hideSortIcon: false, label: 'Người sửa' },
  { id: 'modifiedDate', hideSortIcon: false, label: 'Ngày sửa' },
  // { id: "actions", hideSortIcon: true, label: "" },
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
            className='pt-3 pb-3 text-nowrap'>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.hideSortIcon ? true : false}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ListUserLogHistory(props) {
  const {
    userLogModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetAllHistoryManagement,
    order,
    page,
    rowsPerPage,
    orderBy,
    action,
    userName,
    description,
    createDate,
  } = props;

  //--- Config table
  const classes = useStyles();

  //--- Handle sort, change page, change row per page
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    let sort = isAsc ? 'desc' : 'asc';
    let sortExpression = property + ' ' + sort;
    GetAllHistoryManagement(
      page + 1,
      rowsPerPage,
      sortExpression,
      action,
      userName,
      description,
      createDate
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    GetAllHistoryManagement(
      newPage,
      rowsPerPage,
      sortExpression,
      action,
      userName,
      description,
      createDate
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    GetAllHistoryManagement(
      1,
      event.target.value,
      sortExpression,
      action,
      userName,
      description,
      createDate
    );
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, userLogModels.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size='small' stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={userLogModels.length}
            />
            <TableBody>
              {userLogModels && userLogModels.length > 0 ? (
                userLogModels.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell>{row.actionName}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>
                        {row.created_date
                          ? dateformat(row.created_date, 'dd-mm-yyyy')
                          : null}
                      </TableCell>
                      <TableCell>{row.modified_by}</TableCell>
                      <TableCell>
                        {row.modified_date
                          ? dateformat(row.modified_date, 'dd-mm-yyyy')
                          : null}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={9} className='text-center'>
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
          <FooterPagination
            totalItemCount={totalItemCount}
            currentPage={page + 1}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            totalPage={totalPage}
          />
        ) : (
          ''
        )}
      </Paper>
    </div>
  );
}
