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
import FooterPagination from '../../../components/footer-pagination/footer-pagination';
//--- Material Icon
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

//--- Material Control
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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
  { id: 'code', hideSortIcon: false, label: 'Mã loại đất' },
  { id: 'name', hideSortIcon: false, label: 'Tên loại đất' },
  { id: 'isQhc', hideSortIcon: false, label: 'Quy hoạch chung' },
  { id: 'isQhpk', hideSortIcon: false, label: 'Quy hoạch phân khu' },
  { id: 'isQhct', hideSortIcon: false, label: 'Quy hoạch liên quan' },
  { id: 'image', hideSortIcon: false, label: 'Đường dẫn ảnh' },
  { id: 'colorCad', hideSortIcon: false, label: 'Màu cad' },
  { id: 'colorHex', hideSortIcon: false, label: 'Màu dạng hexa' },
  { id: 'actions', hideSortIcon: true, label: '' },
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

export default function ListLandTypeManagement(props) {
  const {
    editAction,
    landTypeModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetListLandType,
    name,
    order,
    page,
    rowsPerPage,
    orderBy,
    deleteAction,
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
    GetListLandType(page + 1, rowsPerPage, sortExpression, name);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    GetListLandType(newPage, rowsPerPage, sortExpression, name);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    GetListLandType(1, event.target.value, sortExpression, name);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, landTypeModels.length - page * rowsPerPage);
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
              rowCount={landTypeModels.length}
            />
            <TableBody>
              {landTypeModels && landTypeModels.length > 0 ? (
                landTypeModels.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className='text-center'>
                        {row.isQhc ? (
                          <img
                            src={require('../../../assets/icon/tick.png')}
                            alt='Tick'
                          />
                        ) : (
                          <img
                            src={require('../../../assets/icon/cancel.png')}
                            alt='Cancel'
                          />
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {row.isQhpk ? (
                          <img
                            src={require('../../../assets/icon/tick.png')}
                            alt='Tick'
                          />
                        ) : (
                          <img
                            src={require('../../../assets/icon/cancel.png')}
                            alt='Cancel'
                          />
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {row.isQhct ? (
                          <img
                            src={require('../../../assets/icon/tick.png')}
                            alt='Tick'
                          />
                        ) : (
                          <img
                            src={require('../../../assets/icon/cancel.png')}
                            alt='Cancel'
                          />
                        )}
                      </TableCell>
                      <TableCell>{row.image}</TableCell>
                      <TableCell>{row.colorCad}</TableCell>
                      <TableCell>{row.colorHex}</TableCell>

                      <TableCell align='right' className='text-nowrap'>
                        <Tooltip title='Sửa'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editAction(row.id)}>
                            <EditIcon className='text-primary' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xóa'>
                          <IconButton
                            aria-label='delete'
                            onClick={() => deleteAction(row.id)}>
                            <DeleteIcon className='text-danger' />
                          </IconButton>
                        </Tooltip>
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
          // <TablePagination
          //   rowsPerPageOptions={Configs.DefaultPageSizeOption}
          //   component="div"
          //   count={totalItemCount}
          //   rowsPerPage={rowsPerPage}
          //   page={page}
          //   onChangePage={handleChangePage}
          //   onChangeRowsPerPage={handleChangeRowsPerPage}
          //   labelRowsPerPage={"Số hàng mỗi trang"}
          //   labelDisplayedRows={({ from, to, count }) => {
          //     return "" + from + "-" + to + " trong " + count || "";
          //   }}
          // />
          ''
        )}
      </Paper>
    </div>
  );
}
