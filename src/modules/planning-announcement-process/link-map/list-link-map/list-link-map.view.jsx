import React, {useEffect} from "react";
// import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import RecordsManagement from '../../records-management/records-management.view';
 
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
    overflow: "visible"
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
  appBar: {
    position: "relative",
    backgroundColor: "#00923F",
  },
  title: {
    marginLeft: theme.spacing(0),
    flex: 1,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  stickyHeader: {
    top: 140,
    zIndex:3
  }
}));


const ListLinkMap = (props) => {
  const {
    headCells
  } = props;

  const headCell =
  [
    {
      id: 'planningName',
      hideSortIcon: false,
      label: 'Tên đồ án QH',
      visibleColumn: true,
    },
    {
      id: 'planningCode',
      hideSortIcon: false,
      label: 'Mã quy hoạch',
      visibleColumn: true,
    },
    {
      id: 'planningTypeName',
      hideSortIcon: false,
      label: 'Loại quy hoạch',
      visibleColumn: true,
    },
    {
      id: 'place',
      hideSortIcon: false,
      label: 'Địa điểm',
      visibleColumn: true,
    },
    {
      id: 'modifiedDate',
      hideSortIcon: false,
      label: 'Ngày cập nhật ',
      visibleColumn: true,
    },
    
    {
      id: 'mapLink',
      hideSortIcon: true,
      label: 'Link bản đồ',
      visibleColumn: true,
    },
    { id: 'actions', hideSortIcon: true, label: '', visibleColumn: true },
  ]

  return (
      <RecordsManagement
      headCell = {headCell}
      ></RecordsManagement>
  );
};

export default ListLinkMap;
