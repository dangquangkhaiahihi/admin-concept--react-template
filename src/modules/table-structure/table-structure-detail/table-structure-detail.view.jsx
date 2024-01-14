import React, { useState } from "react";

//--- Material control
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

//--- Material Icon
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    maxHeight: window.outerHeight - 295,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),

  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function TableStructureDetail() {
  const classes = useStyles();

  //--- Edit table structure
  const [
    openEditTableStructureDialog,
    setOpenEditTableStructureDialog,
  ] = React.useState(false);

  const handleClickOpenEditTableStructureDialog = () => {
    setOpenEditTableStructureDialog(true);
  };
  const handleCloseEditTableStructureDialog = () => {
    setOpenEditTableStructureDialog(false);
  };

  //--- Table type
  const tableTypeList = [
    { title: "Serial", value: 1 },
    { title: "Text", value: 2 },
    { title: "Character", value: 3 },
    { title: "Bigint", value: 4 },
    { title: "Money", value: 5 },
    { title: "Integer", value: 6 },
    { title: "Double", value: 7 },
    { title: "Date", value: 8 },
    { title: "Datetime", value: 9 },
    { title: "Json", value: 10 },
    { title: "Html", value: 11 },
    { title: "Image", value: 12 },
    { title: "File", value: 13 },
    { title: "Point", value: 14 },
    { title: "Multipoint", value: 15 },
    { title: "Linestring", value: 16 },
    { title: "Multilinestring", value: 17 },
    { title: "Polygon", value: 18 },
    { title: "Multipolygon", value: 19 },
    { title: "UUID", value: 20 },
  ];

  return (
    <div className="table-structure-detail p-4">
      <div className="row no-gutters mb-3">
        <div className="col">
          <h1 className="h3 mb-0 text-gray-800">
            <Tooltip title="Refresh">
              <Fab color="primary" aria-label="filter" size="small">
                <RefreshIcon />
              </Fab>
            </Tooltip>
          </h1>
        </div>

        <div className="col text-right">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            className="bg-success text-white"
            onClick={handleClickOpenEditTableStructureDialog}
          >
            Sửa cấu trúc bảng
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            color="primary"
            className="ml-2"
          >
            Thêm dữ liệu
          </Button>
        </div>
      </div>

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell>Calories</TableCell>
                  <TableCell>Fat&nbsp;(g)</TableCell>
                  <TableCell>Carbs&nbsp;(g)</TableCell>
                  <TableCell>Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>{row.fat}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      {/*--- Edit table structure dialog ---*/}
      <Dialog
        onClose={handleCloseEditTableStructureDialog}
        open={openEditTableStructureDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle onClose={handleCloseEditTableStructureDialog}>
          {"Sửa cấu trúc bảng"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseEditTableStructureDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="row align-items-center">
            <div className="col-1">
              <IconButton color="primary">
                <OpenWithIcon />
              </IconButton>
            </div>
            <div className="col">
              <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="col">
              <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="col">
              <Autocomplete
                options={tableTypeList}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="col-1">
              <IconButton color="secondary">
                <IndeterminateCheckBoxIcon />
              </IconButton>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEditTableStructureDialog}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TableStructureDetail;
