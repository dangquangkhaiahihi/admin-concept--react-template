import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FooterPagination from "../../../../components/footer-pagination/footer-pagination";
import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    // maxHeight: window.outerHeight - 365,
    maxHeight: `calc(100vh - 450px)`,
    '@media (max-width: 1224px)': {
      maxHeight:'50vh',
    }
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
  stickyHeader: {
    top: 140,
    zIndex: 3,
  },
}));

const ListAnalysis = ({
  totalItemCount,
  data,
  GetListAll,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  componentTargerExport,
  currentObjectType
}) => {
  const classes = useStyles();

  const headCells = [
    { id: "code", hideSortIcon: false,
      label: currentObjectType === "dat" ? "Tên loại đất" : "Tên đối tượng"
    },
    { id: "count", hideSortIcon: false, label: "Số lượng đối tượng" },
    { id: "total", hideSortIcon: false, 
      label: currentObjectType === "dat" ? "Tổng diện tích (m²)" : "Tổng chiều dài (m)"
    },
    { id: "minValue", hideSortIcon: false, 
      label: currentObjectType === "dat" ? "Diện tích bé nhất (m²)" : "Chiều dài bé nhất (m)"
    },
    { id: "maxValue", hideSortIcon: false, 
      label: currentObjectType === "dat" ? "Diện tích lớn nhất (m²)" : "Chiều dài lớn nhất (m)"
    },
  ];

  useEffect(() => {
    // document.querySelector(".right-content").style.removeProperty("overflow-y");
    // document.querySelector(".right-content").style.overflow = "visible";
  }, []);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage - 1);
    GetListAll(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    GetListAll(1, event.target.value);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table ref={componentTargerExport} className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              headCells={headCells}
            />
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      style={{
                        backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                      }}
                    >
                      <TableCell id={`code-${row.planningId}`}>
                        { 
                          ( currentObjectType =='dat' || currentObjectType =='giao_thong' )
                          && row.name 
                        }
                        { 
                          ( ( currentObjectType =='dien' ) || 
                            ( currentObjectType =='nuoc' )
                          ) 
                            && row.code 
                        }
                      </TableCell>
                      <TableCell id={`count-${index}`}>{row.count}</TableCell>
                
                      <TableCell id={`total-${index}`}>
                        {row.total}
                      </TableCell>
                      <TableCell id={`minValue-${index}`}>
                        {row.minValue}
                      </TableCell>
                      <TableCell id={`areaMax-${index}`}>
                        {row.maxValue}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={8} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 0 }}>
                  <TableCell
                    colSpan={8}
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
          ""
        )}
      </Paper>
    </div>
  );
};

const EnhancedTableHead = ({ classes, order, orderBy, headCells }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            // className={`pt-3 pb-3 text-nowrap`}
            className={
              "pt-3 pb-3 text-nowrap " +
              ((headCell.id === "planningName" && isDesktopOrLaptop) ? "MuiTableCell-freeze" : "")
            }
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default ListAnalysis;
