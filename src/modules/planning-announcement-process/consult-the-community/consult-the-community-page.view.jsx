import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as consultTheCommunityAction from '../../../redux/store/consult-the-community/consult-the-community.store';
import * as viVN from '../../../language/vi-VN.json';
import {
  NotificationMessageType,
  Transition,
} from '../../../utils/configuration';
import { Configs } from '../../../common/config';

//--- Material Control
import {
  Button,
  Tooltip,
  Fab,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

//--- Material Icon
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';

//--- Component
import ListConsultTheCommunity from './list-consult-the-community/list-consult-the-community.view';
import AddConsultTheCommunity from './add-consult-the-community/add-consult-the-community.view';
import EditConsultTheCommunity from './edit-consult-the-community/edit-consult-the-community.view';
import DeleteDialog from '../../../components/dialog-delete/dialog-delete.view';
import ShowNotification from '../../../components/react-notifications/react-notifications';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { UrlCollection } from '../../../common/url-collection';

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
  appBar: {
    position: 'relative',
    backgroundColor: '#00923F',
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
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function ConsultTheCommunityPage(props) {
  const {
    isQHCC,
    isQHHTKT,
    showConsult,
    settings
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const {isLock} = history.location.state || false;
  const planningId = id;
  const { name } = history.location.state || "";
  //const planningName = name;
  const [planningName, setPlanningName] = useState(name);
  const [typeId, setTypeId] = useState(1);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('startTime');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(Configs.DefaultPageSize);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [dataModel, setDataModel] = useState(null);
  const [consultCommunityId, setConsultCommunityId] = useState(null);
  const [formTemplateId, setFormTemplateId] = useState(null);
  const [data, setData] = useState({
    planning: null,
    title: '',
    status: null,
    hotNew: null,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    GetConsultCommunityByPlanning();
    console.log('props', history)
  }, []);

  useEffect(() => {
    setClientSetting(settings);
  }, [settings]);

  const [clientSetting, setClientSetting] = useState();

  // --- Get List Consult The Community
  const GetConsultCommunityByPlanning = (id = planningId) => {
    consultTheCommunityAction.GetConsultCommunityByPlanning(id).then(
      (res) => {
        console.log('res', res)
        console.log('res.content', res.content.planningName)
        // console.log('res.content[0].planningName',res.content[0].planningName)
        setPlanningName(res.content.planningName)
        res && res.content ? setDataModel(res.content.consultantCommunityUpdateModels) : setDataModel(null);
      },
      (err) => {
        // err && err.errorType && ShowNotification(viVN.Errors[err.errorType], NotificationMessageType.Error);
      }
    );
  };

  //--- Add Dialog
  const handleOpenAddForTaskDialog = () => {
    setOpenAddDialog(true);
    setTypeId(2);
  };
  const handleOpenAddForPlanningDialog = () => {
    setOpenAddDialog(true);
    setTypeId(1);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const onSuccessAdd = () => {
    GetConsultCommunityByPlanning(planningId);
    handleCloseAddDialog();
    ShowNotification(
      viVN.Success.CreateSuccess,
      NotificationMessageType.Success
    );
  };
  //--- Edit Dialog
  const handleOpenEditDialog = (id, typeId, isLock) => {
    if (id) {
      setTypeId(typeId)
      setConsultCommunityId(id);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setConsultCommunityId(null);
    setOpenEditDialog(false);
  };

  const onSuccessEdit = () => {
    GetConsultCommunityByPlanning(planningId);
    handleCloseEditDialog();
    ShowNotification(
      viVN.Success.UpdateSuccess,
      NotificationMessageType.Success
    );
  };

  //--- Delete Dialog
  const handleOpenDeleteDialog = (id, formTemplateId) => {
    if (id && formTemplateId) {
      setConsultCommunityId(id);
      setFormTemplateId(formTemplateId);
      setOpenDeleteDialog(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setConsultCommunityId(null);
    setFormTemplateId(null);
    setOpenDeleteDialog(false);
  };

  const pushToListConsult = (isQHHTKT, isQHCC) => {
    if (isQHHTKT) return UrlCollection.QH_HTKT_CONSULT;
    if (isQHCC) return UrlCollection.ConsultPlanningCC;
    return UrlCollection.ConsultTheCommunity;
  }

  const handleCloseConsultTheCommunity = () => {
    history.push({
      pathname: pushToListConsult(isQHHTKT, isQHCC),
      state: {
        currentPage: location.state?.currentPage,
        pageSizeDefault: location.state?.pageSizeDefault,
        title: location.state?.title,
        typeSelected: location.state?.typeSelected,
        levelSelected: location.state?.levelSelected,
        statusIdSelected: location.state?.statusIdSelected,
        planningUnitSelected: location.state?.planningUnitSelected,
        investorSelected: location.state?.investorSelected,
        approvalAgencySelected: location.state?.approvalAgencySelected,
        districtSelected: location.state?.districtSelected
      }
    });
  };

  const handleDelete = () => {
    consultCommunityId &&
      formTemplateId &&
      consultTheCommunityAction
        .DeleteConsultCommunity(consultCommunityId, formTemplateId || 0)
        .then(
          (res) => {
            GetConsultCommunityByPlanning(planningId);
            handleCloseDeleteDialog();
            ShowNotification(
              viVN.Success.DeleteSuccess,
              NotificationMessageType.Success
            );
          },
          (err) => {
            GetConsultCommunityByPlanning(planningId);
            handleCloseDeleteDialog();
            err &&
              err.errorType &&
              ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
              );
          }
        );
  };

  const refresh = () => {
    setData({
      planning: null,
      title: '',
      status: 0,
      hotNew: true,
      startTime: null,
      endTime: null,
    });
    setOrderBy('startTime');
    setOrder('desc');
    GetConsultCommunityByPlanning(planningId);
  };

  return (
    <>
      {/* {clientSetting && (
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Xin ý kiến cộng đồng {'(' + planningName + ')'}
          </Typography>
          <Button color='inherit' onClick={handleCloseConsultTheCommunity}>
            <CloseIcon />
          </Button>
        </Toolbar>
      )} */}

      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Xin ý kiến cộng đồng {'(' + planningName + ')'}
        </Typography>
        <Button color='inherit' onClick={handleCloseConsultTheCommunity}>
          <CloseIcon />
        </Button>
      </Toolbar>

      <div className='p-4'>
        <div className='consult-the-community'>
          <div className='d-sm-flex align-items-center justify-content-between mb-3' style={{display: 'flex'}}>
            <h1 className='h3 mb-0 text-gray-800' style={{flex: '1',marginRight:'10px'}}>
              <Tooltip title='Refresh'>
                <Fab
                  color='primary'
                  aria-label='filter'
                  size='small'
                  onClick={refresh}>
                  <RefreshIcon />
                </Fab>
              </Tooltip>
            </h1>
            {!isLock && (
              <div className='d-flex flex-column flex-lg-row'>
                {(dataModel != null && dataModel.filter((e) => e.typeId == 1).length == 0) && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleOpenAddForPlanningDialog}
                    className="mr-2 mb-2"
                    startIcon={<AddCircle />}>
                    Thêm ý kiến quy hoạch
                  </Button>
                )}
                {(dataModel != null && dataModel.filter((e) => e.typeId == 2).length == 0) && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleOpenAddForTaskDialog}
                    className="mr-2 mb-2"
                    startIcon={<AddCircle />}>
                    Thêm ý kiến nhiệm vụ
                  </Button>
                )}
              </div>
            )}
          </div>

          <ListConsultTheCommunity
            isLock={isLock}
            dataList={dataModel}
            totalItemCount={dataModel && dataModel.totalItemCount}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            onGetListData={GetConsultCommunityByPlanning}
            editAction={handleOpenEditDialog}
            deleteAction={handleOpenDeleteDialog}
            searchData={data}
            showConsult={showConsult}
            planningName={planningName}
          />

          {openAddDialog && (
            <AddConsultTheCommunity
              isOpen={openAddDialog}
              typeId={typeId}
              dataList={dataModel}
              onClose={handleCloseAddDialog}
              onSuccess={onSuccessAdd}
              planningId={planningId}
              planningName={planningName}
            />
          )}

          {openEditDialog && (
            <EditConsultTheCommunity
              isLock={isLock}
              isOpen={openEditDialog}
              typeId={typeId}
              consultCommunityId={consultCommunityId}
              onClose={handleCloseEditDialog}
              onSuccess={onSuccessEdit}
            />
          )}

          {openDeleteDialog && (
            <DeleteDialog
              isOpen={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              onSuccess={handleDelete}
              header={'Xóa ý kiến'}
              content={'Bạn có chắc chắn muốn xóa?'}
            />
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  settings: state.clientSetting.clientSetting,
});

export default connect(mapStateToProps)(ConsultTheCommunityPage);
