import React from "react";
import "./layers.scss";
import { Container, div } from "react-smooth-dnd";
import ControlFunctionOpenlayerType from "../../../../../../components/open-layer/control-function-type/control-function-type";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as InitMapStore from "../../../../../../redux/store/init-map/init-map.store";
import ConfirmModalView from "../../../../../../components/confirm-modal/confirm-modal";
import OpenlayerCommand from "../../../../../../components/open-layer/control-function-type/control-function-type";
import * as LayerCategoryAction from "../../../../../../redux/store/init-map/layer-category.store";
import * as LayerAction from "../../../../../../redux/store/init-map/map-layer.store";
//--- Material Control
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import { Tooltip, IconButton, makeStyles, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import NotificationService from "../../../../../../common/notification-service";
import * as planningAction from '../../../../../../redux/store/planning/planning.store';
import * as submapAction from '../../../../../../redux/store/analysis-submap/analysis-submap.store';
//--- Material Icon
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

class RenderLayerControlView extends React.Component {
  constructor(props) {
    super(props);
    console.log("props",props)
    this.state = {
      openConfirmModal: false,
      confirmModalTitle: "",
      confirmModalHandleAccept: null,
      dataSourcLayerSelected: "",
      listLayers: this.props.data,
      isOpenSettingGroupLayers: false,
      isCreateNewGroupLayers: false,
      isOpenSettingLayer: false,
      isCreateNewLayer: false,
      groupIndexSelected: null,
      layerIndexSelected: null,
      groupLayersName: "",
      groupLayersLv: null,
      idGroupLayerSelected: null,
      indexGroupSelected: null,
      hasShowWarningGroupLayerSetting: false,
      layerSettingViewType: 0, // view - 3, filter - 2, setting - 1, data source -0
      layerType: null,
      layerTypeId: null,
      layerCategoryDetail: null,
      layerCategoryName: null,
      LayerCategoryType: null,
      layerCategoryTypeSelected: null,
      projectList: null,
      planningSelected: null,
      planningSelectedId:null,
      layerList: null,
      layerSelected: null,
      layerSelectedId:null,
      display: 'none',
      isOpenAlert: false,
    };
  }
  //Api lấy ra thằng theo planning id
  getPlanningApprovedById = (planningId) => {
    return new Promise((resolve, reject) => {
      planningAction.PlanningApprovedById(planningId).then(
        (res) => {
          res &&
          res.content &&
          res.content.length > 0
          ? this.setState({ projectList: res.content })
          : this.setState({ projectList: [] });
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };
  onChangePlanning = (planningId)=>{
    this.getLookupLayerByPlanningId(planningId);
  }
  getLookupLayerByPlanningId = (planningId, index, list) => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookupLayerByPlanningId(planningId).then(
        (res) => {
          res &&
          res.content &&
          res.content.length > 0
          ? this.setState({ layerList: res.content })
          : this.setState({ layerList: [] });
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };
  GetLookupLayerCategoryType = () => {
    return new Promise((resolve, reject) => {
      LayerCategoryAction.GetLookupLayerCategoryType().then(
        (res) => {
          res &&
            res.content &&
            res.content.items &&
            res.content.items.length > 0
            ? this.setState({ layerType: res.content.items })
            : this.setState({ layerType: [] });
            
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };
  onSetDataSourceLayerSelected = (dataSource) =>
    this.setState({ dataSourcLayerSelected: dataSource });

  onClickAddNewGroup = (event) => {
    event.stopPropagation();
    this.setState({
      groupLayersName: "",
      planningSelected: null,
      layerSelected:null,
      isOpenSettingGroupLayers: true,
      isCreateNewGroupLayers: true,
    });
  };

  onClickCheckBoxLayer = (layerObject, indexLayer, indexGroup) => {
    const layerClicked = this.getLayerData.getLayerByIndexGroupAndIndexLayer(
      indexGroup,
      indexLayer
    );
    let layerChecked = layerClicked;
    if (!layerClicked.is_check) {
      layerClicked.is_check = true;
      layerChecked.isChecked = true;
    } else {
      layerChecked.isChecked = false;
      layerClicked.is_check = false;
    }

    this.autoUpdateLayerData();
    this.toggleDisplayLayerAction(layerObject);
  };

  toggleDisplayLayerAction = (layerObject) => {
    this.props.selectToggleLayerFunction(
      ControlFunctionOpenlayerType.ToggleDisplayLayer,
      {
        layer: layerObject,
      }
    );
  };

  autoUpdateLayerData = () => {
    this.props.UpdateLayers({ ...this.getLayerData.getLayerData() });   
  };

  handleDeleteLayer = (event, layerSelectedIndex, groupLayerSelectedIndex) => {
    event.preventDefault();
    let layerSelected = this.getLayerData.getLayerByIndexGroupAndIndexLayer(
      groupLayerSelectedIndex,
      layerSelectedIndex
    );
    layerSelected.is_checked = false;
    layerSelected.isChecked = false;
    let id = this.getLayerData.getLayerIdByIndex(
      groupLayerSelectedIndex,
      layerSelectedIndex
    );
    submapAction.DeleteAnalysisSubmap(id,this.props.analysisId).then((res) => {
      this.props.controlOpenlayer({
        type: OpenlayerCommand.ToggleDisplayLayer,
        option: {
          layer: this.getLayerData
            .getLayerGroupArrayLayerById()
            .splice(layerSelectedIndex, 1),
        },
      });
      this.toggleDisplayLayerAction(layerSelected);
      this.autoUpdateLayerData();
    }).catch(err => {
      err.errorMessage && NotificationService.error(err.errorMessage)
    });

  };

  getLayerData = {
    getMapSettingId: () => this.props.layerData.id,
    getLayerData: () => this.props.layerData,
    getListGroupLayers: () => this.props.layerData.layer_categories,
    getLayerIdByIndex: (categoryIndex, layerIndex) =>
      this.props.layerData.layer_categories[categoryIndex].layer_settings[
        layerIndex
      ].id,
    getLayerGroupByIndex: (index) =>
      this.props.layerData.layer_categories[index],
    getLayerGroupArrayLayerByIndex: (index) =>
      this.props.layerData.layer_categories[index].layer_settings,
    getLayerGroupArrayLayerById: () =>
      this.props.layerData.layer_categories.filter(x=>x.id ==0)[0].layer_settings,
    getLayerByIndexGroupAndIndexLayer: (indexGroup, indexLayer) =>
      this.props.layerData.layer_categories[indexGroup].layer_settings[
      indexLayer
      ],
  };

  openConfirmDeleteLayer = (event, indexLayer, indexGroup) => {
    this.setState({
      openConfirmModal: true,
      confirmModalTitle: "Xóa layer",
      confirmModalHandleAccept: () =>
        this.handleDeleteLayer(event, indexLayer, indexGroup),
    });
  };

  componentDidMount() {
    this.GetLookupLayerCategoryType();
    this.getPlanningApprovedById(this.props.planningId);
    this.getLookupLayerByPlanningId(this.props.planningId);
  }
  handleAddNewLayer = () => {
    let formData = new FormData();
    formData.append("AnalynisId", this.props.analysisId);
    formData.append("PlanningId", this.state.planningSelectedId);
    formData.append("LayerId", this.state.layerId);
    formData.append("Name", "");
    formData.append("TypeId", 0);
    submapAction.CreateAnalysisSubmap(formData).then((res) => {
      console.log('this.state.groupIndexSelected',this.state.groupIndexSelected)
      console.log('submapAction.CreateAnalysisSubmap(formData).then((res)',res)
      this.getLayerData
        .getLayerGroupArrayLayerById()
        .push(res.content);
      //this.toggleDisplayLayerAction(res.content);
      this.autoUpdateLayerData()
    }).catch((err) => { return err })
    this.setState({
      isOpenSettingGroupLayers: false,
      hasShowWarningGroupLayerSetting: false,
    });
  };
  render() {
    return (
      <div className="left-menu-layer-control-container mt-2">
        <Accordion>
          <AccordionSummary
            aria-controls="additional-actions1-content"
            id="additional-actions1233-header"
            className="position-relative base-map-header-summary"
          >
            <div
              className="row w-100 p-0 m-0"
              style={{ alignItems: "baseline" }}
            >
              <div className="col-8 p-0 m-0 font-layer-title">
                <AccountTreeIcon className="icon-layer mr-2 " />
                Layers
              </div>
                <div className="col-4 text-right p-0 m-0">
                  <Tooltip title="Thêm mới quy hoạch liên quan">
                    <IconButton
                      open={this.state.isOpenSettingGroupLayer}
                      onClick={(event) => { this.onClickAddNewGroup(event) }}
                    >
                      <AddCircleIcon fontSize="small" className="text-success" />
                    </IconButton>
                  </Tooltip>
                </div>
            </div>
          </AccordionSummary>
          <AccordionDetails className="d-block">
            <Divider />

            {this.props.layerData.haveData &&
              this.props.layerData.layer_categories.length === 0 && (
                <p className="text-center mt-3 mb-0">
                  Chưa có quy hoạch liên quan nào được thêm
                </p>
              )}

            <Container
              //getChildPayload={this.getChildPayloadGrouplayer}
              dragClass="drag-state-custom-ddb"
            >
              {this.props.layerData.haveData &&
                this.props.layerData.layer_categories.map(
                  (GroupLayers, indexGroup) => 
                  {
                    if(GroupLayers.id ==0)
                    {
                      return (                                 
                        <div key={indexGroup}>
                                {GroupLayers.layer_settings &&
                                  GroupLayers.layer_settings.map(
                                    (layer, indexLayer) => (
                                      <div key={indexLayer}>
                                        <div 
                                          style={{padding:"0 0 0 0px ! important"}}
                                          className="row alignItems-baseline no-gutters">
                                          <div className="col-1">
                                            <input
                                              type="checkbox"
                                              id={`checkbox-layer-index-${indexLayer}`}
                                              checked={layer.is_check}
                                              onChange={() => { }}
                                              onClick={() =>
                                                this.onClickCheckBoxLayer(
                                                  layer,
                                                  indexLayer,
                                                  indexGroup
                                                )
                                              }
                                              className="mr-2"
                                            />
                                          </div>
                                          <div className="col-10">
                                            <Tooltip title={layer.name}>
                                              <label
                                                //htmlFor={`checkbox-layer-index-${indexLayer}`}
                                                className="d-block cursor-move"
                                              >
                                                {layer.name}
                                              </label>
                                            </Tooltip>
                                          </div>
                                            <div className="col-1 text-right">
                                              <Tooltip title="Xóa layer">
                                                <IconButton
                                                  onClick={(event) =>
                                                    this.openConfirmDeleteLayer(
                                                      event,
                                                      indexLayer,
                                                      indexGroup
                                                    )
                                                  }
                                                >
                                                  <DeleteIcon
                                                    fontSize="small"
                                                    className="text-danger"
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                        </div>
                      )
                    }
                  }
                )
              }
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* setting group layer */}

        <Dialog
          maxWidth="sm"
          fullWidth={true}
          onClose={() =>
            this.setState({
              isOpenSettingGroupLayers: false,
              display: "none",
              newValueCategory: null,
            })
          }
          aria-labelledby="base-map-add-alert-dialog-title"
          aria-describedby="alert-dialog-description"
          id="dialog-create-base-map"
          open={this.state.isOpenSettingGroupLayers}
        >
          <DialogTitle
            id="base-map-add-alert-dialog-title"
            onClose={() => this.setState({ isOpenSettingGroupLayers: false })}
          >
            Thêm quy hoạch liên quan
          </DialogTitle>
          <DialogContent className="content-custom-container" dividers>
            <Autocomplete
              id={`combo-box-planning`}
              options={this.state.projectList}
              value={
                   this.state.planningSelected
              }
              getOptionLabel={(option) => option.name}
              disableClearable={true}
              onChange={(event, newValue) => {
                this.onChangePlanning(newValue.id);
                this.setState({
                  newValueCategory: newValue,
                  layerSelected: null,
                  planningSelectedId: newValue.id,
                  planningSelected: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn quy hoạch"
                  size="small"
                  variant="outlined"
                />
              )}
            />
            <p
              className="validate-category"
              style={{ display: `${this.state.display}` }}
            >
              không được bỏ trống
            </p> 
            <Autocomplete
              style={{marginTop:"25px"}}
              id={`combo-box-layer`}
              options={this.state.layerList}
              value={
                     this.state.layerSelected
              }
              getOptionLabel={(option) => option.name}
              disableClearable={true}
              onChange={(event, newValue) => {
                this.setState({
                  display: "none",
                  layerId: newValue.id,
                  layerSelected: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn lớp quy hoạch"
                  size="small"
                  variant="outlined"
                />
              )}
            />
            <p
              className="validate-category"
              style={{ display: `${this.state.display}` }}
            >
              không được bỏ trống
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() =>
                this.setState({
                  isOpenSettingGroupLayers: false,
                  display: "none",
                  newValueCategory: null,
                })
              }
              color="error"
            >
              Đóng
            </Button>


            <Button
              variant="contained"
              onClick={() => {
                this.handleAddNewLayer()
              }}
              color="primary"
            >
              Chấp nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm modal */}
        <ConfirmModalView
          open={this.state.openConfirmModal}
          handleClose={() => this.setState({ openConfirmModal: false })}
          title={this.state.confirmModalTitle}
          handleAccept={this.state.confirmModalHandleAccept}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  layerData: state.initMap.layers,
  controlOpenlayer: state.openLayer.handleOutSideFunction,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateLayers: InitMapStore.UpdateLayer,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderLayerControlView);
