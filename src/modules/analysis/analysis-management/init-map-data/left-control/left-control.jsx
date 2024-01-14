import React, { useEffect, useState } from 'react';
import './left-control.scss';
import RenderBasemap from './baseMap/baseMap.view';
import MapInfo from './map-info/map-info.jsx';
import RenderRelatePlanning from './relatePlanning/relatePlanning.jsx';
import { connect } from 'react-redux';
import RenderLayerControlView from './layers/layers.jsx';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../../../redux/store/init-map/init-map.store';

function LeftControlView(props) {
    useEffect(() => {
        setClientSetting(props.settings);
    }, [props.settings])
    useEffect(() => {
        if(props.dataItems!=null)
        setIsOpenCIDetail(3)
      }, [props.dataItems]);
    const [clientSetting, setClientSetting] = useState();
    const [isOpenCIDetail, setIsOpenCIDetail] = useState("1");
    const handleOpenPopup = () => {
        props.UpdateOpenGeneralSettingModal(true)
    }
    let output = null;
    if (isOpenCIDetail == "1") {
            output = (
                <div>
                    <RenderBasemap
                        isLock={props.isLock}
                        selectBaseMapFunction={props.controlOpenlayer}
                        mapId={props.mapId} />
                    <RenderLayerControlView
                        isLock={props.isLock}
                        selectToggleLayerFunction={props.controlOpenlayer}
                        planningId={props.planningId} />
                </div>
            );
            }
            else if (isOpenCIDetail == "2"){
                output = (
                    <div>
                        <RenderRelatePlanning
                            isLock={props.isLock}
                            selectToggleLayerFunction={props.controlOpenlayer}
                            planningId={props.planningId}
                            analysisId={props.analysisId} />
                    </div>
                );
            }
            else
            {
                output = (
                    <div>
                         {props.dataItems ? (<MapInfo isLock={true} dataItems={props.dataItems} />): ("Không có dữ liệu")}
                    </div>
                );
            }

    
    return (
        <span>
            {clientSetting && (
                <div className="h-100 left-control-container p-2" style={{ overflowY: "auto" }}>
                    <RenderMapHeader
                        setIsOpenCIDetail={setIsOpenCIDetail}
                        isOpenCIDetail={isOpenCIDetail}
                        isLock={props.isLock}
                        click={() => handleOpenPopup()}
                        clientSetting={clientSetting} />
                    {output}
                </div>
            )}
        </span>
    );
}

function RenderMapHeader(props) {
    const { setIsOpenCIDetail, isOpenCIDetail } = props;
    return (
        <div
        // className="left-control-map-title-container row no-gutters pt-2 pb-2 alignItems-baseline" 
        >
            <div className="col-12 pl-3">
            <div className="row tab_">
                        <div
                            onClick={() => setIsOpenCIDetail("1")}
                            className={`col-3 ${isOpenCIDetail == "1" ? 'active' : ''}`}
                            style={{ cursor: "pointer" }}
                        >
                            <p>Bản đồ</p>
                        </div>

                            <div
                                onClick={() => setIsOpenCIDetail("2")}
                                className={`col-6 ${isOpenCIDetail == "2" ? 'active' : ''}`}
                                style={{ cursor: "pointer" }}
                            >
                                <p>Quy hoạch liên quan</p>
                            </div>
                            <div
                                onClick={() => setIsOpenCIDetail("3")}
                                className={`col-3 ${isOpenCIDetail == "3"? 'active' : ''}`}
                                style={{ cursor: "pointer" }}
                            >
                                <p>Thông tin</p>
                            </div>

                    </div>
                    {/* /// */}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    controlOpenlayer: state.openLayer.handleOutSideFunction,
    settings: state.clientSetting.clientSetting,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    UpdateOpenGeneralSettingModal: InitMapStore.UpdateOpenGeneralSettingModal
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LeftControlView)
