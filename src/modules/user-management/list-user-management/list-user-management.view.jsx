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
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import dateformat from 'dateformat';
import FooterPagination from '../../../components/footer-pagination/footer-pagination';

//--- Material Icon
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpen';

//--- Material Control
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import * as config from '../../../utils/configuration';

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
  { id: 'fullName', hideSortIcon: false, label: 'Họ và tên' },
  { id: 'email', hideSortIcon: false, label: 'Email' },
  { id: 'roles', hideSortIcon: false, label: 'Chức vụ' },
  { id: 'DateOfBirth', hideSortIcon: false, label: 'Ngày sinh' },
  { id: 'Sex', hideSortIcon: false, label: 'Giới tính' },
  { id: 'PhoneNumber', hideSortIcon: false, label: 'Số điện thoại' },
  { id: 'Address', hideSortIcon: false, label: 'Địa chỉ' },
  { id: 'Avatar', hideSortIcon: true, label: 'Ảnh đại diện' },
  { id: 'modifiedDate', hideSortIcon: false, label: 'Ngày sửa' },
  { id: 'Status', hideSortIcon: false, label: 'Trạng thái' },
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
              hideSortIcon={headCell.hideSortIcon ? true : false}
              disabled={headCell.hideSortIcon}>
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

export default function ListUserManagement(props) {
  const {
    editAction,
    userModels,
    totalItemCount,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    GetListUserManagement,
    email,
    order,
    page,
    rowsPerPage,
    orderBy,
    deleteAction,
    restAction,
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
    GetListUserManagement(page + 1, rowsPerPage, sortExpression, email);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    GetListUserManagement(newPage, rowsPerPage, sortExpression, email);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    GetListUserManagement(1, event.target.value, sortExpression, email);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, userModels.length - page * rowsPerPage);
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
              rowCount={userModels.length}
            />
            <TableBody>
              {userModels && userModels.length > 0 ? (
                userModels.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.roleNames.join() == ''? 'Người dùng' : row.roleNames.join(', ')}</TableCell>
                      <TableCell>
                        {row.dateOfBirth
                          ? dateformat(row.dateOfBirth, 'dd-mm-yyyy')
                          : null}
                      </TableCell>
                      <TableCell>{row.sex ? 'Nam' : 'Nữ'}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>
                        <img
                          src={config.APIUrlDefault + row.avatar}
                          onError={(e) =>
                            (e.target.src =
                              process.env.PUBLIC_URL + '/logo.png')
                          }
                          alt='logo192'
                          className='logo'
                        />
                      </TableCell>
                      <TableCell>
                        {dateformat(row.modifiedDate, 'dd-mm-yyyy')}
                      </TableCell>
                      <TableCell>
                        {row.status ? 'Hoạt động' : 'Không hoạt động'}
                      </TableCell>
                      <TableCell align='right' className='text-nowrap'>
                        <Tooltip title='Sửa'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editAction(row.id, row.roleNames)}>
                            <EditIcon className='text-primary' />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Xóa">
                          <IconButton aria-label="delete" onClick={() => deleteAction(row.id)}>
                            <DeleteIcon className="text-danger" />
                          </IconButton>
                        </Tooltip> */}
                        {row && row.status === true ? (
                          <Tooltip title='Khoá'>
                            <IconButton
                              aria-label='lock'
                              onClick={() => deleteAction(row.id, false)}>
                              <LockIcon className='text-primary' />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title='Kích hoạt'>
                            <IconButton
                              aria-label='active'
                              onClick={() => deleteAction(row.id, true)}>
                              <LockOpenIcon className='text-primary' />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title='Đặt lại mật khẩu'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => restAction(row.id)}>
                            <VpnKeyIcon className='text-primary' />
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
