import React from 'react';
import * as MaterialUi from '@material-ui/core';
import RenderListItems from '../child/list-items';
import TabPanel from '../child/TabPanel-edit';
import { a11yPropsEdit } from '../child/tab-a11yProps';
import LayerFilterSettingEditModels from '../../../../../models/init-map-state/child/layer-filter-setting-edit-models'
import ConfigModels from '../../../../../models/init-map-state/child/config-models';
import "./layer-filter-setting-edit.scss";

export default class SettingLayerFilterForEditView extends React.Component<LayerFilterSettingEditModels.LayerFilterSettingEditProps, LayerFilterSettingEditModels.LayerFilterSettingEditState> {
    constructor(props: LayerFilterSettingEditModels.LayerFilterSettingEditProps) {
        super(props);
        this.state = {
            value: 0,
        }
    }

    handleChange = (event: any, newValue: number) => {
        this.setState({ value: newValue });
    };

    render() {
        return (
            <div className="position-relative">
                <MaterialUi.AppBar position="static">
                    <MaterialUi.Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" centered>
                        <MaterialUi.Tab label="Input" {...a11yPropsEdit(0)} />
                        <MaterialUi.Tab label="Output" {...a11yPropsEdit(1)} /> 
                    </MaterialUi.Tabs>
                </MaterialUi.AppBar>
                <TabPanel value={this.state.value} index={0}>
                    <RenderListItems data={this.props.inputSetting} setData={(data: ConfigModels.ObjectOfArray[]) => this.props.setInputSetting(data)} numberCase={3} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <RenderListItems data={this.props.outputSetting} setData={(data: ConfigModels.ObjectOfArray[]) => this.props.setOutputSetting(data)} />
                </TabPanel>
                <div hidden={this.state.value === 0} className="select-main-keyword-container">
                    <label htmlFor="selectSordResultFilter">Sắp xếp kết quả hiển thị theo:</label>
                    <select id="selectSordResultFilter" className="form-control" value={this.props.sortWidth} onChange={event => this.props.setSortWidth(event.target.value)}>
                        {
                            this.props.dataSource.cols.map((column, index) => <option key={index} value={column.column_name}>{column.column_name}</option>)
                        }
                    </select>
                </div>
            </div>
        )
    }
}
