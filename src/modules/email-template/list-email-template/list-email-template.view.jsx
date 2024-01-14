import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import dateformat from 'dateformat';
import * as config from '../../../common/config';

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

//--- Material Icon
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const headCells = [
  { id: 'code', hideSortIcon: false, label: 'Mã email' },
  { id: 'title', hideSortIcon: false, label: 'Tiêu đề' },
  { id: 'sendTo', hideSortIcon: false, label: 'Người nhận' },
  { id: 'cc', hideSortIcon: false, label: 'CC' },
  { id: 'createdBy', hideSortIcon: false, label: 'Người tạo' },
  { id: 'createdDate', hideSortIcon: false, label: 'Ngày tạo' },
  { id: 'modifiedBy', hideSortIcon: false, label: 'Người sửa' },
  { id: 'modifiedDate', hideSortIcon: false, label: 'Ngày sửa' },
  { id: 'action', hideSortIcon: false, label: '' },
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
          <TableCell key={headCell.id} className='pt-3 pb-3 text-nowrap'>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.hideSortIcon ? true : false}>
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

function ListEmailTemplate(props) {
  const {
    getListEmailModels,
    emailModels,
    handleOpenEditDialog,
    handleOpenDeleteDialog,
    contentModel,
    code,
    title,
    setRowsPerPageCommon,
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
    Math.min(rowsPerPage, emailModels.length - page * rowsPerPage);
  const totalPage = Math.ceil(contentModel.totalItemCount / rowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    let sort = isAsc ? 'desc' : 'asc';
    let sortExpression = property + ' ' + sort;
    getListEmailModels(page + 1, rowsPerPage, sortExpression, code, title);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    getListEmailModels(newPage, rowsPerPage, sortExpression, code, title);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPageCommon(event.target.value);
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    getListEmailModels(1, event.target.value, sortExpression, code, title);
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
              rowCount={emailModels.length}
            />
            <TableBody>
              {emailModels && emailModels.length > 0 ? (
                emailModels.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component='th' id={labelId} scope='row'>
                        {row.code}
                      </TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.sendTo}</TableCell>
                      <TableCell>{row.cc}</TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>
                        {dateformat(row.created_date, 'dd/mm/yyyy')}
                      </TableCell>
                      <TableCell>{row.modified_by}</TableCell>
                      <TableCell>
                        {dateformat(row.modified_date, 'dd/mm/yyyy')}
                      </TableCell>

                      <TableCell align='right' className='text-nowrap'>
                        <Tooltip title='Sửa'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => handleOpenEditDialog(row.code)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xóa'>
                          <IconButton
                            aria-label='delete'
                            onClick={() => handleOpenDeleteDialog(row.code)}>
                            <DeleteIcon />
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
                    colSpan={7}
                    style={{ padding: 0, borderBottom: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {contentModel && contentModel.totalItemCount ? (
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
export default ListEmailTemplate;
