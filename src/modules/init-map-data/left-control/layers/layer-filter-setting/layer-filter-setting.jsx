import React from 'react';
import '../layer-infomation-view/layer-infomation-view.scss';
import RenderListItems from '../child/list-items';
import * as InitMapConfig from '../../../config/config';
import TabPanel from '../child/TabPanel-edit';
import { a11yPropsEdit } from '../child/tab-a11yProps';
import { Paper, Tab, Tabs, TextField } from '@material-ui/core';

export default class SettingLayerFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // inputSetting: [...this.props.layerFilterSetting.input],
            // outputSetting: [...this.props.layerFilterSetting.output],
            value: 0,
            sortWidth: '',
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    }

    componentDidMount() {
        if (this.props.layerFilterSetting.sortKeyword) this.setState({ sortWidth: this.props.layerFilterSetting.sortKeyword }); else
            this.setState({ sortWidth: this.props.layerFilterSetting.output.length > 0 ? this.props.layerFilterSetting.output[0].column_name : '' });
    }

    componentWillUnmount() {
        // this.props.setLayerFilterSetting(InitMapConfig.CreateUpdateLayerFilterObject(this.state.inputSetting, this.state.outputSetting, this.state.sortWidth))
    }

    render() {
        return (
            <div>
                {
                    this.props.isImportShapeFile
                        ? (
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
                                                    defaultValue={this.props.valueShapeFileStep_4.RootFolderName}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Tên bảng"
                                                    disabled={true}
                                                    defaultValue={this.props.valueShapeFileStep_4.TableName}
                                                />
                                            </div>

                                            <div>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Tên style"
                                                    disabled={true}
                                                    defaultValue={this.props.valueShapeFileStep_4.StyleName}
                                                />
                                            </div>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        )
                        : (
                            <div className="container-fluid setting-infomation-view-layer-container mt-3">
                                <div className="row">
                                    <div className="col-12">
                                        <Paper className="p-3" elevation={3}>
                                            <div className="row">
                                                <div className="col-4 position-relative">
                                                    <Tabs
                                                        orientation="vertical"
                                                        variant="scrollable"
                                                        value={this.state.value}
                                                        onChange={this.handleChange}
                                                        aria-label="Vertical tabs example"
                                                    >
                                                        <Tab label="Input" {...a11yPropsEdit(0)} />
                                                        <Tab label="Output" {...a11yPropsEdit(1)} />
                                                    </Tabs>
                                                </div>
                                                <div className="col-8">
                                                    <TabPanel value={this.state.value} index={0}>
                                                        <RenderListItems
                                                            data={this.props.input}
                                                            setData={(data) => this.props.setInput(data)}
                                                            numberCase={this.props.numberCase}
                                                        />

                                                    </TabPanel>

                                                    <TabPanel value={this.state.value} index={1}>
                                                        <RenderListItems
                                                            data={this.props.output}
                                                            setData={(data) => this.props.setOutput(data)}
                                                            dataSourceCols={this.props.dataSource.cols}
                                                            sortWidth={this.state.sortWidth}
                                                            setSortWidth={(data) => { this.setState({ sortWidth: data }) }} />
                                                    </TabPanel>
                                                </div>
                                            </div>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}
