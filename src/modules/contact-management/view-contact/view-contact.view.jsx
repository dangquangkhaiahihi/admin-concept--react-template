import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Material Control
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  makeStyles,
  TextareaAutosize
} from "@material-ui/core";

//--- SunEditor
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

//--- Component
import * as contactAction from '../../../redux/store/contact/contact.store';
import * as appActions from "../../../core/app.store";
import ReplyEmailView from './reply-email.view';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function ViewContact(props) {
  const { showLoading, openAddDialog, onHideModal, contactId } = props;
  const [contactModel, setContactModel] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isShowReplyEmail, setShowReplyEmail] = useState(false);
  const [repliedContent, setRepliedContent] = useState(null);
  const [isReplied, setIsReplied] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    showLoading(true);
    contactAction.GetContactDetailByCode(contactId).then(res => {
      if (res && res.content) {
        setContactModel(res.content);
        res.content.sendFrom && setUserEmail(res.content.sendFrom);
        res.content.repliedContent && setRepliedContent(res.content.repliedContent)
        setIsReplied(res.content.isReplied)
      }
      showLoading(false);
    }).catch(rejects => { showLoading(false); console.log(rejects) })
  }, [])

  const handleClickOpenReplyView = () => {
    setShowReplyEmail(true);
  };
  const handleClickCloseFormTemplate = () => {
    setShowReplyEmail(false);
  };

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
            {"Xem thông tin liên hệ"}
          </Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onHideModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {contactModel ? <form>
          <DialogContent className="pt-4 pb-2" dividers>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Người gửi</label>
                  <TextField
                    type="text"
                    name="title"
                    className="w-100" defaultValue={contactModel.userName}
                    disabled
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Email người gửi</label>
                  <TextField
                    type="text"
                    name="code"
                    className="w-100"
                    defaultValue={contactModel.sendFrom}
                    color={"danger"}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">Số điện thoại</label>
                  <TextField
                    type="text"
                    name="code"
                    className="w-100"
                    defaultValue={contactModel.phoneNumber}
                    color={"danger"}
                    disabled
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <label className="text-dark">Tin nhắn</label><Link className="float-right"
                    variant="body2"
                    onClick={handleClickOpenReplyView}
                  >
                    {!contactModel.isReplied ? "Trả lời" : "Đã trả lời"}
                  </Link><div className="d-flex align-items-center mt-1">
                  </div>
                  <TextareaAutosize className="w-100" disabled={true} value={contactModel.message} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  {contactModel && contactModel.description && <div className="form-group">
                    <label className="text-dark">Mô tả</label>
                    <SunEditor enableToolbar={true} disable={true} showToolbar={true} setContents={contactModel.description} setOptions={{
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
                    }}
                    />
                  </div>}
                </div>
              </div>
            </div>
          </DialogContent>
        </form> : "Xảy ra lỗi trong hệ thống"}

      </Dialog>

      {isShowReplyEmail && (
        <ReplyEmailView
          isShow={isShowReplyEmail}
          setShow={handleClickCloseFormTemplate}
          isShowActionAddEdit={false}
          userEmail={userEmail}
          showLoading={showLoading}
          isReplied={isReplied}
          repliedContent={repliedContent}
          onHideModal={onHideModal}
          UserId= {contactId}
        />
      )}
    </div >
  )
}
const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewContact);