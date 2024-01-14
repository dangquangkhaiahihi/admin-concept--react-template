import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import dateformat from 'dateformat';

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
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FooterPagination from '../../../components/footer-pagination/footer-pagination';

//icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AirplayIcon from '@material-ui/icons/Airplay';

import * as config from '../../../common/config';

const headCells = [
  {
    id: 'code',
    numeric: false,
    disablePadding: false,
    label: 'Code',
    className: 'pt-3 pb-3',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Tên role',
    className: 'pt-3 pb-3',
  },
  {
    id: 'createdBy',
    numeric: false,
    disablePadding: false,
    label: 'Người tạo',
    className: 'pt-3 pb-3',
  },
  {
    id: 'createdDate',
    numeric: false,
    disablePadding: false,
    label: 'Ngày tạo',
    className: 'pt-3 pb-3',
  },
  {
    id: 'modifiedBy',
    numeric: false,
    disablePadding: false,
    label: 'Người sửa',
    className: 'pt-3 pb-3',
  },
  {
    id: 'modifiedDate',
    numeric: false,
    disablePadding: false,
    label: 'Ngày sửa',
    className: 'pt-3 pb-3',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: true,
    label: '',
    className: 'pt-3 pb-3 pl-4',
  },
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
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={headCell.className}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.disablePadding ? true : false}>
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
function ListRoleManagement(props) {
  const {
    handleOpenEditDialog,
    roleModels,
    handleOpenDeleteDialog,
    totalItemCount,
    setRowsPerPageCommon,
    name,
    code,
    getListRoleManagement,
    page,
    setPage,
    order,
    orderBy,
    setOrder,
    setOrderBy,
    handleOpenScreenRoleDialog,
  } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(
    config.Configs.DefaultPageSize
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, roleModels.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    let sort = isAsc ? 'desc' : 'asc';
    let sortExpression = property + ' ' + sort;
    getListRoleManagement(page + 1, rowsPerPage, sortExpression, code, name);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    getListRoleManagement(newPage, rowsPerPage, sortExpression, code, name);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPageCommon(parseInt(event.target.value, 10));
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    getListRoleManagement(1, event.target.value, sortExpression, code, name);
  };

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
              rowCount={roleModels.length}
            />
            <TableBody>
              {roleModels && roleModels.length > 0 ? (
                roleModels.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component='th' id={labelId} scope='row'>
                        {row.code}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>
                        {dateformat(row.created_date, 'dd/mm/yyyy')}
                      </TableCell>
                      <TableCell>{row.modified_by}</TableCell>
                      <TableCell>
                        {dateformat(row.modified_date, 'dd/mm/yyyy')}
                      </TableCell>
                      {row.code === 'ADMIN' ? (
                        <TableCell
                          align='left'
                          className='text-nowrap'></TableCell>
                      ) : (
                        row.code === 'PHANPHOI' || 
                        row.code === 'TIEPNHAN' || 
                        row.code === 'XULY' || 
                        row.code === 'PHEDUYET' || 
                        row.code === 'DANGTAI' || 
                        row.code === 'REGISTERUSER' || 
                        row.code === 'XINYKIEN' ?
                        (
                          <TableCell align='left' className='text-nowrap'>
                          <Tooltip title='Sửa'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => handleOpenEditDialog(row.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Phân quyền màn hình'>
                            <AirplayIcon
                              aria-label='edit'
                              onClick={() =>
                                handleOpenScreenRoleDialog(row.id)
                              }>
                              <EditIcon />
                            </AirplayIcon>
                          </Tooltip>
                        </TableCell>
                        ) : (
                          <TableCell align='left' className='text-nowrap'>
                          <Tooltip title='Sửa'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => handleOpenEditDialog(row.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Phân quyền màn hình'>
                            <AirplayIcon
                              aria-label='edit'
                              onClick={() =>
                                handleOpenScreenRoleDialog(row.id)
                              }>
                              <EditIcon />
                            </AirplayIcon>
                          </Tooltip>
                          <Tooltip title='Xóa'>
                            <IconButton
                              aria-label='delete'
                              onClick={() => handleOpenDeleteDialog(row.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        )
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={9}>Không có dữ liệu</TableCell>
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
export default ListRoleManagement;
