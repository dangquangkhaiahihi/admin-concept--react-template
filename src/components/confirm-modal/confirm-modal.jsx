import React from 'react';
import * as MaterialUi from '@material-ui/core';

export default function ConfirmModalView(props) {
    const ConfirmTitle = props.title || null;
    const ConfirmContent = props.content || "Bạn có chắc muốn tiếp tục?";

    const handleAccept = () => {
        if (props.handleAccept) props.handleAccept();
        props.handleClose()
    }
    return (
        <MaterialUi.Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {
                ConfirmTitle && <MaterialUi.DialogTitle id="alert-dialog-title">{ConfirmTitle}</MaterialUi.DialogTitle>
            }
            <MaterialUi.DialogContent dividers>
                <MaterialUi.DialogContentText id="alert-dialog-description" className="mb-0">
                    {ConfirmContent}
                </MaterialUi.DialogContentText>
            </MaterialUi.DialogContent>
            <MaterialUi.DialogActions className="justify-content-center mt-2 mb-2">
                <MaterialUi.Button variant="contained" onClick={props.handleClose}>
                    Hủy
                </MaterialUi.Button>
                <MaterialUi.Button variant="contained" onClick={handleAccept} color="primary" className="ml-2">
                    Tiếp tục
                </MaterialUi.Button>
            </MaterialUi.DialogActions>
        </MaterialUi.Dialog>
    )
}
