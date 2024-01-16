import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../../redux/store/init-map/init-map.store';
import * as appActions from "../../../../core/app.store";
import { Tab, Tabs } from '@material-ui/core';
import { a11yPropsSearchFields } from '../../../init-map-data/left-control/layers/child/tab-a11yProps';
import TabPanel from '../../../init-map-data/left-control/layers/child/TabPanel-edit';
import SearchMapFieldsView from './search-map-fields/search-map-fields.view';
import * as objectGeogisesAction from "../../../../redux/store/object-geogises/object-geogises.store";
import { Configs } from '../../../../common/config';

import * as planningAction from "../../../../redux/store/planning/planning.store";
import { NotificationMessageType } from "../../../../utils/configuration";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import * as viVN from "../../../../language/vi-VN.json";
import SearchMapResult from './search-map-result/search-map-result.view';
import ControlFunctionType from '../../../../components/open-layer/control-function-type/control-function-type';

function LeftToolSearchMap(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        if(newValue == 0 && props.isEntendLeftBar) {
            props.setIsEntendLeftBar();
            const timeoutId = setTimeout(() => {
                setValue(newValue);
            }, 500);
            return () => clearTimeout(timeoutId);
        }else {
            setValue(newValue);
        }
    };

    const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState([]);
    const [totalItemCount, setTotalItemCount] = useState();

    function wktToPointArray(wkt) {
        // Extract the coordinates from the WKT string
        const coordinatesString = wkt.substring(wkt.indexOf('(') + 1, wkt.indexOf(')'));
        const [longitude, latitude] = coordinatesString.split(' ').map(coord => parseFloat(coord));
    
        // Create and return an array of numbers
        return [longitude, latitude];
    }

    const onGetObjectGeogisOnMap = async (
        pageIndex = 1,
        pageSize,
        Year,
        PlanningTypeId,
        ObjType = "dat",
        ObjKind,
        DistrictId 
    ) => {
        // setPage(pageIndex - 1);
        props.controlOpenlayer_handleOutSideFunction(ControlFunctionType.Delete_All_HightLightedPolygon, '');
        setChecked([]);
        props.showLoading(true);
        try {
            const res = await objectGeogisesAction.GetObjectGeogisOnMap(
                pageIndex,
                pageSize,
                Year,
                PlanningTypeId,
                ObjType,
                ObjKind,
                DistrictId 
            );

            const properties = [];
            const boundaries = [];
            const dataGids= [];

            if (res && res.content) {
                // setData(res.content.items);
                res.content.items.forEach((item, index) => {
                    let feature = JSON.parse(item.pros);
                    let tempGeo = null;

                    if (feature[0]?.geo) {
                        boundaries.push(feature[0].geo);
                        tempGeo = feature[0].geo;
                    }

                    delete item.pros;
                    properties.push({...item, 'geo': tempGeo, 'center': wktToPointArray(item.centerPoint)});
                    dataGids.push(index);
                    props.controlOpenlayer_handleOutSideFunction(ControlFunctionType.Add_Single_HightLightedPolygon, {'geo': [tempGeo],'index': index});
                });
                
                setData(properties);
                setChecked(dataGids)
                setValue(1);
                setTotalItemCount(res.content.totalItemCount);
            }
            
            // props.controlOpenlayer_handleOutSideFunction(ControlFunctionType.HightLightPolygon, boundaries);


            setCurrentObjectType(ObjType);
            props.showLoading(false);
        } catch (err) {
            console.log(err);
            props.showLoading(false);
        }
    };

    const [typeSelected, setTypeSelected] = useState(null);
    const [objectTypeSelected, setObjectTypeSelected] = useState(null);

    const [currentObjectType, setCurrentObjectType] = useState('dat');
    const [objectKindSelected, setObjectKindSelected] = useState(null);
    const [districtSelected, setDistrictSelected] = useState(null);
    const [yearSelected, setYearSelected] = useState(null);

    const [planningTypeModel, setPlanningTypeModel] = useState([]);
    const [districtModel, setDistrictModel] = useState([]);
    const [objectTypeModel, setObjectTypeModel] = useState([
        {
            id: 'dat',
            name: 'Quy hoạch đất'
        },
        {
            id: 'dien',
            name: 'Quy hoạch cấp điện'
        },
        {
            id: 'nuoc',
            name: 'Quy hoạch cấp nước'
        },
    ]);
    const [objectKindModel, setObjectKindModel] = useState([]);
    const [yearStatementModel, setYearStatementModel] = useState([]);

    const onGetLookUpPlanningType = () => {
        return new Promise((resolve, reject) => {
            planningAction.GetLookUpPlanningType().then(
                (res) => {
                    setPlanningTypeModel(res && res.content);
                    setTypeSelected(res && res.content.filter(item => item.id == 2)[0]);
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    ShowNotification(
                        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                        NotificationMessageType.Error
                    );
                }
            );
        });
    };
    
    const onGetLookUpPlanningDistrict = () => {
        return new Promise((resolve, reject) => {
            planningAction.GetLookupDistrict().then(
                (res) => {
                    setDistrictModel(res && res.content);
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    ShowNotification(
                        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                        NotificationMessageType.Error
                    );
                }
            );
        });
    };
    
    const onGetYearStatement = () => {
        return new Promise((resolve, reject) => {
            objectGeogisesAction.GetYearStatement().then(
                (res) => {
                if(res && res.content) {
                    const temp = [];
                    res.content.map((item) => {
                    temp.push({
                        id: item.toString(),
                        name: item.toString(),
                    })
                    })
                    setYearStatementModel(temp);
                }
                resolve(res);
                },
                (err) => {
                    reject(err);
                    ShowNotification(
                        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                        NotificationMessageType.Error
                    );
                }
            );
        });
    };
    
    const onGetLookUpObjectKind = () => {
        return new Promise((resolve, reject) => {
        objectGeogisesAction.GetLookUpObjectKind().then(
            (res) => {
                setObjectKindModel(res && res.content);
                resolve(res);
            },
            (err) => {
                reject(err);
                ShowNotification(
                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                    NotificationMessageType.Error
                );
            }
        );
        });
    };

    const onGetData = () => {
        props.showLoading(true);
        Promise.all([
            onGetLookUpPlanningType(),
            onGetLookUpPlanningDistrict(),
            onGetYearStatement(),
            onGetLookUpObjectKind(),
        ])
        .then((res) => {
            props.showLoading(false);
        })
        .catch((err) => {
            props.showLoading(false);
        });
    };

    useEffect(() => {
        setObjectTypeSelected(objectTypeModel[0]);
        onGetData();
    }, []);

    return (
        <div style={{backgroundColor: 'white'}}>
            <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChange}
                aria-label="Search Fields tabs example"
                textColor="secondary"
                indicatorColor="secondary"
            >
                <Tab label="Tìm kiếm" {...a11yPropsSearchFields(0)} />
                <Tab label="Kết quả" {...a11yPropsSearchFields(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <SearchMapFieldsView 
                    onGetObjectGeogisOnMap={onGetObjectGeogisOnMap}
                    rowsPerPage={rowsPerPage}
                    typeSelected = {typeSelected}
                    setTypeSelected = {setTypeSelected}
                    objectTypeSelected = {objectTypeSelected}
                    setObjectTypeSelected = {setObjectTypeSelected}
                    currentObjectType = {currentObjectType}
                    setCurrentObjectType = {setCurrentObjectType}
                    objectKindSelected = {objectKindSelected}
                    setObjectKindSelected = {setObjectKindSelected}
                    districtSelected = {districtSelected}
                    setDistrictSelected = {setDistrictSelected}
                    yearSelected = {yearSelected}
                    setYearSelected = {setYearSelected}
                    planningTypeModel = {planningTypeModel}
                    districtModel = {districtModel}
                    objectTypeModel = {objectTypeModel}
                    objectKindModel = {objectKindModel}
                    yearStatementModel = {yearStatementModel}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div style={{maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden'}}>
                    {data.length > 0 && (
                        <SearchMapResult
                            totalItemCount={totalItemCount}
                            data={data}
                            onGetObjectGeogisOnMap={onGetObjectGeogisOnMap}
                            setPage={setPage}
                            setRowsPerPage={setRowsPerPage}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            currentObjectType={currentObjectType}
                            callOpenlayerOutSideFunction = {props.controlOpenlayer_handleOutSideFunction}
                            setIsEntendLeftBar={props.setIsEntendLeftBar}
                            isEntendLeftBar={props.isEntendLeftBar}
                            checked={checked}
                            setChecked={setChecked}
                            typeSelected = {typeSelected}
                            objectTypeSelected = {objectTypeSelected}
                            objectKindSelected = {objectKindSelected}
                            districtSelected = {districtSelected}
                            yearSelected = {yearSelected}
                        />
                    )}
                    {data.length == 0 &&
                        <div>Chưa có thông tin</div>
                    }
                    </div>
            </TabPanel>
        </div>
    )
}

const mapStateToProps = state => ({
    controlOpenlayer_handleOutSideFunction: state.openLayer.handleOutSideFunction,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    showLoading: appActions.ShowLoading,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LeftToolSearchMap)
