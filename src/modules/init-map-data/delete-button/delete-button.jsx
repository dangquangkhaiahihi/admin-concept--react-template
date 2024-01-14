import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MapAction from '../../../redux/store/init-map/mapping-data';
import ConfirmModalView from '../../../components/confirm-modal/confirm-modal';
import * as appActions from "../../../core/app.store";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

function DeleteButton(props) {
    const [openModal, setOpenModal] = useState(false);

    const DeleteMapById = (id = props.mapId) => {
        if(!id) return;
        props.showLoading(true);
        MapAction.DeleteMapById(id).then((res) => {
            if (res) {
                props.closeModalMap();
                ShowNotification(
                    viVN.Success.DeleteMapSuccess,
                    NotificationMessageType.Success
                );
            }
            props.showLoading(false);
        }).catch((err) => {
            props.showLoading(false);
            ShowNotification(
                viVN.Errors[err.errorType],
                NotificationMessageType.Error
            );
        })
    }

    return (
        <React.Fragment>
            <ConfirmModalView
                open={openModal}
                content="Thao tác dưới đây sẽ xóa bản đồ, nhưng thay đổi sẽ chỉ cập nhật vào cơ sở dữ liệu khi bạn ấn lưu. Tiếp tục?"
                handleClose={() => setOpenModal(false)}
                title="Xóa bản đồ"
                handleAccept={DeleteMapById} />
            <Button color="inherit" onClick={() => setOpenModal(true)}>
                Xóa Bản Đồ
        </Button>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    initMap: state.initMap
})

const mapDispatchToProps = dispatch => bindActionCreators({
    showLoading: appActions.ShowLoading,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DeleteButton)