import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InitMapStore from '../../../redux/store/init-map/init-map.store';
import ConfirmModalView from '../../../components/confirm-modal/confirm-modal';

function ResetMapDataLocalButton(props) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <React.Fragment>
            <ConfirmModalView
                open={openModal}
                content="Thao tác dưới đây sẽ xóa mọi dữ liệu ở bản đồ, nhưng thay đổi sẽ chỉ cập nhật vào cơ sở dữ liệu khi bạn ấn lưu. Tiếp tục?"
                handleClose={() => setOpenModal(false)}
                title="Xóa dữ liệu bản đồ"
                handleAccept={() => props.UpdateDefaultMapData(props.initMap.mapSetting.planing_id, props.initMap.mapSetting.id)} />
            <Button color="inherit" onClick={() => setOpenModal(true)}>
                Xóa dữ liệu
        </Button>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    initMap: state.initMap
})

const mapDispatchToProps = dispatch => bindActionCreators({
    UpdateDefaultMapData: InitMapStore.UpdateDefaultMapData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ResetMapDataLocalButton)