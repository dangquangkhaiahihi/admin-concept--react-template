/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//--- Material Control
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { useForm } from 'react-hook-form';
import ShowNotification from '../../../components/react-notifications/react-notifications';
import { NotificationMessageType } from '../../../utils/configuration';
import * as viVN from '../../../language/vi-VN.json';
import * as planningAction from '../../../redux/store/planning/planning.store';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddIcon from '@material-ui/icons/Add';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import {
  DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Dialog,
  Button,
  DialogContent,
} from '@material-ui/core';
import * as appActions from '../../../core/app.store';
import './planning-related.scss';
import { UrlCollection } from '../../../common/url-collection';

import { useMediaQuery } from "react-responsive";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  inputs: {
    height: '0.3em',
  },
}));

function PlanningRelatedPage(props) {
  const { showLoading, isQHHTKT, isQHCC } = props;

  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const planningId = id;
  const { name } = history.location.state || "";
  const planningName = name;
  const isLock = useLocation().state.isLock;
  const [projectList, setProjectList] = useState([]);

  const [planningRelationshipTypeModel, setPlanningRelationshipTypeModel] =
    useState([]);

  const [planningAPlanningApprovedModel, setPlanningAPlanningApprovedModel] =
    useState([]);

  const [planningBoundariesModel, setPlanningBoundariesModel] = useState([]);
  const [layers, setLayers] = useState([]);
  const { register, handleSubmit, errors } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  const pushToListPlanningRelated = (isQHHTKT, isQHCC) => {
    if (isQHHTKT) return UrlCollection.QH_HTKT_Relate;
    if (isQHCC) return UrlCollection.PlanningCCRelate;
    return UrlCollection.PlanningRelate;
  }

  const onCloseDialog = () => {
    history.push({
      pathname: pushToListPlanningRelated(isQHHTKT, isQHCC),
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

  const handleClickOpenPlanningRelated = () => {
    history.push({
      pathname: UrlCollection.PlanningRelate
    });
  };

  const classes = useStyles();

  useEffect(() => {
    onGetData();
  }, [planningId]);

  const onGetData = () => {
    showLoading(true);
    Promise.all([
      getPlanningRelationshipTypeById(planningId),
      getAllPlanningRelationshipType(),
      getPlanningApprovedById(planningId),
      getAllPlanningBoundaries(),
    ])
      .then((res) => {
        const [
          planningRelationshipTypeByIdModels,
          planningRelationshipType,
          planningAPlanningApprovedModel,
          planningBoundariesModel,
        ] = res;
        planningRelationshipTypeByIdModels &&
          planningRelationshipTypeByIdModels.content &&
          planningRelationshipTypeByIdModels.content.length > 0 &&
          setProjectList(planningRelationshipTypeByIdModels.content);
        planningRelationshipType &&
          planningRelationshipType.content &&
          setPlanningRelationshipTypeModel(planningRelationshipType.content);
        planningAPlanningApprovedModel &&
          planningAPlanningApprovedModel.content &&
          setPlanningAPlanningApprovedModel(
            planningAPlanningApprovedModel.content
          );
        planningBoundariesModel &&
          planningBoundariesModel.content &&
          planningBoundariesModel.content.length > 0 &&
          setPlanningBoundariesModel(planningBoundariesModel.content);

        if (
          planningRelationshipTypeByIdModels &&
          planningRelationshipTypeByIdModels.content
        ) {
          for (
            var i = 0;
            i < planningRelationshipTypeByIdModels.content.length;
            i++
          ) {
            setLayers([
              ...layers,
              planningRelationshipTypeByIdModels.content[i].layers,
            ]);
          }
        }
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  //Api nhóm
  const getAllPlanningRelationshipType = () => {
    return new Promise((resolve, reject) => {
      planningAction.PlanningRelationshipType().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  // API Get all boundaries
  const getAllPlanningBoundaries = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetAllBoundaries().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  //Api lấy ra thằng theo planning id
  const getPlanningRelationshipTypeById = (planningId) => {
    return new Promise((resolve, reject) => {
      planningAction.PlanningRelationshipTypeById(planningId).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  //Api lấy ra thằng theo planning id
  const getPlanningApprovedById = (planningId) => {
    return new Promise((resolve, reject) => {
      planningAction.PlanningApprovedById(planningId).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const getLookupLayerByPlanningId = (planningId, index, list) => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookupLayerByPlanningId(planningId).then(
        (res) => {
          list[index]['layers'] = res.content;
          setProjectList(list);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const checkUniqueProjectList = (projectList) => {
    let objectArr = [...projectList];
    let arr = [];
    objectArr.filter((item) => {
      arr.push({
        planningRelationid: item.planningRealationShipId,
        layerId: item.layerId,
      });
    });
    let arr2 = [];
    let findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) != index);
    arr2 = [...new Set(findDuplicates(arr))];
    return arr2;
  };

  const handleOnchange = (event, newValue, index) => {
    if (newValue) {
      const list = [...projectList];
      list[index]['planningRealationShipId'] = newValue.id;
      list[index]['planningName'] = newValue.name;
      getLookupLayerByPlanningId(newValue.id, index, list);
      //setProjectList(list);
    }
  };

  const handleOnchangeGroup = (event, newValue, index) => {
    if (newValue) {
      const list = [...projectList];
      list[index]['planningRelationShipTypeId'] = newValue.id;
      list[index]['planningTypeName'] = newValue.name;
      setProjectList(list);
    }
  };

  const handleOnchangeLayer = (event, newValue, index) => {
    if (newValue) {
      const list = [...projectList];
      list[index]['layerId'] = newValue.id;
      list[index]['layerName'] = newValue.name;
      setProjectList(list);
    }
  };

  const handleOnchangeRelationName = (event, newValue, index) => {
    if (newValue) {
      const list = [...projectList];
      list[index]['relationName'] = newValue;
      setProjectList(list);
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...projectList];
    list.splice(index, 1);
    setProjectList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setProjectList([
      ...projectList,
      {
        id: 0,
        planningRelationShipTypeId: 0,
        planningId: planningId,
        planningRealationShipId: 0,
        planningTypeName: '',
        planningName: '',
        layerId: 0,
        layerName: '',
      },
    ]);
  };

  const onSubmit = (data) => {
    if (!data) return;
    if (checkUniqueProjectList(projectList).length > 0) {
      ShowNotification(
        viVN.Errors.ExitPlanningRelationship,
        NotificationMessageType.Error
      );
    } else {
      showLoading(true);
      planningAction
        .PutPlanningReletionship(projectList, planningId)
        .then((result) => {
          if (result && result.content === true) {
            showLoading(false);

            ShowNotification(
              viVN.Success.PutPlanningReletionship,
              NotificationMessageType.Success
            );
            history.push({
              pathname: pushToListPlanningRelated(isQHHTKT, isQHCC),
            });
          } else {
            showLoading(false);
            ShowNotification(
              viVN.Errors.PutPlanningReletionship,
              NotificationMessageType.Error
            );
          }
        })
        .catch((err) => {
          showLoading(false);
          ShowNotification(
            viVN.Errors.UserAlreadyExits,
            NotificationMessageType.Error
          );
          history.push({
            pathname: pushToListPlanningRelated(isQHHTKT, isQHCC),
          });
        });
    }
  };

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    <div>
      <DialogTitle>
        <Typography variant='h6'>{planningName}</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        {projectList && projectList.length > 0 ? (
          <div>
            {projectList.map((item, index) => {
              return (
                <div className='row mb-2' key={index}>
                  <div className='mb-3 col-lg-3' id={'index' + index}>
                    {planningAPlanningApprovedModel &&
                      planningAPlanningApprovedModel.length > 0 && (
                        <Autocomplete
                          id={`combo-box-demo-${item.id}`}
                          options={planningAPlanningApprovedModel}
                          getOptionLabel={(option) => option.name}
                          fullWidth
                          onChange={(event, newValue) =>
                            handleOnchange(event, newValue, index)
                          }
                          value={
                            item.planningRealationShipId
                              ? {
                                id: item.planningRealationShipId,
                                name: item.planningName,
                              }
                              : null
                          }
                          disableClearable={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Đồ án quy hoạch liên quan'
                              name={`planningRelatedId${index}`}
                              inputRef={register({ required: true })}
                              size='small'
                              variant='outlined'
                              error={
                                errors[`planningRelatedId${index}`] &&
                                errors[`planningRelatedId${index}`].type ===
                                'required'
                              }
                            />
                          )}
                        />
                      )}
                  </div>
                  <div className='mb-3 col-lg-2'>
                    {planningRelationshipTypeModel &&
                      planningRelationshipTypeModel.length > 0 && (
                        <Autocomplete
                          id={`combo-box-group-${item.id}`}
                          options={planningRelationshipTypeModel}
                          label='Nhóm'
                          getOptionLabel={(option) => option.name}
                          fullWidth
                          onChange={(event, newValue) =>
                            handleOnchangeGroup(event, newValue, index)
                          }
                          value={
                            item.planningRelationShipTypeId
                              ? {
                                id: item.planningRelationShipTypeId,
                                name: item.planningTypeName,
                              }
                              : null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Nhóm'
                              name={`planningReletionshipType${index}`}
                              size='small'
                              variant='outlined'
                              inputRef={register({ required: true })}
                              error={
                                errors[`planningReletionshipType${index}`] &&
                                errors[`planningReletionshipType${index}`]
                                  .type === 'required'
                              }
                            />
                          )}
                        />
                      )}
                  </div>
                  <div className='mb-3 col-lg-3'>
                    {item.layers && item.layers.length > 0 ? (
                      <Autocomplete
                        id={`combo-box-layer-${item.id}`}
                        options={item.layers}
                        label='Lớp'
                        getOptionLabel={(option) => option.name}
                        fullWidth
                        onChange={(event, newValue) =>
                          handleOnchangeLayer(event, newValue, index)
                        }
                        value={
                          {
                            id: item.layerId,
                            name: item.layerName,
                          }
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Lớp'
                            name={`layer${index}`}
                            size='small'
                            variant='outlined'
                            inputRef={register({ required: true })}
                            error={
                              errors[`layer${index}`] &&
                              errors[`layer${index}`].type === 'required'
                            }
                          />
                        )}
                      />) : (item.layers && (
                      <Autocomplete
                        id={`combo-box-layer`}
                        options={item.layers}
                        label='Lớp'
                        getOptionLabel={(option) => option.name}
                        fullWidth
                        onChange={(event, newValue) =>
                          handleOnchangeLayer(event, newValue, index)
                        }
                        noOptionsText={'Không có lớp nào'}
                        value={
                          item.layerId
                            ? {
                              id: item.layerId,
                              name: item.layerName,
                            }
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Lớp'
                            name={`layer${index}`}
                            size='small'
                            variant='outlined'
                            inputRef={register({ required: true })}
                            error={
                              errors[`layer${index}`] &&
                              errors[`layer${index}`].type === 'required'
                            }
                          />
                        )}
                      />
                      ))
                    }
                  </div>
                  <div className='mb-3 col-lg-3'>
                    <TextField
                      label='Tên'
                      name={`relationName${index}`}
                      error={
                        errors[`relationName${index}`] &&
                        errors[`relationName${index}`].type === 'required'
                      }
                      defaultValue={
                        item.relationName ? item.relationName : null
                      }
                      fullWidth
                      type='text'
                      className='form-control'
                      inputProps={{
                        maxLength: 150,
                        className: classes.inputs,
                      }}
                      inputRef={register({
                        required: true,
                        maxLength: 150,
                      })}
                      variant='outlined'
                      onChange={(e) =>
                        handleOnchangeRelationName(e, e.target.value, index)
                      }
                    />
                  </div>
                  <div className='mb-3 col-lg-1'>
                    {!isLock && (
                      <IconButton
                        color='secondary'
                        onClick={() => {
                          handleRemoveClick(index);
                        }}>
                        <IndeterminateCheckBoxIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              );
            })}

            {!isLock && (
              <div className='row align-items-center'>
                <div className='mb-3 col-lg-11'>
                  <a className='button-add-click' onClick={handleAddClick}>
                    <AddIcon className='mt-n1' />
                    {'Thêm quy hoạch'}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className='text-danger text-center'>
              <HighlightOffIcon className='mt-n1 mr-1' />
              {'Không có bản ghi nào'}
            </div>
          </div>
        )}

        <DialogActions className='mobile-buttons-wrapper'>
          {!isLock && (
            <Button
              onClick={handleAddClick}
              variant='contained'
              startIcon={<AddBoxIcon />}
              className='bg-success text-white mobile-button'
              hidden={projectList && projectList.length > 0}>
              Thêm quy hoạch
            </Button>
          )}
          <Button
            className='mobile-button'
            onClick={onCloseDialog}
            variant='contained'
            startIcon={<CloseIcon />}>
            Hủy
          </Button>
          {!isLock && (
            <Button
              className='mobile-button'
              type='submit'
              color='primary'
              variant='contained'
              startIcon={<SaveIcon />}>
              Lưu
            </Button>
          )}

        </DialogActions>
      </form>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanningRelatedPage);
