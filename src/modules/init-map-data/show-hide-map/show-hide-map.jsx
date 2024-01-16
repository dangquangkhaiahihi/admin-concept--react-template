import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from "../../../core/app.store";
//import * as InitMapStore from '../../../redux/store/init-map/init-map.store';
import * as ShowMap from '../../../redux/store/init-map/show-hide-map.store';

function ShowHideMap(props) {
    // const [isActive, setIsActive] = useState(false);
    const {isActive, setIsActive} = {...props};

    const ActiveMap = (id = props.mapId) => {
        ShowMap.ActiveMapById(id).then((res) => {
        })
    }

    const DeactiveMap = (id = props.mapId) => {
        ShowMap.DeActiveMapById(id).then((res) => {
        })
    }
    const setActiveMap = () => {
        ActiveMap();
        setIsActive((prev) => !prev);
    }
    const setDeactiveMap = () => {
        DeactiveMap();
        setIsActive((prev) => !prev);
    }

    return (

        isActive ? (<Button color="inherit" onClick={() => setDeactiveMap()}>
            Ẩn bản đồ
        </Button>) : (<Button color="inherit" onClick={() => setActiveMap()}>
            Hiện bản đồ
        </Button>)

    )
}

const mapStateToProps = state => ({
    initMap: state.initMap
})

const mapDispatchToProps = dispatch => bindActionCreators({
    showLoading: appActions.ShowLoading,
    // UpdateMapSetting: InitMapStore.UpdateMapSetting,
    // ActiveMapById: InitMapStore.ActiveMapById,
    // DeactiveMapById: InitMapStore.DeactiveMapById
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShowHideMap)