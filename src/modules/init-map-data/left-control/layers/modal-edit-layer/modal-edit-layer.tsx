import React from 'react';
import TabPanel from '../child/TabPanel';
import { a11yProps } from '../child/tab-a11yProps';
import './modal-edit-layer.scss';
import GeneralInfomationView from '../general-infomation/general-infomation';
import EditLayerSettingView from '../setting-layer/setting-layer-edit';
import ChangeLayerDataSource from '../select-data-source/select-data-source-edit';
import LayerInfomationViewEdit from '../layer-infomation-view/layer-infomation-view-edit';
import SettingLayerFilterForEditView from '../layer-filter-setting/layer-filter-setting-edit';
import ModalEditLayerModels from '../../../../../models/init-map-state/child/modal-edit-layer-models';
import LayerSettingsModels from "../../../../../models/map-data-model-b/layer-setting-models";
import SettingDescription from '../setting-layer/setting-description';
import {
    ConvertStandardDataDisplayProperyToControlDataSource,
    ConvertDisplayStandardPropertyToControlForm,
    MergeLayerDisplayStandardData,
    CreateUpdateLayerDisplayInfomationSettingObject,
    ConvertFilterStandardPropertyToControlForm,
    MergeFilterStandardData,
    CreateUpdateLayerFilterObject
} from '../../../config/config';
import ConfigModels from '../../../../../models/init-map-state/child/config-models';
import { Button, Tab, Tabs } from '@material-ui/core';

export default class ModalEditSettingLayer extends React.Component<ModalEditLayerModels.ModalEditLayerProps, ModalEditLayerModels.ModalEditLayerState> {
    constructor(props: ModalEditLayerModels.ModalEditLayerProps) {
        super(props)

        const Index = this.props?.layerRelaIndex;
        const LayerData = (this.props.isLayerRela && (this.props.layerRelaIndex || this.props.layerRelaIndex == 0)) ?
            this.props.layerData?.layerRealationships[this.props.layerRelaIndex]
            : this.props.layerData;
        const LayerParents = this.props.isLayerRela ? this.props.layerData : null;
        const LayerDisplay = LayerData.displayName;
        const LayerFilter = LayerData.filterName;
        const DisplayCols = LayerData.displayName.cols;
        const DataSource = ConvertStandardDataDisplayProperyToControlDataSource(LayerDisplay);
        const Year = LayerData?.year;
        const ContentChange = LayerData?.contentChange;
        const IsLayerRela = this.props?.isLayerRela;
        this.state = {
            layerData: LayerData,
            layerParents: LayerParents,
            value: 0,
            hasSave: false,
            dataSource: DataSource,
            viewDetail: ConvertDisplayStandardPropertyToControlForm(LayerDisplay.viewdetail.cols, DisplayCols),
            tooltip: ConvertDisplayStandardPropertyToControlForm(LayerDisplay.tooltip.cols, DisplayCols),
            popup: ConvertDisplayStandardPropertyToControlForm(LayerDisplay.popup.cols, DisplayCols),
            sortWidth: LayerData.filterName.order,
            inputSetting: ConvertFilterStandardPropertyToControlForm(LayerFilter.in, DataSource.cols),
            outputSetting: ConvertFilterStandardPropertyToControlForm(LayerFilter.out, DataSource.cols),
            year: Year,
            contentChange: ContentChange,
            isLayerRela: IsLayerRela,
            layerRelaIndex: this.props.layerRelaIndex,
        }
    }

    componentDidMount() {
        console.log(this.state.viewDetail)
        console.log(this.state.inputSetting)
        console.log(this.props.isLayerRela);
        console.log(this.props);
    }

    handleChange = (event: any, newValue: number) => {
        this.setState({ value: newValue })
    };

