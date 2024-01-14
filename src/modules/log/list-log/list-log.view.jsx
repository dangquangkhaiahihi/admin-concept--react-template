import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as config from '../../../common/config';
import Button from "@material-ui/core/Button";
//--- Material Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FooterPagination from '../../../components/footer-pagination/footer-pagination';



const headCells = [
  { id: 'message', hideSortIcon: true, label: 'Nội dung' , align: 'left'},
  { id: 'raiseDate', hideSortIcon: false, label: 'Ngày tạo' , align: 'left'},
  { id: 'level', hideSortIcon: true, label: 'Level' , align: 'center'},
];

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
  buttonCustom: {
    boxShadow: 'none',
  },
  buttonCustomsuccess: {
    boxShadow: 'none',
    backgroundColor: "#28a745 !important",
    color:"#fff !important",
  },
  INFO: {
    boxShadow: 'none',
    backgroundColor: "#28a745 !important",
    color:"#fff !important",
  },
  WARNING: {
    boxShadow: 'none',
    backgroundColor: "#ffc107 !important",
    color:"#fff !important",
  },
  ERROR: {
    boxShadow: 'none',
    backgroundColor: "#FF0000 !important",
    color:"#fff !important",
  },
}));

function ListLog(props) {
  const {
    getListLogModels,
    logModels,
    contentModel,
    setRowsPerPageCommon,
    page,
    setPage,
    order,
    orderBy,
    logDel,
    setLogDel,
    handleOpenEditDialog,
  } = props;

  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(
    config.Configs.DefaultPageSize
  );
  const handleCheckbox = (e) => {
    let isChecked = e.target.checked;
    for(let i = 0; i < logModels.length; i++ )
    {
      let ele = document.getElementById(logModels[i].id);
      ele.checked = isChecked;
    }
    isChecked ? setLogDel(logModels.map(item=> item.id)) : setLogDel([])
    //setLogDel(logDel)
  }
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, logModels.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    let sortExpression = orderBy + ' ' + order;
    getListLogModels(newPage, rowsPerPage, sortExpression);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPageCommon(event.target.value);
    setPage(0);
    let sortExpression = orderBy + ' ' + order;
    getListLogModels(1, event.target.value, sortExpression);
  };

  const totalPage = Math.ceil(contentModel.totalItemCount / rowsPerPage);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size='small' stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}  align={headCell.align} className='pt-3 pb-3 text-nowrap'>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      hideSortIcon={true}>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                  <TableCell key='action' align={"center"} className='pt-3 pb-3 text-nowrap'>
                        <input id={"cbAll"} type={"checkbox"} onChange={handleCheckbox} ></input>
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logModels && logModels.length > 0 ? (
                logModels.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component='th'  id={labelId} scope='row' onClick={() => handleOpenEditDialog(row.id)} >
                        {row.message.length > 100 ? (row.message.substring(0,100) + "...") : row.message}
                      </TableCell>
                      <TableCell onClick={() => handleOpenEditDialog(row.id)}>{row.raiseDate}</TableCell>
                      <TableCell className='text-center' style={{ minWidth: 120}} onClick={() => handleOpenEditDialog(row.id)}>
                        <Button
                           size="small"
                           variant="contained"
                           className={row.level === "Error" ? classes.ERROR : (row.level === "Information"? classes.INFO : classes.WARNING)}
                         >
                           {row.level}
                         </Button>
                      </TableCell>
                      <TableCell align="center" className="reflection-table-action">
                      <input
                      id={row.id} 
                      type="checkbox"  
                      onChange={(e) => {
                        // add to list
                        if (e.target.checked) {
                          setLogDel([...logDel,row.id]);
                        } else {
                          // remove from list
                          setLogDel(logDel.filter(x=>x != row.id));
                        }
                      }}
                             />
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
export default ListLog;
