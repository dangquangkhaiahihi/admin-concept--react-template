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
import VisibilityIcon from '@material-ui/icons/Visibility';

import * as config from '../../../common/config';

const headCells = [
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Tiêu đề',
  },
  {
    id: 'emailType',
    numeric: false,
    disablePadding: false,
    label: 'Loại email',
  },
  {
    id: 'referenceTypeName',
    numeric: false,
    disablePadding: false,
    label: 'Tên loại',
  },
  {
    id: 'sendFrom',
    numeric: false,
    disablePadding: false,
    label: 'Người gửi',
  },
  {
    id: 'sentDate',
    numeric: false,
    disablePadding: false,
    label: 'Ngày gửi',
  },
  {
    id: 'statusSendMail',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
  {
    id: 'errorMessage',
    numeric: false,
    disablePadding: false,
    label: 'Tin nhắn lỗi',
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

function ListEmailGenerated(props) {
  const {
    emailGeneratedModels,
    totalItemCount,
    handleOpenViewDiaLog,
    getListEmailGenerated,
    setRowsPerPageCommon,
    title,
    page,
    setPage,
    order,
    orderBy,
    setOrder,
    setOrderBy,
  } = props;

  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(
    config.Configs.DefaultPageSize
  );

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, emailGeneratedModels.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    let sort = isAsc ? 'desc' : 'asc';
    let sortExpression = property + ' ' + sort;
    getListEmailGenerated(
      page + 1,
      rowsPerPage,
      sortExpression,
      title ? title : ''
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    getListEmailGenerated(
      newPage,
      rowsPerPage,
      sortExpression,
      title ? title : ''
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPageCommon(event.target.value);
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    getListEmailGenerated(
      1,
      event.target.value,
      sortExpression,
      title ? title : ''
    );
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
              rowCount={emailGeneratedModels.length}
            />
            <TableBody>
              {emailGeneratedModels && emailGeneratedModels.length > 0 ? (
                emailGeneratedModels.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell className='w-10' id={labelId}>
                        {row.title}
                      </TableCell>
                      <TableCell className='w-10'>{row.emailType}</TableCell>
                      <TableCell className='w-10'>
                        {row.referenceTypeName}
                      </TableCell>
                      <TableCell className='w-10'>{row.sendFrom}</TableCell>
                      <TableCell className='w-10'>
                        {dateformat(row.sentDate, 'dd/mm/yyyy')}
                      </TableCell>
                      <TableCell className='w-10'>
                        {row.statusSendMail}
                      </TableCell>
                      <TableCell>{row.errorMessage}</TableCell>
                      <TableCell align='right' className='text-nowrap w-10'>
                        <Tooltip title='Xem'>
                          <IconButton
                            aria-label='view'
                            onClick={() => handleOpenViewDiaLog(row.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={8} className='text-center'>
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

export default ListEmailGenerated;