    componentWillUnmount() {
        if (this.state.hasSave && !this.state.isLayerRela) {
            this.props.setLayerData({
                ...this.state.layerData,
                displayName: MergeLayerDisplayStandardData(this.state.dataSource,
                    CreateUpdateLayerDisplayInfomationSettingObject(this.state.viewDetail, this.state.tooltip, this.state.popup)
                ),
                filterName: MergeFilterStandardData(CreateUpdateLayerFilterObject(this.state.inputSetting, this.state.outputSetting, this.state.sortWidth))
            });
        } else if(this.state.isLayerRela && (this.state.layerRelaIndex || this.state.layerRelaIndex == 0)) {
            let data = this.state.layerParents.layerRealationships;
            data[this.state.layerRelaIndex] = {
                ...this.state.layerData,
                displayName: MergeLayerDisplayStandardData(this.state.dataSource,
                    CreateUpdateLayerDisplayInfomationSettingObject(this.state.viewDetail, this.state.tooltip, this.state.popup)
                ),
                filterName: MergeFilterStandardData(CreateUpdateLayerFilterObject(this.state.inputSetting, this.state.outputSetting, this.state.sortWidth))
            }
            this.props.setLayerData({ ...this.state.layerParents, layerRealationships: data});
        }
    }

    handleSave = () => {
        this.setState({ value: 0, hasSave: true })
        setTimeout(() => {
            this.props.closeModal();
        }, 10)
    }

    render() {
        const value = this.state.value
        return (
            <div className="container-fluid p-0 layer-edited-container" >
                <div className="d-flex flex-column m-0 row flex-lg-row">
                    <div className="col-lg-4">
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={this.handleChange}
                            aria-label="Vertical tabs example"
                        >
                            <Tab label="Thông tin layer" {...a11yProps(0)} />
                            <Tab label="Thay đổi cài đặt" {...a11yProps(1)} />
                            <Tab label="Đổi nguồn dữ liệu" {...a11yProps(2)} />
                            <Tab label="Thay đổi cài đặt hiển thị" {...a11yProps(3)} />
                            <Tab label="Thay đổi cài đặt lọc" {...a11yProps(4)} />
                            <Tab label="Thay đổi ảnh ghi chú" {...a11yProps(5)} />
                        </Tabs>
                    </div>
                    <div className="col-lg-8">
                        <div className="limited-big-container">
                            <TabPanel value={value} index={0}>
                                <GeneralInfomationView data={this.state.layerData} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <EditLayerSettingView
                                    data={this.state.layerData}
                                    setData={(data: LayerSettingsModels.LayerSettingsModel) => this.setState({ layerData: data })}
                                    isLayerRela={this.state.isLayerRela}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <ChangeLayerDataSource data={this.state.layerData} dataSource={this.props.layerData} setData={(data: LayerSettingsModels.LayerSettingsModel) => this.setState({ layerData: data })} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <LayerInfomationViewEdit
                                    table={this.state.layerData.table}
                                    viewDetail={this.state.viewDetail}
                                    tooltip={this.state.tooltip}
                                    popup={this.state.popup}
                                    dataSource={this.state.dataSource}
                                    setTooltip={(data: ConfigModels.ObjectOfArray[]) => this.setState({ tooltip: data })}
                                    setViewDetail={(data: ConfigModels.ObjectOfArray[]) => this.setState({ viewDetail: data })}
                                    setPopup={(data: ConfigModels.ObjectOfArray[]) => this.setState({ popup: data })}
                                    setDataSource={(data: ConfigModels.SortDataSourceObject) => this.setState({ dataSource: data })} />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <SettingLayerFilterForEditView
                                    sortWidth={this.state.sortWidth}
                                    inputSetting={this.state.inputSetting}
                                    outputSetting={this.state.outputSetting}
                                    setSortWidth={(data: string) => this.setState({ sortWidth: data })}
                                    setInputSetting={(data: ConfigModels.ObjectOfArray[]) => this.setState({ inputSetting: data })}
                                    setOutputSetting={(data: ConfigModels.ObjectOfArray[]) => this.setState({ outputSetting: data })}
                                    dataSource={this.state.dataSource}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <SettingDescription data={this.state.layerData} setData={(data: LayerSettingsModels.LayerSettingsModel) => this.setState({ layerData: data })} ></SettingDescription>
                            </TabPanel>
                        </div>
                    </div>
                    <div className="col-lg-6 text-danger">
                        (*): Mọi thay đổi chỉ được áp dụng khi ấn lưu lại
                    </div>
                    <div className="col-lg-6 text-right mb-3">
                        <Button variant="contained" className="mr-3" onClick={() => this.props.closeModal()}>Đóng</Button>
                        <Button variant="contained" color="primary" onClick={() => this.handleSave()}>Lưu lại</Button>
                    </div>
                </div>
            </div>
        )
    }
}