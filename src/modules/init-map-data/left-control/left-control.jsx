import React, { useEffect, useState } from 'react';
import './left-control.scss';
import RenderBasemap from './baseMap/baseMap.view';
import { connect } from 'react-redux';
import RenderLayerControlView from './layers/layers.jsx';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../redux/store/init-map/init-map.store';
import { useMediaQuery } from 'react-responsive';

function LeftControlView(props) {
    useEffect(() => {
        setClientSetting(props.settings);
    }, [props.settings])

    const [clientSetting, setClientSetting] = useState();

    const handleOpenPopup = () => {
        props.UpdateOpenGeneralSettingModal(true)
    }

    //media query
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 1224px)",
    });
    const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
    const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

    return (
        <span>
            {
                clientSetting && (
                    <div className="h-100 left-control-container p-2" style={{ overflowY: "auto" }}>
                        <RenderMapHeader isLock={props.isLock} click={() => handleOpenPopup()} clientSetting={clientSetting} />
                        <RenderBasemap isLock={props.isLock} selectBaseMapFunction={props.controlOpenlayer} mapId={props.mapId} />
                        <RenderLayerControlView isLock={props.isLock} selectToggleLayerFunction={props.controlOpenlayer} planningId={props.planningId} isDesktopOrLaptop={isDesktopOrLaptop}/>
                        {/* <MapToolPanel/> */}
                    </div>
                )
            }
        </span>
    )
}

function RenderMapHeader(props) {

    return (
        <div className="left-control-map-title-container row no-gutters pt-2 pb-2 alignItems-baseline" style={{ background: props.clientSetting.color }}>
            <div className="col-8 pl-3">
                <h5> <img className="mr-2" src={require('../../../assets/icon/map.svg')} alt="map" /> Bản đồ</h5>
            </div>
            {!props.isLock && (
                <div className="col-4 text-right">
                    <img onClick={() => props.click()} className="setting mr-4" src={require('../../../assets/icon/settings.svg')} alt="setting" title="Thiết lập thông số chung" />
                </div>
            )}
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
