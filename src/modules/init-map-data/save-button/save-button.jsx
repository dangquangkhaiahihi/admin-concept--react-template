import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../redux/store/init-map/init-map.store';
import * as InitMapConfig from '../config/config';
import ConfirmModalView from '../../../components/confirm-modal/confirm-modal';
import NotificationService from '../../../common/notification-service';

function SaveDataToDataBaseButton(props) {
    const [openModal, setOpenModal] = useState(false);
    const handleSaveMap = async () => {
        if (props.initMap.mapSetting.name) {
            const MapDataUpdate = InitMapConfig.ConverDataFromStoreToCreateMapUpdateObject(props.initMap);
            if (MapDataUpdate.id) { if (await props.UpdateMap(MapDataUpdate)) props.handleClick(); } else { if (await props.PostCreateMap(MapDataUpdate)) props.handleClick(); }
        } else NotificationService.error('Tên bản đồ không được để trống')
    }

    return (
        <React.Fragment>
            <ConfirmModalView open={openModal} handleClose={() => setOpenModal(false)} title="Lưu bản đồ" handleAccept={() => handleSaveMap()} />
            <Button color="inherit" onClick={() => setOpenModal(true)}>
                Lưu
            </Button>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    initMap: state.initMap
})

const mapDispatchToProps = dispatch => bindActionCreators({
    UpdateMap: InitMapStore.PutUpdateMap,
    PostCreateMap: InitMapStore.PostCreateMap,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SaveDataToDataBaseButton)