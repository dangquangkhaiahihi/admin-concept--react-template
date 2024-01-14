import React from "react";
import "./layers.scss";
import { Container, Draggable } from "react-smooth-dnd";
import ControlFunctionOpenlayerType from "../../../../components/open-layer/control-function-type/control-function-type";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as InitMapStore from "../../../../redux/store/init-map/init-map.store";
import ModalLayerSetting from "./modal-setting/modal-setting";
import ModalEditSettingLayer from "./modal-edit-layer/modal-edit-layer";
import ConfirmModalView from "../../../../components/confirm-modal/confirm-modal";
import OpenlayerCommand from "../../../../components/open-layer/control-function-type/control-function-type";
import * as LayerCategoryAction from "../../../../redux/store/init-map/layer-category.store";
import * as LayerAction from "../../../../redux/store/init-map/map-layer.store";
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
import NotificationService from "../../../../common/notification-service";

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

  GetDetailLayerCategory = (id) => {
    return new Promise((resolve, reject) => {
      LayerCategoryAction.GetDetailLayerCategory(id).then(
        (res) => {
          res && res.content
            ? this.setState({
              layerCategoryDetail: res.content,
              layerCategoryTypeSelected: this.state.layerType.find(
                (item) => item.id === res.content.layerCategoryTypeId
              ),
            })
            : this.setState({ layerCategoryDetail: [] });
          console.log(this.state.layerCategoryTypeSelected);
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

  getChildPayloadGrouplayer = (index) => {
    return this.getLayerData.getLayerGroupByIndex(index);
  };

  getChildPayloadLayer = (indexLayer, indexGroupLayer) => {
    return this.getLayerData.getLayerByIndexGroupAndIndexLayer(
      indexGroupLayer,
      indexLayer
    );
  };

  onDropGroupLayer = (event) => {
    const ListGroupLayers = this.getLayerData.getListGroupLayers();
    ListGroupLayers.splice(event.removedIndex, 1);
    ListGroupLayers.splice(event.addedIndex, 0, event.payload);
    this.autoUpdateLayerData();
    console.log("trc", ListGroupLayers);
    let data = {};
    let lstLevelLayer = [];
    ListGroupLayers.map((item, index) =>
      lstLevelLayer.push({
        id: item.id,
        level: index,
      })
    );
    data.lstLevelLayerCategory = lstLevelLayer;
    console.log('sau', data);
    !this.props.isLock && this.updateGroupLayer(data);
  };

  updateGroupLayer = (data) => {
    LayerCategoryAction.UpdateLayerCategoryLevel(data);
  };

  onDropLayer = (event, indexGrouplayer) => {
    //console.log(indexGrouplayer)
    //console.log(event)
    const layerGroup = this.getLayerData.getLayerGroupByIndex(indexGrouplayer)

    const ListGroupLayer = this.getLayerData.getLayerGroupArrayLayerByIndex(
      indexGrouplayer
    );

    if (event.removedIndex != null)
      ListGroupLayer.splice(event.removedIndex, 1);
    if (event.addedIndex != null)
      ListGroupLayer.splice(event.addedIndex, 0, event.payload);

    if (event.removedIndex != null || event.addedIndex != null) {
      this.autoUpdateLayerData();
    }

    //console.log(layerGroup)

    layerGroup.layer_settings.map((item) => {
      if (item.layerCategoryId !== layerGroup.id) {
        console.log(layerGroup.id);
        item.layerCategoryId = layerGroup.id;
        this.autoUpdateLayerData()
        //console.log(item)
        !this.props.isLock && LayerAction.UpdateLayer(item);
      }
    })
    let data = {};
    let lstLevelLayer = [];
    ListGroupLayer.map((item, index) =>
      lstLevelLayer.push({
        id: item.id,
        level: index,
      })
    );
    data.lstLevelLayer = lstLevelLayer;
    //console.log('sau', data)
    if (lstLevelLayer.length > 0) { !this.props.isLock && this.updateLayerLevel(data) }
  };

  updateLayerLevel = (data) => {
    LayerAction.UpdateLayerLevel(data);
  };

  onClickAddNewGroup = (event) => {
    event.stopPropagation();
    this.setState({
      groupLayersName: "",
      isOpenSettingGroupLayers: true,
      isCreateNewGroupLayers: true,
    });
  };

  onClickSettingGroupLayer = (event, indexGroup, noType) => {
    event.stopPropagation();
    this.setState({
      isOpenSettingGroupLayers: noType ? false : true,
      isCreateNewGroupLayers: false,
      indexGroupSelected: indexGroup,
      groupLayersName:
        this.getLayerData.getLayerGroupByIndex(indexGroup)["folder_label"],
      idGroupLayerSelected:
        this.getLayerData.getLayerGroupByIndex(indexGroup)["id"],
      groupLayersLv:
        this.getLayerData.getLayerGroupByIndex(indexGroup)["level"],
    });
  };

  onClickDeleteGrouplayer = () => {

    LayerCategoryAction.DeleteLayerCategory(this.state.idGroupLayerSelected).then((res) => {
      this.getLayerData
        .getListGroupLayers()
        .splice(this.state.indexGroupSelected, 1);
      this.setState({
        isOpenSettingGroupLayers: false,
      });
    }).catch(err => {
      err.errorMessage && NotificationService.error(err.errorMessage)
      this.setState({
        isOpenSettingGroupLayers: false,
      });
    });
  };

  onClickOpenAddNewLayer = (event, groupLayerIndex) => {
    event.stopPropagation();
    this.setState({
      isOpenSettingLayer: true,
      isCreateNewLayer: true,
      groupIndexSelected: groupLayerIndex,
      idGroupLayerSelected:
        this.getLayerData.getLayerGroupByIndex(groupLayerIndex)["id"],
    });
  };

  onClickEditLayer = (event, groupLayerIndex, layerIndex) => {
    event.stopPropagation();
    this.setState({
      isOpenSettingLayer: true,
      isCreateNewLayer: false,
      groupIndexSelected: groupLayerIndex,
      layerIndexSelected: layerIndex,
    });
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
    console.log(layerChecked);


    !this.props.isLock && LayerAction.UpdateLayer(layerChecked)
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

  handleAddNewLayer = (newLayer) => {
    if (newLayer.is_check) this.toggleDisplayLayerAction(newLayer);

    //newLayer.layerCategoryId = this.state.idGroupLayerSelected;
    console.log(newLayer);
    LayerAction.CreateLayer(newLayer).then((res) => {
      newLayer.id = res.content.id
      this.getLayerData
        .getLayerGroupArrayLayerByIndex(this.state.groupIndexSelected)
        .push(newLayer);
      this.autoUpdateLayerData()
      !this.props.isLock && LayerAction.autoCuPlanning(newLayer.layerCategoryId, this.props.planningId);
    }).catch((err) => { return err })
  };

  handleClickAcceptSettingGrouplayer = () => {
    if (!this.state.groupLayersName.trim()) {
      if (!this.state.hasShowWarningGroupLayerSetting)
        this.setState({ hasShowWarningGroupLayerSetting: true });
      return;
    }
    let formData = new FormData();
    formData.append("MapSettingId", this.getLayerData.getMapSettingId());
    if (this.state.isCreateNewGroupLayers) {
      formData.append("Level", 50);
      formData.append("FolderLabel", this.state.groupLayersName);
      formData.append("FolderName", this.state.groupLayersName);
      formData.append("LayerCategoryTypeId", this.state.layerTypeId);
      LayerCategoryAction.CreateLayerCategory(formData).then((res) => {
        if (res.content) {
          this.setState({ idGroupCreateNew: res.content.id });
          this.getLayerData.getListGroupLayers().push({
            folder_label: this.state.groupLayersName,
            folder_name: this.state.groupLayersName,
            id: res.content.id,
            layer_settings: [],
            level: 0,
            map_setting_id: this.getLayerData.getMapSettingId(),
          });
          this.autoUpdateLayerData();
        }
      });
      //this.autoUpdateLayerData();
      //console.log(this.state.idGroupCreateNew);
      //console.log(this.getLayerData.getListGroupLayers());
    } else {
      this.getLayerData.getLayerGroupByIndex(this.state.indexGroupSelected)[
        "folder_label"
      ] = this.state.groupLayersName;
      this.getLayerData.getLayerGroupByIndex(this.state.indexGroupSelected)[
        "folder_name"
      ] = this.state.groupLayersName;
      formData.append('FolderLabel', this.state.groupLayersName);
      formData.append('FolderName', this.state.groupLayersName);
      formData.append('LayerCategoryTypeId', this.state.layerCategoryTypeSelected.id)
      formData.append('Id', this.state.idGroupLayerSelected)
      formData.append('Level', this.state.groupLayersLv);
      !this.props.isLock && LayerCategoryAction.UpdateLayerCategory(formData).then((res) => {
        NotificationService.success("Cập nhật thành công");
      });
    }
    this.autoUpdateLayerData();
    this.setState({
      isOpenSettingGroupLayers: false,
      hasShowWarningGroupLayerSetting: false,
    });
  };

  autoUpdateLayerData = () => {
    this.props.UpdateLayers({ ...this.getLayerData.getLayerData() });
  };

  handleDeleteLayer = (event, layerSelectedIndex, groupLayerSelectedIndex) => {
    event.preventDefault();
    console.log(
      this.getLayerData.getLayerByIndexGroupAndIndexLayer(
        groupLayerSelectedIndex,
        layerSelectedIndex
      )
    );
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
    LayerAction.DeleteLayer(id).then((res) => {
      console.log(this.getLayerData.getListGroupLayers());
      this.props.controlOpenlayer({
        type: OpenlayerCommand.ToggleDisplayLayer,
        option: {
          layer: this.getLayerData
            .getLayerGroupArrayLayerByIndex(groupLayerSelectedIndex)
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
    getLayerByIndexGroupAndIndexLayer: (indexGroup, indexLayer) =>
      this.props.layerData.layer_categories[indexGroup].layer_settings[
      indexLayer
      ],
  };

  handleSaveEditLayer = (dataLayerEdited) => {
    if (
      dataLayerEdited.is_check !=
      this.getLayerData.getLayerGroupArrayLayerByIndex(
        this.state.groupIndexSelected
      )[this.state.layerIndexSelected].is_check
    )
      this.toggleDisplayLayerAction(dataLayerEdited);
    this.getLayerData.getLayerGroupArrayLayerByIndex(
      this.state.groupIndexSelected
    )[this.state.layerIndexSelected] = dataLayerEdited;
    this.autoUpdateLayerData();
    console.log(dataLayerEdited)
    !this.props.isLock && LayerAction.UpdateLayer(dataLayerEdited).then((res) => {
      NotificationService.success("Cập nhật thành công");
      LayerAction.autoCuPlanning(dataLayerEdited.layerCategoryId, this.props.planningId)
    }).catch((err) => {err.errorMessage &&  NotificationService.error(err.errorMessage)})
  };

  openConfirmDeleteGroupLayer = () => {
    this.setState({
      openConfirmModal: true,
      confirmModalTitle: "Xóa nhóm layer",
      confirmModalHandleAccept: () => this.onClickDeleteGrouplayer(),
    });
    console.log(this.state.idGroupLayerSelected);
  };

  openConfirmDeleteLayer = (event, indexLayer, indexGroup) => {
    this.setState({
      openConfirmModal: true,
      confirmModalTitle: "Xóa layer",
      confirmModalHandleAccept: () =>
        this.handleDeleteLayer(event, indexLayer, indexGroup),
    });
  };

  closeDialogAlert = () => {
    this.setState({ isOpenAlert: false });
  };

  componentDidMount() {
    this.GetLookupLayerCategoryType();
  }
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
              {!this.props.isLock && (
                <div className="col-4 text-right p-0 m-0">
                  <Tooltip title="Tạo nhóm layer mới">
                    <IconButton
                      open={this.state.isOpenSettingGroupLayer}
                      onClick={(event) => { this.onClickAddNewGroup(event) }}
                    >
                      <AddCircleIcon fontSize="small" className="text-success" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}

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
                  (GroupLayers, indexGroup) => (
                    <Draggable key={indexGroup}>
                      <Accordion>
                        <AccordionSummary className="p-0">
                          <div className="container-fluid p-0 m-0">
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
                              {!this.props.isLock && (
                                <div className="col-4 text-right p-0">
                                  <Tooltip title="Thêm layer mới">
                                    <IconButton
                                      onClick={(event) => {
                                        LayerCategoryAction
                                          .GetDetailLayerCategory(this.getLayerData.getLayerGroupByIndex(indexGroup)["id"])
                                          .then((res) => {
                                            if (res.content === null) {
                                              this.setState({ isOpenAlert: true, isCreateNewGroupLayers: false });
                                              this.onClickSettingGroupLayer(
                                                event,
                                                indexGroup,
                                                true,
                                              );
                                              this.setState({
                                                layerCategoryId: this.getLayerData.getLayerGroupByIndex(indexGroup)["id"],
                                                layerCategoryName: this.getLayerData.getLayerGroupByIndex(indexGroup)["folderName"],
                                              })
                                            } else {
                                              this.onClickOpenAddNewLayer(
                                                event,
                                                indexGroup
                                              )
                                            }
                                          })
                                        // this.onClickOpenAddNewLayer(
                                        //   event,
                                        //   indexGroup
                                        // )
                                      }
                                      }
                                    >
                                      <PlaylistAddIcon
                                        fontSize="small"
                                        className="text-success"
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Thiết đặt">
                                    <IconButton
                                      onClick={(event) => {
                                        LayerCategoryAction
                                          .GetDetailLayerCategory(this.getLayerData.getLayerGroupByIndex(indexGroup)["id"])
                                          .then((res) => {
                                            if (res.content === null) {
                                              this.setState({ isOpenAlert: true, isCreateNewGroupLayers: false });
                                              this.onClickSettingGroupLayer(
                                                event,
                                                indexGroup,
                                                true,
                                              );
                                              this.setState({
                                                layerCategoryId: this.getLayerData.getLayerGroupByIndex(indexGroup)["id"],
                                                layerCategoryName: this.getLayerData.getLayerGroupByIndex(indexGroup)["folderName"],
                                              })
                                            } else {
                                              res && res.content ?
                                                this.setState({
                                                  isCreateNewGroupLayers: false,
                                                  layerCategoryDetail: res.content,
                                                  layerCategoryTypeSelected: this.state.layerType.find((item) => (
                                                    item.id === res.content.layerCategoryTypeId
                                                  ))
                                                }) :
                                                this.setState({ layerCategoryDetail: [] });
                                              this.onClickSettingGroupLayer(
                                                event,
                                                indexGroup,
                                                false
                                              );
                                              this.GetDetailLayerCategory(this.getLayerData.getLayerGroupByIndex(indexGroup)["id"]).then((res) => {
                                              })
                                            }
                                          })
                                      }
                                      }
                                    >
                                      <TuneIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              )}
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
                                      <div className="col-7">
                                        <Tooltip title={layer.name}>
                                          <label
                                            //htmlFor={`checkbox-layer-index-${indexLayer}`}
                                            className="d-block text-truncate cursor-move"
                                          >
                                            {layer.name}
                                          </label>
                                        </Tooltip>
                                      </div>
                                      {!this.props.isLock && (
                                        <div className="col-4 text-right">
                                          <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                              onClick={(event) =>
                                                this.onClickEditLayer(
                                                  event,
                                                  indexGroup,
                                                  indexLayer
                                                )
                                              }
                                            >
                                              <EditIcon
                                                color="primary"
                                                fontSize="small"
                                              />
                                            </IconButton>
                                          </Tooltip>
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
                                      )}
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
                    </Draggable>
                  )
                )}
            </Container>
          </AccordionDetails>
        </Accordion>

        {/* setting group layer */}

        <Dialog
          style={{overflow:'hidden'}}
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
          <DialogActions className="row p-4 justify-content-lg-center">
            <Button
              className="col-lg-3 mr-2 col-sm-12 m-0 mb-2"
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
                className="col-lg-3 mr-2 col-sm-12 m-0 mb-2"
                variant="contained"
                onClick={() => this.openConfirmDeleteGroupLayer()}
                color="secondary"
              >
                <DeleteIcon className="mr-1" />
                Xóa nhóm
              </Button>
            )}

            <Button
              className="col-lg-3 mr-2 col-sm-12 m-0 mb-2"
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

        {/* setting layer */}

        <Dialog
          maxWidth="lg"
          disableBackdropClick
          disableEscapeKeyDown
          fullWidth={true}
          id="dialog-create-base-map"
          open={this.state.isOpenSettingLayer}
          onClose={() => this.setState({ isOpenSettingLayer: false })}
        >
          <DialogTitle disableTypography id="base-map-add-alert-dialog-title">
            <Typography variant="h6">{`${this.state.isCreateNewLayer ? 'Tạo layer' : 'Chỉnh sửa layer'}`}</Typography>
            <IconButton
              aria-label="close"
              onClick={() => this.setState({ isOpenSettingLayer: false })}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#9e9e9e",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            className="content-custom-container"
            id="content-custom-container-setting-layer"
            dividers
          >
            {this.state.isCreateNewLayer
              ? 
                (this.state.isOpenSettingLayer && (
                (this.props.isDesktopOrLaptop ? (
                  <ModalLayerSetting
                  planningId={this.props.planningId}
                  handleAddNewLayer={(newLayer) =>
                    this.handleAddNewLayer(newLayer)
                  }
                  layerCategoryId={this.state.idGroupLayerSelected}
                  closeModal={() =>
                    this.setState({ isOpenSettingLayer: false })
                  }
                />
                ) : ( <DialogContent
                  className="content-custom-container"
                  id="content-custom-container-setting-layer"
                  dividers
                >
                  Chức năng này chỉ hỗ trợ trên máy tính.
                </DialogContent>)))
                
              ):
              (
                this.state.isOpenSettingLayer && (
                <ModalEditSettingLayer
                  setLayerData={(data) => this.handleSaveEditLayer(data)}
                  layerData={this.getLayerData.getLayerByIndexGroupAndIndexLayer(
                    this.state.groupIndexSelected,
                    this.state.layerIndexSelected
                  )}
                  closeModal={() =>
                    this.setState({ isOpenSettingLayer: false })
                  }
              />)
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm modal */}
        <ConfirmModalView
          open={this.state.openConfirmModal}
          handleClose={() => this.setState({ openConfirmModal: false })}
          title={this.state.confirmModalTitle}
          handleAccept={this.state.confirmModalHandleAccept}
        />
        <Dialog
          open={this.state.isOpenAlert}
          onClose={this.closeDialogAlert}
          aria-labelledby='base-map-add-alert-dialog-title'
          aria-describedby='content-custom-container'
          id="dialog-create-base-map"
        >
          <DialogTitle id='base-map-add-alert-dialog-title'>
            Thông báo
          </DialogTitle>
          <DialogContent id='content-custom-container'>
            Trang web đã nâng cấp lên giai đoạn 2!
            Vui lòng cập nhật thêm thông tin nhóm layer.
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={this.closeDialogAlert}>Đóng</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.closeDialogAlert();
                this.setState({ isOpenSettingGroupLayers: true })
              }}>Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
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
