import React, { useEffect, useState } from "react";

//--- Material Control
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    makeStyles,
    TextareaAutosize
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import dateformat from "dateformat";
//--- SunEditor
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

//--- Component
// import * as contactAction from '../../../redux/store/contact/contact.store'
import * as emailGeneratedAction from '../../../redux/store/email-generated/email-generated.store'

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function EmailGeneratedViewDetail(props) {
    const { openAddDialog, onHideModal, emailId } = props;
    const [emailGeneratedModel, setEmailGeneratedModel] = useState();

    const classes = useStyles();

    useEffect(() => {
        emailGeneratedAction.GetDetailEmailGenerated(emailId).then(res => res && res.content && setEmailGeneratedModel(res.content)).catch(rejects => console.log(rejects))
    }, [])


    return (
        <div>
            <Dialog
                open={openAddDialog}
                onClose={onHideModal}
                aria-labelledby="alert-dialog-title"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="h6">
                        {"Xem thông tin chi tiết"}
                    </Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onHideModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {emailGeneratedModel ? <form>
                    <DialogContent className="pt-4 pb-2" dividers>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Tiêu đề</label>
                                    <TextField
                                        type="text"
                                        name="title"
                                        className="w-100" defaultValue={emailGeneratedModel.title}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Loại email</label>
                                    <TextField
                                        type="text"
                                        name="code"
                                        className="w-100"
                                        defaultValue={emailGeneratedModel.emailType}
                                        color={"danger"}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Tên loại</label>
                                    <TextField
                                        type="text"
                                        name="code"
                                        className="w-100"
                                        defaultValue={emailGeneratedModel.referenceTypeName}
                                        color={"danger"}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Ngày gửi</label>
                                    <TextField
                                        type="text"
                                        name="title"
                                        className="w-100" defaultValue={dateformat(emailGeneratedModel.sentDate, "dd/mm/yyyy hh:MM:ss")}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Liên hệ</label>
                                    <TextField
                                        type="text"
                                        name="code"
                                        className="w-100"
                                        defaultValue={emailGeneratedModel.subject}
                                        color={"danger"}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Code</label>
                                    <TextField
                                        type="text"
                                        name="title"
                                        className="w-100" defaultValue={emailGeneratedModel.code}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <label className="text-dark">Tin nhắn lỗi</label>
                                    <TextField
                                        type="text"
                                        name="code"
                                        className="w-100"
                                        defaultValue={emailGeneratedModel.errorMessage}
                                        color={"danger"}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
              <label className="text-dark">Mô tả<span className="required"></span></label>
              <SunEditor enableToolbar={true} showToolbar={true} setOptions={{
                height: 500,
                buttonList: [
                  ['undo', 'redo',
                    'font', 'fontSize', 'formatBlock',
                    'paragraphStyle', 'blockquote',
                    'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
                    'fontColor', 'hiliteColor', 'textStyle',
                    'removeFormat',
                    'outdent', 'indent',
                    'align', 'horizontalRule', 'list', 'lineHeight',
                    'table', 'link', 'image', 'video', 'audio',
                    'fullScreen', 'showBlocks', 'codeView']
                ]

              }} setContents={emailGeneratedModel.description} disable={true} />
            </div>
                    </DialogContent>
                </form> : "Xảy ra lỗi trong hệ thống"}

            </Dialog>
        </div >
    )
}
export default EmailGeneratedViewDetail