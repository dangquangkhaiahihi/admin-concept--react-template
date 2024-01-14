import React from 'react';
import './layer-infomation-view.scss';
import * as MaterialUi from '@material-ui/core';
import TabPanel from '../child/TabPanel-edit';
import { a11yPropsEdit } from '../child/tab-a11yProps';
import RenderListItems from '../child/list-items';
import LayerInfomationViewEditModels from '../../../../../models/init-map-state/child/layer-infomation-view-edit-model';
import ConfigModels from '../../../../../models/init-map-state/child/config-models';
import * as actionMapData from '../../../../../redux/store/init-map/mapping-data';

export default class LayerInfomationViewEdit extends React.Component<LayerInfomationViewEditModels.LayerInfomationViewEditProps, LayerInfomationViewEditModels.LayerInfomationViewEditState> {
    constructor(props: LayerInfomationViewEditModels.LayerInfomationViewEditProps) {
        super(props);
        this.state = {
            value: 0,
            // pgTable: [],
            // newViewDetail: [],
            // newValueTooltip: [],
            // newValuePopup: [],
            // newViewDetail: this.props.viewDetail,
            // newValueTooltip: this.props.tooltip,
            // newValuePopup: this.props.popup,
        }
    }

    componentDidMount() {
        // let data: ConfigModels.ObjectOfArray[] = [];
        // if (this.props.table) {
        //     actionMapData.GetListPgTable(this.props.table).then((res) => {
        //         res && res.content && res.content.length > 0  && res.content.map((col: ConfigModels.PgTable) =>
        //             data.push({
        //                 column_name: col.col,
        //                 data_type: col.kieu,
        //                 label: col.alias || col.col,
        //                 checked: false,
        //             })
        //         );console.log(data)
        //         if (res && res.content && res.content.length  > 0 && data && data.length > 0) {
        //             this.compareViewData(data, this.props.viewDetail, 0);
        //             this.compareViewData(data, this.props.tooltip, 1);
        //             this.compareViewData(data, this.props.popup, 2);
        //         }
        //     })
        // }
    }

    // compareViewData(pgTable: ConfigModels.ObjectOfArray[], viewDetail: ConfigModels.ObjectOfArray[], value = this.state.value) {
    //     let result: ConfigModels.ObjectOfArray[] = []
    //     let arr1 = viewDetail;
    //     let arr2 = pgTable;
    //     arr1.map((table) => {
    //         let object = arr2.find((item) => item.column_name === table.column_name);
    //         if (object) {
    //             result.push(object)

    //         } else {
    //             result.push(table);
    //         }
    //         //console.log(object)
    //     })
    //     if (value === 0) {
    //         this.setState({ newViewDetail: result });
    //     } else if (value === 1) {
    //         this.setState({ newValueTooltip: result });
    //     } else {
    //         this.setState({ newValuePopup: result })
    //     }
    //     //console.log(pgTable)
    // }

    // compareTooltip(pgTable: [], viewDetail: ConfigModels.ObjectOfArray[]) {
    //     let listView = viewDetail.concat(pgTable);
    //     let result = [];
    //     let obj: any[] = [];
    //     result = listView.reduce((prev: any, cur: any) => {
    //         if (!obj[cur.column_name]) {
    //             obj[cur.column_name] = true && prev.push(cur);
    //         }
    //         return prev;
    //     }, []);
    //     this.setState({ newViewDetail: result });
    // }

    handleChange = (event: any, newValue: number) => {
        this.setState({ value: newValue });
    };

    render() {
        return (
            <div>
                <MaterialUi.AppBar position="static">
                    <MaterialUi.Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" centered variant="scrollable">
                        <MaterialUi.Tab label="View chi tiết" {...a11yPropsEdit(0)}/>
                        <MaterialUi.Tab label="Tooltip" {...a11yPropsEdit(1)}/>
                        <MaterialUi.Tab label="Popup" {...a11yPropsEdit(2)}/>
                    </MaterialUi.Tabs>
                </MaterialUi.AppBar>
                <TabPanel value={this.state.value} index={0}>
                    {/* {this.state.newViewDetail && this.state.newViewDetail.length > 0 && */}
                        {/* <RenderListItems data={this.state.newViewDetail} */}
                        <RenderListItems data={this.props.viewDetail}
                            dataSource={this.props.dataSource}
                            setDataSource={(data: ConfigModels.SortDataSourceObject) => this.props.setDataSource(data)}
                            setData={(data: ConfigModels.ObjectOfArray[]) => this.props.setViewDetail(data)}
                        />
                        {/* } */}
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    {/* {this.state.newValueTooltip &&
                        <RenderListItems data={this.state.newValueTooltip}  */}
                        <RenderListItems data={this.props.tooltip}
                        dataSource={this.props.dataSource} 
                        setDataSource={(data: ConfigModels.SortDataSourceObject) => this.props.setDataSource(data)} 
                        setData={(data: ConfigModels.ObjectOfArray[]) => this.props.setTooltip(data)} 
                        />
                        {/* } */}
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    {/* {this.state.newValuePopup &&
                        <RenderListItems data={this.state.newValuePopup}  */}
                        <RenderListItems data={this.props.popup}
                        dataSource={this.props.dataSource} 
                        setDataSource={(data: ConfigModels.SortDataSourceObject) => this.props.setDataSource(data)} 
                        setData={(data: ConfigModels.ObjectOfArray[]) => this.props.setPopup(data)} />
                    {/* } */}
                </TabPanel>
            </div>
        )
    }
}