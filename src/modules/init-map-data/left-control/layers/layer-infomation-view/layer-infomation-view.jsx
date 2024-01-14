import React, { Component } from "react";
import "./layer-infomation-view.scss";
import RenderListItems from "../child/list-items";
import * as InitMapConfig from "../../../config/config";
import TabPanel from "../child/TabPanel-edit";
import { a11yPropsEdit } from "../child/tab-a11yProps";
import { Paper, Tab, Tabs, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default class SettingInfomationViewLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // viewDetail: [...this.props.layerViewSetting.viewDetail],
      // tooltip: [...this.props.layerViewSetting.tooltip],
      // popup: [...this.props.layerViewSetting.popup],
      value: 0,
      planningList: [{ title: "Dự án Tiên Yên", value: 1 }],
      styleName: this.props.valueShapeFileStep_3.styleName,
    };
  }
  componentDidMount() {
    console.log(this.props.viewDetail);
  }
  componentWillUnmount() {
    // const NewLayerViewSetting = InitMapConfig.CreateUpdateLayerDisplayInfomationSettingObject(
    //   this.state.viewDetail,
    //   this.state.tooltip,
    //   this.state.popup
    // );
    // this.props.setLayerViewSetting(NewLayerViewSetting);
    // console.log(NewLayerViewSetting)
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleChangeStyle = (event, newValue) => {
    this.props.setStyleName(newValue);
  }
  render() {
    return (
      <div>
        {this.props.isImportShapeFile ? (
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-6 mx-auto">
                <Paper className="p-3" elevation={3}>
                  <div className="form-group">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Tên thư mục cha"
                      disabled={true}
                      defaultValue={
                        this.props.valueShapeFileStep_3.RootFolderName
                      }
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Tên bảng"
                      disabled={true}
                      defaultValue={this.props.valueShapeFileStep_3.TableName}
                    />
                  </div>

                  <div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Id dự án quy hoạch"
                        disabled={true}
                        defaultValue={
                          this.props.valueShapeFileStep_3.PlanningId
                        }
                      />
                    </div>
                  </div>
                  {this.props.valueShapeFileStep_3.ListStyles && this.props.valueShapeFileStep_3.ListStyles.length > 0 && (
                    <div>
                      <div className="form-group">
                        <Autocomplete
                          options={this.props.valueShapeFileStep_3.ListStyles}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.Name
                          }
                          value={this.state.styleName}
                          placeholder="Chọn Style..."
                          onChange={this.handleChangeStyle}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="styleName"
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </Paper>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-fluid setting-infomation-view-layer-container mt-3">
            <div className="row">
              <div className="col-12">
                <Paper className="p-3" elevation={3}>
                  <div className="row">
                    <div className="col-4">
                      <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={this.state.value}
                        onChange={this.handleChange}
                        aria-label="Vertical tabs example"
                      >
                        <Tab label="View chi tiết" {...a11yPropsEdit(0)} />
                        <Tab label="Tooltip" {...a11yPropsEdit(1)} />
                        <Tab label="Popup" {...a11yPropsEdit(2)} />
                      </Tabs>
                    </div>
                    <div className="col-8">
                      <TabPanel value={this.state.value} index={0}>
                        <RenderListItems
                          data={this.props.viewDetail}
                          dataSource={this.props.dataSource}
                          setDataSource={this.props.setDataSource}
                          setData={data => this.props.setViewDetail(data)}
                        />
                      </TabPanel>
                      <TabPanel value={this.state.value} index={1}>
                        <RenderListItems
                          data={this.props.tooltip}
                          dataSource={this.props.dataSource}
                          setDataSource={this.props.setDataSource}
                          setData={data => this.props.setTooltip(data)}
                        />
                      </TabPanel>
                      <TabPanel value={this.state.value} index={2}>
                        <RenderListItems
                          data={this.props.popup}
                          dataSource={this.props.dataSource}
                          setDataSource={this.props.setDataSource}
                          setData={data => this.props.setPopup(data)}
                        />
                      </TabPanel>
                    </div>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
