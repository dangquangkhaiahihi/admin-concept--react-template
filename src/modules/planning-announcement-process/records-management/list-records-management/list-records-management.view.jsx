/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Configs } from "../../../../common/config";
import "date-fns";
import dateformat from "dateformat";
import * as accAction from "../../../../redux/store/account/account.store";
import * as apiConfig from "../../../../api/api-config";
//--- Material Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";

//--- Material Control
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

//--- Material Icon
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import EditIcon from "@material-ui/icons/Edit";
import MapIcon from "@material-ui/icons/Map";
import GridOnIcon from "@material-ui/icons/GridOn";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import Visibility from "@material-ui/icons/Visibility";

//--- Component
import ConsultTheCommunity from "../../consult-the-community/consult-the-community.view";
import CreateAnnounced from "../../announced/add-announced/add-announced.view";
import EditAnnounced from "../../announced/edit-announced/edit-announced.view";
import PlanningRelatedDialog from "../../planning-related/planning-related.view";
import DocumentSettings from "../../document-settings/document-settings.view";
import FooterPagination from "../../../../components/footer-pagination/footer-pagination";
import { UrlCollection } from "../../../../common/url-collection";
import { Link, useHistory } from "react-router-dom";
import { TitleRounded } from "@material-ui/icons";
import { title } from "process";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";
import { getCookies } from "../../../../utils/configuration";

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
  // "@media (min-width: 1920px)": {
  //   tableContainer: {
  //     maxHeight: 470,
  //   },
  // },
}));

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
            hidden={!headCell.visibleColumn}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.hideSortIcon ? true : false}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ListRecordsManagement(props) {
  const {
    dataList,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    onGetListData,
    planning,
    setPlanning,
    planningId,
    setPlanningId,
    editAction,
    totalItemCount,
    headCells,
    showConsult,
    setShowConsult,
    deleteAction,
    lockAction,
    unLockAction,
    isQHHTKT = false,
    isOtherPlanning = false,
    isQHCC = false,
    isQHT = false,
    title,
    planningUnitSelected,
    approvalAgencySelected,
    investorSelected,
    typeSelected,
    levelSelected,
    statusIdSelected,
    districtSelected,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const [openDocumentSetting, setOpenDocumentSetting] = useState(false);
  const [planningName, setPlanningName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLock, setIsLock] = useState(false)
  useEffect(() => {
    if (showConsult) {
      setOpenConsultTheCommunityDialog(true);
      setPlanningName(props.planningName);
    }
  }, [props.showConsult]);
  useEffect(() => {
    GetDetailAcc();
  }, [])

  const GetDetailAcc = () => {
    accAction.GetDetailAcc().then(res => {
      setIsAdmin(res && res.content && res.content.roleNames === 'ADMIN' ? true : false)
    })
  }
  //--- Setting table
  const emptyRows =
    pageSize - Math.min(pageSize, dataList.length - page * pageSize);
  const totalPage = Math.ceil(totalItemCount / pageSize);
  const onRequestSort = (event, property) => {
    let isAsc = orderBy === property && order === "asc";
    let sort = isAsc ? "desc" : "asc";
    let sortExpression = property + " " + sort;
    setOrder(sort);
    setOrderBy(property);
    onGetListData(page <= 0 ? 1 : page, pageSize, sortExpression);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage - 1);
    const planningUnit = planningUnitSelected?.id;
    const approvalAgency = approvalAgencySelected?.id;
    const investor = investorSelected?.id;
    const type = typeSelected?.id;
    const level = levelSelected?.id;
    const statusId = statusIdSelected?.id;
    const districtId = districtSelected?.id;
    onGetListData(newPage, pageSize, orderBy ? orderBy + " " + order : "",
      title, type, level, statusId, planningUnit, investor, approvalAgency, districtId);
  };

  const onChangePageSize = (event) => {
    const planningUnit = planningUnitSelected?.id;
    const approvalAgency = approvalAgencySelected?.id;
    const investor = investorSelected?.id;
    const type = typeSelected?.id;
    const level = levelSelected?.id;
    const statusId = statusIdSelected?.id;
    const districtId = districtSelected?.id;

    setPageSize(Number(event.target.value));
    setPage(1);
    onGetListData(1, event.target.value, orderBy ? orderBy + " " + order : "",
      title, type, level, statusId, planningUnit, investor, approvalAgency, districtId
    );
  };

  //--- Consult community dialog
  const [openConsultTheCommunityDialog, setOpenConsultTheCommunityDialog] =
    useState(false);

  const handleClickOpenConsultTheComminityDialog = (
    id = "",
    planningName = ""
  ) => {
    if (id && planningName) {
      setPlanningId(id || planningId);
      setPlanningName(planningName);
      setOpenConsultTheCommunityDialog(true);
    }
  };

  const handleCloseConsultTheCommunityDialog = () => {
    setPlanningId(null);
    window.history.pushState({}, "", "/");
    setShowConsult(false);
    setOpenConsultTheCommunityDialog(false);
  };

  //--- Announced dialog
  const [openCreateAnnouncedDialog, setOpenCreateAnnouncedDialog] =
    useState(false);

  const onOpenCreateAnnouncedDialog = (item) => {
    if (item) {
      setIsLock(item.isLock)
      setPlanningId(item.id);
      setPlanning(item);
      setOpenCreateAnnouncedDialog(true);
    }
  };

  const onCloseCreateAnnouncedDialog = () => {
    setOpenCreateAnnouncedDialog(false);
    setPlanningId(null);
    setPlanning(null);
    setActiveStep(0);
  };

  const handleSuccessAnnouncedDialog = () => {
    onGetListData(page, pageSize, orderBy ? orderBy + " " + order : "");
    onCloseCreateAnnouncedDialog();
  };

  const [openEditAnnouncedDialog, setOpenEditAnnouncedDialog] = useState(false);

  const onOpenEditAnnouncedDialog = (item) => {
    if (item) {
      setPlanningId(item.id);
      setOpenEditAnnouncedDialog(true);
      history.push({
        pathname: UrlCollection.EditAnnouce.replace(":id", item.id),
        state: { isLock: item.isLock }
      });
    }
  };

  const onCloseEditAnnouncedDialog = () => {
    setOpenEditAnnouncedDialog(false);
    setPlanningId(null);
  };

  const onSuccessEditAnnounced = () => {
    onGetListData(page, pageSize, orderBy ? orderBy + " " + order : "");
    onCloseEditAnnouncedDialog();
  };

  //--- Planning related dialog
  const [openPlanningRelatedDialog, setOpenPlanningRelatedDialog] =
    useState(false);

  const handleClickOpenPlanningRelated = (id, name) => {
    if (id && name) {
      setPlanningId(id);
      setPlanningName(name);
      //setOpenPlanningRelatedDialog(true);
      history.push({
        pathname: UrlCollection.PlanningRelate.replace(":id", id),
        state: {
          name,
        },
      });
    }
  };

  const handleClosePlanningRelatedDialog = () => {
    setOpenPlanningRelatedDialog(false);
    setPlanningId(null);
  };

  const onSuccessPlanningRelationship = () => {
    onGetListData(page, pageSize, orderBy ? orderBy + " " + order : "");
    handleClosePlanningRelatedDialog();
  };

  //--- Step
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const pushToListConsultDetail = (isQHHTKT, isQHCC) => {
    if (isQHHTKT) return UrlCollection.QH_HTKT_CONSULT_ID;
    if (isQHCC) return UrlCollection.ConsultPlanningCCId;
    return UrlCollection.ConsultTheCommunityId;
  };

  const pushToListPlanningRelatedDetail = (isQHHTKT, isQHCC) => {
    if (isQHHTKT) return UrlCollection.QH_HTKT_RelateId;
    if (isQHCC) return UrlCollection.PlanningCCRelateId;
    return UrlCollection.PlanningRelateId;
  };

  const pushToListSetupDocumentDetail = (isQHHTKT, isQHCC) => {
    if (isQHHTKT) return UrlCollection.QH_HTKT_SETUP_DOCUMENT_DETAIL;
    if (isQHCC) return UrlCollection.DocumentPlanningCCId;
    return UrlCollection.DocumentSettingId;
  };

  const showtoast = () => {
    ShowNotification('Đồ án đã bị khóa, không thể xóa', NotificationMessageType.Warning)
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size="small" stickyHeader>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
              rowCount={dataList.length}
              headCells={headCells}
            />
            <TableBody>
              {dataList && dataList.length > 0 ? (
                dataList
                  ?.filter((item) =>
                    !isQHHTKT && !isOtherPlanning
                      ? item?.planningTypeId !== 5 && item?.planningTypeId !== 6
                      : true
                  )
                  ?.map((row, index) => {
                    return (
                      <TableRow
                        hover
                        key={index}
                        style={{
                          backgroundColor: index % 2 ? "#FFFFFF" : "#EEF0F2",
                        }}
                      >
                        {headCells.map((headItem, headIndex) => {
                          switch (headItem.id) {
                            case "planningName":
                              return (
                                <TableCell
                                  key={headIndex}
                                  hidden={!headItem.visibleColumn}
                                  className={`shadow-sm ${isDesktopOrLaptop ? 'MuiTableCell-freeze' : ''}`}
                                  style={{
                                    backgroundColor:
                                      index % 2 ? "#FFFFFF" : "#EEF0F2",
                                  }}
                                >
                                  {row.name}
                                  {row.isLock && (
                                    <LockIcon style={{ width: '15px', marginLeft: '10px' }} color='primary' />
                                  )}
                                </TableCell>
                              );
                            case "planningCode":
                              return (
                                <TableCell
                                  key={headIndex}
                                  hidden={!headItem.visibleColumn}
                                >
                                  {row.planningCode}
                                </TableCell>
                              );
                            case "planningTypeName":
                              return (
                                <TableCell
                                  key={headIndex}
                                  hidden={!headItem.visibleColumn}
                                >
                                  {row.planningTypeName}
                                </TableCell>
                              );
                            case "place":
                              return <TableCell>{isQHCC ? row.districtNames.join(', ') :
                                row.place ? row.place : row.districtNames.join(', ')}
                              </TableCell>;
                            case "mapLink":
                              return (
                                <TableCell>
                                  <span
                                    className="map-link"
                                    onClick={
                                      () =>
                                        props.openCreatMapModal(
                                          row.mapId,
                                          row.id,
                                          row.name,
                                          row.isLock,
                                        )
                                      // history.push({
                                      //   pathname: UrlCollection.InitMap.replace(
                                      //     ':id',
                                      //     row.id
                                      //   ),
                                      //   state: {
                                      //     mapId: row.mapId,
                                      //     name: row.name,
                                      //   },
                                      // })
                                    }
                                  >
                                    {row.mapId ? (isQHT ?
                                      <Tooltip title="Link bản đồ">
                                        <IconButton
                                          aria-label="Link bản đồ"
                                        >
                                          <MapIcon className="text-primary d-flex justify-content-center" />
                                        </IconButton>
                                      </Tooltip>

                                      : "Chỉnh sửa") : "Tạo mới"}
                                  </span>
                                </TableCell>
                              );
                            case "planningStatusName":
                              return (
                                <TableCell className="text-nowrap">
                                  <h6>
                                    {row.planningStatusId === 1 ? (
                                      <span className="badge badge-success p-2 text-uppercase">
                                        {row.planningStatusName}
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning p-2 text-uppercase">
                                        {row.planningStatusName}
                                      </span>
                                    )}
                                  </h6>
                                </TableCell>
                              );
                            case "planningLevelName":
                              return (
                                <TableCell>{row.planningLevelName}</TableCell>
                              );
                            case "planningAgency":
                              return (
                                <TableCell>{row.planningAgency}</TableCell>
                              );
                            case "planningUnit":
                              return <TableCell>{row.planningUnit}</TableCell>;
                            case "agencySubmitted":
                              return (
                                <TableCell>{row.agencySubmitted}</TableCell>
                              );
                            case "consultingUnit":
                              return (
                                <TableCell>{row.consultingUnit}</TableCell>
                              );
                            case "investor":
                              return <TableCell>{row.investor}</TableCell>;
                            case "documentTypeName":
                              return (
                                <TableCell>{row.documentTypeName}</TableCell>
                              );
                            case "modifiedDate":
                              return (
                                <TableCell>
                                  {dateformat(row.modified_date, "dd/mm/yyyy")}
                                </TableCell>
                              );
                            case "createdDate":
                              return (
                                <TableCell>
                                  {dateformat(row.created_date, "dd/mm/yyyy")}
                                </TableCell>
                              );
                            case "createdBy":
                              return (
                                <TableCell>
                                  {row.created_by}
                                </TableCell>
                              );
                            case "consultTheCommunity":
                              return (
                                <TableCell>
                                  <Tooltip title="Xin ý kiến" >
                                    <IconButton
                                      aria-label="xin-y-kien"
                                      onClick={() =>
                                        {
                                          const locationState = props.getLocationState();
                                          history.push({
                                            pathname: pushToListConsultDetail(
                                              isQHHTKT, isQHCC
                                            ).replace(":id", row.id),
                                            state: {...locationState,
                                              name: row.name,
                                              isLock: row.isLock,
                                            },
                                          })
                                        }
                                      }
                                    >
                                      <Badge
                                        color="primary"
                                        badgeContent={
                                          row.numberOfConsultantCommunity
                                        }
                                        showZero
                                      >
                                        <ChatBubbleIcon />
                                      </Badge>
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              );
                            case "announced":
                              return (
                                <TableCell className="text-nowrap">
                                  {row.planningStatusId === 1 &&
                                    row.statementStatus === 0 ? (
                                    <Tooltip title="Công bố" >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          onOpenCreateAnnouncedDialog(row)
                                        }
                                      >
                                        Công bố
                                      </Button>
                                    </Tooltip>
                                  ) : row.statementStatus === 1 ? (
                                    <Tooltip title="Đã công bố" >
                                      <Button
                                        variant="contained"
                                        className="bg-success text-white"
                                        onClick={() =>
                                          onOpenEditAnnouncedDialog(row)
                                        }
                                      >
                                        Đã công bố
                                      </Button>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Không công bố" >
                                      <Button
                                        variant="contained"
                                        className="bg-info text-white"
                                        onClick={() =>
                                          onOpenEditAnnouncedDialog(row)
                                        }
                                      >
                                        Không công bố
                                      </Button>
                                    </Tooltip>
                                  )}
                                </TableCell>
                              );
                            case "isCheck":
                              return (
                                <TableCell className="text-nowrap">
                                  <h6>
                                    {row.isCheck ? (
                                      <span className="badge badge-success p-2 text-uppercase">
                                        Đã kiểm tra
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning p-2 text-uppercase">
                                        Chưa kiểm tra
                                      </span>
                                    )}
                                  </h6>
                                </TableCell>
                              );
                            case "isCheckDocument":
                              return (
                                <TableCell className="text-nowrap">
                                  <h6>
                                    {row.isCheckDocument ? (
                                      <span className="badge badge-success p-2 text-uppercase">
                                        Đã kiểm tra
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning p-2 text-uppercase">
                                        Chưa kiểm tra
                                      </span>
                                    )}
                                  </h6>
                                </TableCell>
                              );
                            case "planningRelated":
                              return (
                                <TableCell align="center">
                                  <Tooltip title="Quy hoạch liên quan" >
                                    <IconButton
                                      onClick={() => {
                                        const locationState = props.getLocationState();
                                        history.push({
                                          pathname:
                                            pushToListPlanningRelatedDetail(
                                              isQHHTKT, isQHCC
                                            ).replace(":id", row.id),
                                          state: {...locationState,
                                            name: row.name,
                                            isLock: row.isLock,
                                          },
                                        });
                                      }}
                                    >
                                      <Badge
                                        color="primary"
                                        badgeContent={
                                          row.numberOfRelatePlanning
                                        }
                                        showZero
                                      >
                                        <GridOnIcon />
                                      </Badge>
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              );
                            case "documentSettings":
                              return (
                                <TableCell align="center">
                                  <Tooltip title="Quản lý hồ sơ">
                                    <IconButton
                                      onClick={() => {
                                        const locationState = props.getLocationState();
                                        history.push({
                                          pathname:
                                            pushToListSetupDocumentDetail(
                                              isQHHTKT, isQHCC
                                            ).replace(":id", row.id),
                                          state: {...locationState,
                                            name: row.name,
                                            isLock: row.isLock,
                                          },
                                        });
                                      }}
                                    >
                                      <Badge
                                        color="primary"
                                        badgeContent={row.numberOfDocument}
                                        showZero
                                      >
                                        <AssignmentIcon />
                                      </Badge>
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              );
                            case "actions":
                              return (
                                <TableCell
                                  align="right"
                                  className="text-nowrap"
                                >
                                  {!row.isLock && (
                                    <Tooltip title="Sửa">
                                      <IconButton
                                        aria-label="edit"
                                        onClick={() => editAction(row.id)}
                                      >
                                        <EditIcon color='primary' />

                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {isAdmin && (
                                    !row.isLock
                                      ? (
                                        <Tooltip title='Khoá'>
                                          <IconButton
                                            aria-label='lock'
                                            onClick={() => lockAction(row.id, false)}
                                          >
                                            <LockIcon className='text-primary' />
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title='Mở khóa'>
                                          <IconButton
                                            aria-label='active'
                                            onClick={() => unLockAction(row.id, true)}
                                          >
                                            <LockOpenIcon className='text-primary' />
                                          </IconButton>
                                        </Tooltip>
                                      )
                                  )}
                                  {!row.isLock ? (
                                    <Tooltip title="Xóa">

                                      <IconButton
                                        aria-label="delete"
                                        onClick={() => deleteAction(row.id)}
                                      >
                                        <DeleteIcon className="text-danger" />
                                      </IconButton>

                                    </Tooltip>
                                  ) : (
                                    <a href={`${apiConfig.domainUserSide}/ban-do-quy-hoach/${row.id}`} target='_blank'>
                                      <Tooltip title="Xem">
                                        <IconButton
                                          aria-label="visiable"
                                        >
                                          <Visibility className='text-primary' />
                                        </IconButton>

                                      </Tooltip>
                                    </a>
                                  )}
                                </TableCell>
                              );
                            default:
                              break;
                          }
                        })}
                        {/* <TableCell>{row.planningCode}</TableCell> */}
                        {/* <TableCell className="text-nowrap">{row.name}</TableCell> */}
                        {/* <TableCell>{row.planningTypeName}</TableCell> */}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={18} className="text-center">
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
            currentPage={page}
            rowsPerPage={pageSize}
            handleChangeRowsPerPage={onChangePageSize}
            handleChangePage={onChangePage}
            totalPage={totalPage}
            size={isTabletOrMobile ? 'small' : ''}
          />
        ) : (
          ""
        )}
      </Paper>

      {openConsultTheCommunityDialog && (
        <ConsultTheCommunity
          openConsultTheCommunityDialog={openConsultTheCommunityDialog}
          handleCloseConsultTheCommunityDialog={
            handleCloseConsultTheCommunityDialog
          }
          classes={classes}
          planningId={planningId}
          planningName={planningName}
          showConsult={showConsult}
        />
      )}

      {openCreateAnnouncedDialog && (
        <Dialog
          open={openCreateAnnouncedDialog}
          onClose={onCloseCreateAnnouncedDialog}
          aria-labelledby="annoucedDialog"
          aria-describedby="annoucedDescription"
          maxWidth={activeStep === steps.length - 1 ? "md" : "sm"}
          fullWidth={true}
        >
          <DialogContent className="p-0">
            <div className="w-100">
              <Stepper
                activeStep={activeStep}
                className="bg-light p-4 border-bottom"
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {getStepContent(
                activeStep,
                planningId,
                handleNext,
                onCloseCreateAnnouncedDialog,
                handleSuccessAnnouncedDialog,
                classes,
                planning,
                isLock,
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {openEditAnnouncedDialog && (
        <EditAnnounced
          planningId={planningId}
          isOpen={openEditAnnouncedDialog}
          onClose={onCloseEditAnnouncedDialog}
          onSuccess={onSuccessEditAnnounced}
          classes={classes}
          planning={planning}
        />
      )}

      {/* Quy hoạch liên quan */}
      {openPlanningRelatedDialog && (
        <PlanningRelatedDialog
          openPlanningRelatedDialog={openPlanningRelatedDialog}
          handleClosePlanningRelatedDialog={handleClosePlanningRelatedDialog}
          onSuccess={onSuccessPlanningRelationship}
          planningId={planningId}
          pageSize={pageSize}
          page={page}
          setPage={setPage}
          planningName={planningName}
        />
      )}

      {openDocumentSetting && (
        <DocumentSettings
          isShowDialog={openDocumentSetting}
          onCloseDialog={() => setOpenDocumentSetting(false)}
          planningId={planningId}
          planningName={planningName}
        />
      )}
    </div>
  );
}

//--- Create steps
function getSteps() {
  return ["Công bố", "Tạo bài viết công bố"];
}

function getStepContent(
  step,
  planningId,
  handleNext,
  onCloseCreateAnnouncedDialog,
  handleSuccessAnnouncedDialog,
  classes,
  planning,
  isLock
) {
  switch (step) {
    case 0:
      return (
        <div>
          {!isLock ? (
            <>
              <div className="p-3 text-center">
                Bạn có chắc muốn công bố dự án này?
              </div>
              <div className="text-right border-top pt-3 pr-2 pb-3">
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Đồng ý
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 text-center">
                Dự án đã bị khóa, bạn không thể thực hiện chức năng này.
              </div>
              <div className="text-right border-top pt-3 pr-2 pb-3">
              </div>
            </>
          )}
        </div>
      );
    case 1:
      return (
        <CreateAnnounced
          planningId={planningId}
          onClose={onCloseCreateAnnouncedDialog}
          onSuccess={handleSuccessAnnouncedDialog}
          classes={classes}
          planning={planning}
        />
      );
    default:
      return "";
  }
}
