import React from "react";
import "./layers.scss";
import { Container, Draggable } from "react-smooth-dnd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as InitMapStore from "../../../../../../redux/store/init-map/init-map.store";
// import * as LayerCategoryAction from "../../../../redux/store/init-map/layer-category.store";
//import * as LayerAction from "../../../../redux/store/init-map/map-layer.store";
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

//--- Material Icon
import AddCircleIcon from "@material-ui/icons/AddCircle";
import LayersIcon from "@material-ui/icons/Layers";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import EditIcon from "@material-ui/icons/Edit";
import TuneIcon from "@material-ui/icons/Tune";
import DeleteIcon from "@material-ui/icons/Delete";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import CloseIcon from "@material-ui/icons/Close";

class RenderLayerControlView extends React.Component {
  constructor(props) {
    super(props);
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
      newValueCategory: null,
      display: 'none',
      isOpenAlert: false,
    };
  }



  autoUpdateLayerData = () => {
    this.props.UpdateLayers({ ...this.getLayerData.getLayerData() });
  };

  onSetDataSourceLayerSelected = (dataSource) =>
    this.setState({ dataSourcLayerSelected: dataSource });

  getChildPayloadGrouplayer = (index) => {
    return this.getLayerData.getLayerGroupByIndex(index);
  };

  getChildPayloadLayer = (indexLayer, indexGroupLayer) => {
    return this.getLayerData.getLayerByIndexGroupAndIndexLayer(
      indexGroupLayer,
      indexLayer
    );
  };








  handleChangeSettingLayerType = (event, newValue) => {
    this.setState({
      layerSettingViewType: newValue,
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
    //!this.props.isLock && LayerAction.UpdateLayer(layerChecked)
    this.autoUpdateLayerData();
    this.toggleDisplayLayerAction(layerObject);
  };

  toggleDisplayLayerAction = (layerObject) => {
    this.props.selectToggleLayerFunction(
      "toggle-display-layout",
      {
        layer: layerObject,
      }
    );
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
    getLayerByIndexGroupAndIndexLayer: (indexGroup, indexLayer) =>
      this.props.layerData.layer_categories[indexGroup].layer_settings[
      indexLayer
      ],
  };


  closeDialogAlert = () => {
    this.setState({ isOpenAlert: false });
  };
  render() {
    return (
      <div className="left-menu-layer-control-container mt-2">
        <Accordion>
          <AccordionSummary
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
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

            </div>
          </AccordionSummary>
          <AccordionDetails className="d-block">
            <Divider />

            {this.props.layerData.haveData &&
              this.props.layerData.layer_categories.length === 0 && (
                <p className="text-center mt-3 mb-0">
                  Chưa có nhóm layer nào được tạo
                </p>
              )}

            <Container
              getChildPayload={this.getChildPayloadGrouplayer}
              onDrop={this.onDropGroupLayer}
              dragClass="drag-state-custom-ddb"
            >
              {this.props.layerData.haveData &&
                this.props.layerData.layer_categories.map(
                  (GroupLayers, indexGroup) => 
                  {
                    if(GroupLayers.id != 0)
                    {
                      return                   (
                        <div key={indexGroup}>
                          <Accordion>
                            <AccordionSummary className="p-0">
                              <div className="container-fluid p-0 m-0" > 
                                <div className="row p-0 m-0 alignItems-baseline ">
                                  <div
                                    className="col-8 text-truncate position-relative font-layer-category"
                                    title={GroupLayers.folder_label}
                                  >
                                    <LayersIcon
                                      className="position-absolute icon-layers-custom"
                                      color="primary"
                                    />
                                    <Tooltip title={GroupLayers.folder_label}>
                                      <span>{GroupLayers.folder_label}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails style={{ padding: "0 0 0 24px" }}>
                              <Container
                                getChildPayload={(event) =>
                                  this.getChildPayloadLayer(event, indexGroup)
                                }
                                onDrop={(event) =>
                                  this.onDropLayer(event, indexGroup)
                                }
                                dragClass="drag-state-custom-ddb"
                                groupName="Grouplayers"
                              >
                                {GroupLayers.layer_settings &&
                                  GroupLayers.layer_settings.map(
                                    (layer, indexLayer) => (
                                      <Draggable key={indexLayer}>
                                        <div className="row alignItems-baseline no-gutters pt-2 pb-2">
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
                                          <div className="col-7" >
                                            <Tooltip title={layer.name}>
                                              <label
                                                //htmlFor={`checkbox-layer-index-${indexLayer}`}
                                                className="d-block text-truncate cursor-move"
                                              >
                                                {layer.name}
                                              </label>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </Draggable>
                                    )
                                  )}
                                {GroupLayers.layer_settings &&
                                  GroupLayers.layer_settings.length === 0 && (
                                    <span>Chưa có layer nào</span>
                                  )}
                              </Container>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      )
                    }
                  }
                  

                )}
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
            {this.state.isCreateNewGroupLayers ? "Thêm Nhóm mới" : "Thiết lập"}
          </DialogTitle>
          <DialogContent className="content-custom-container" dividers>
            <InputLabel className="text-dark">Tên nhóm</InputLabel>
            <TextField
              className="group-name"
              helperText={
                this.state.hasShowWarningGroupLayerSetting &&
                  !this.state.groupLayersName.trim()
                  ? "Không được để trống"
                  : ""
              }
              error={
                this.state.hasShowWarningGroupLayerSetting &&
                !this.state.groupLayersName.trim()
              }
              value={this.state.groupLayersName}
              onChange={(event) => {
                this.setState({ groupLayersName: event.target.value });
              }}
              fullWidth
              variant="outlined"
              size="small"
            />

            <Autocomplete
              id={`combo-box-layer`}
              options={this.state.layerType}
              value={
                this.state.isCreateNewGroupLayers
                  ? null
                  : this.state.layerCategoryTypeSelected
              }
              getOptionLabel={(option) => option.name}
              disableClearable={true}
              onChange={(event, newValue) => {
                this.setState({
                  display: "none",
                  newValueCategory: newValue,
                  layerTypeId: newValue.id,
                  layerCategoryTypeSelected: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Loại danh mục lớp"
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

            {!this.state.isCreateNewGroupLayers && (
              <Button
                variant="contained"
                onClick={() => this.openConfirmDeleteGroupLayer()}
                color="secondary"
              >
                <DeleteIcon className="mr-1" />
                Xóa nhóm
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => {
                if (this.state.isCreateNewGroupLayers) {
                  if (this.state.newValueCategory === null) {
                    this.setState({ display: "block" });
                    return;
                  } else this.handleClickAcceptSettingGrouplayer()
                  this.setState({ display: 'none', newValueCategory: null })
                } else this.handleClickAcceptSettingGrouplayer()
                this.setState({ layerCategoryTypeSelected: null })
                // this.handleClickAcceptSettingGrouplayer()
              }}
              color="primary"
            >
              Chấp nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm modal */}

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
