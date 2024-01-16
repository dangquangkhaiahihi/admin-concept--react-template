import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useMediaQuery } from "react-responsive";
import { IconButton, Tooltip } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTrash } from "@fortawesome/free-solid-svg-icons";
import ControlFunctionType from "../../../../../components/open-layer/control-function-type/control-function-type";
import CustomPagination from "./pagination/pagination.view";
import { KeyboardArrowLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: '100%',

    // maxHeight: `calc(100vh - 450px)`,
    // '@media (max-width: 1224px)': {
    //   maxHeight:'50vh',
    // }
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

const SearchMapResult = ({
  totalItemCount,
  data,
  onGetObjectGeogisOnMap,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  componentTargerExport,
  currentObjectType,
  callOpenlayerOutSideFunction,
  setIsEntendLeftBar,
  checked,
  setChecked,
  typeSelected,
  objectTypeSelected,
  objectKindSelected,
  districtSelected,
  yearSelected,
  isEntendLeftBar
}) => {
  const classes = useStyles();

  const headCells = [
    { id: "table_name", hideSortIcon: false,
        label: currentObjectType === "dat" ? "Tên loại đất" : "Tên đối tượng"
    },
    { id: "value", hideSortIcon: false,
        label: currentObjectType === "dat" ? "Diện tích (m²)" : "Chiều dài (m)" },
  ];

  const handleChangePage = async (_event, newPage) => {
    const type = typeSelected?.id;
    const objectType = objectTypeSelected?.id;
    const objectKind = objectKindSelected?.code;
    const district = districtSelected?.id;
    const year = yearSelected?.id;
    setPage(newPage - 1);
    await onGetObjectGeogisOnMap(
      newPage,
      rowsPerPage,
      year,
      type,
      objectType,
      objectKind,
      district
    );
  };

  const handleChangeRowsPerPage = async (event) => {
    const type = typeSelected?.id;
    const objectType = objectTypeSelected?.id;
    const objectKind = objectKindSelected?.code;
    const district = districtSelected?.id;
    const year = yearSelected?.id;
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    await onGetObjectGeogisOnMap(
      1,
      event.target.value,
      year,
      type,
      objectType,
      objectKind,
      district
    );
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  const onDownloadExcelOffline = () => {
    var tab_text = "<table border='2px'><thead><tr>";
    const _th =
        "<th style='color:white; background-color:#007bff; height:70px;'>" + (currentObjectType === "dat" ? "Tên loại đất" : "Tên đối tượng") + "</th>" +
        "<th style='color:white; background-color:#007bff; height:70px;'>" + (currentObjectType === "dat" ? "Diện tích (m²)" : "Chiều dài (m)") + "</th>" 
    tab_text += _th + "</tr></thead><tbody>";

    var _body = "";
    data &&
      data.forEach((item, index) => {
        if(checked.includes(index)) {
          _body += "<tr>";

          var _row = "";
          const _td = "<td>" + (item.table_name) + "</td>" + "<td>" + (item.value) + "</td>";
          _row += _td;
          
          _body += _row + "</tr>";
        }
      });

    tab_text += _body + "</tbody></table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    const sa = window.open(
      "data:application/vnd.ms-excel," + encodeURIComponent(tab_text)
    );
    return sa;
  };

  const DeleteAllHightLightedPolygon = () => {
    callOpenlayerOutSideFunction(ControlFunctionType.Delete_All_HightLightedPolygon, '');
    setChecked([]);
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>

        {
          data && data.length > 0 ? 
            <div className="row justif">
              <div className="col-6">
                <Tooltip title="Xuất excel">
                  <IconButton
                    aria-label="excel"
                    onClick={onDownloadExcelOffline}
                  >
                    <FontAwesomeIcon icon={faFileExcel} color="green"/>
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Xóa kết quả trên bản đồ">
                  <IconButton
                    aria-label="detele"
                    onClick={DeleteAllHightLightedPolygon}
                  >
                    <FontAwesomeIcon icon={faTrash} color="red"/>
                  </IconButton>
                </Tooltip>
              </div>
              <div className="col-6 row justify-content-end">
                <Tooltip title="Mở rộng">
                  <IconButton
                    aria-label="extend"
                    onClick={setIsEntendLeftBar}
                  >
                    {
                      !isEntendLeftBar && <KeyboardArrowRight className="text-primary"/>
                    }
                    {
                      isEntendLeftBar && <KeyboardArrowLeft className="text-primary"/>
                    }
                  </IconButton>
                </Tooltip>
              </div>
            </div> 
            : null
        }

        {totalItemCount && totalItemCount > 0 ? (
          <CustomPagination
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
        
        <TableContainer className={classes.tableContainer}>
          <Table ref={componentTargerExport} className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              headCells={headCells}
              isCheckAll={checked.length == data.length}
              checkAll={() => {
                const tempChecked = [];
                data.map((item,index) => {
                  tempChecked.push(index);
                  callOpenlayerOutSideFunction(ControlFunctionType.Add_Single_HightLightedPolygon, {'geo': [item.geo],'index': index});
                })
                setChecked(tempChecked);
              }}
              checked={checked}
              uncheckAll={DeleteAllHightLightedPolygon}
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
                        <TableCell style={{fontWeight : 600,cursor: 'pointer'}} id={`table_name-${index}`}
                          onClick={() => {
                            // callOpenlayerOutSideFunction(ControlFunctionType.HightLightPolygon, [row.geo]);
                            if (!checked.includes(index)) {
                              setChecked([...checked, index]);
                              callOpenlayerOutSideFunction(ControlFunctionType.Add_Single_HightLightedPolygon, {'geo': [row.geo],'index': index});
                              callOpenlayerOutSideFunction(ControlFunctionType.CenterMapAndZoom, {'center': row.center,'zoom': 15});
                            } else {
                              setChecked(checked.filter(id => id !== index));
                              callOpenlayerOutSideFunction(ControlFunctionType.Delete_Single_HightLightedPolygon, {'index': index});
                            }
                          }}
                        > 
                          <input type="checkbox" style={{marginRight: '10px'}} checked={checked.includes(index)}/> { row.table_name } 
                        </TableCell>
                        <TableCell id={`value-${index}`}> { row.value } </TableCell>
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
      </Paper>
    </div>
  );
};

const EnhancedTableHead = ({ classes, order, orderBy, headCells, isCheckAll, checkAll, uncheckAll, checked }) => {
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
            className={
              "pt-3 pb-3 text-nowrap " +
              ((headCell.id === "planningName" && isDesktopOrLaptop) ? "MuiTableCell-freeze" : "")
            }
            onClick={() => {
              if(checked == 0) {
                checkAll();
              } else {
                uncheckAll();
              }
            }} 
          >
            <input type="checkbox" style={{marginRight: '10px'}} checked={isCheckAll}/> {headCell.label}
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

export default SearchMapResult;
