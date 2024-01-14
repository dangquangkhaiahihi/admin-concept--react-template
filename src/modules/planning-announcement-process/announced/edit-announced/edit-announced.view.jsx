/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './edit-announced.scss';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ApiUrl } from '../../../../api/api-url';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { useHistory, useParams } from 'react-router-dom';
import ShowNotification from '../../../../components/react-notifications/react-notifications';
import {
  NotificationMessageType,
  APIUrlDefault,
  MaxSizeImageUpload,
} from '../../../../utils/configuration';

import * as viVN from '../../../../language/vi-VN.json';
import * as appActions from '../../../../core/app.store';
import * as statementAction from '../../../../redux/store/statement/statement.store';

//--- DropzoneArea
import { AttachFile, Description, PictureAsPdf } from '@material-ui/icons';
import * as configCommon from '../../../../common/config';

import FileManagement from '../../../../components/file_management/file_management';
import { UrlCollection } from '../../../../common/url-collection';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ShowNotificationError = (messages) => {
  ShowNotification(messages, NotificationMessageType.Error);
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: window.outerHeight - 365,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#00923F',
  },
  title: {
    marginLeft: theme.spacing(0),
    flex: 1,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function EditAnnounced(props) {
  const { showLoading, isOpen, onSuccess } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const planningId = id;

  const [statementStatusList, setStatementStatusList] = useState([]);
  const [statementStatus, setStatementStatus] = useState({ id: 1 });
  const [content, setContent] = useState();
  const [detailStatement, setDetailStatement] = useState();
  const [isShow, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const urlUploadImage = APIUrlDefault + ApiUrl.UrlUploadFromEditor;
  const isLock = useLocation().state.isLock;
  const { register, handleSubmit, errors, setError, clearErrors } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    onGetData();
  }, [planningId]);

  const onGetData = () => {
    showLoading(true);
    Promise.all([onGetStatementStatusLookup(), GetDetailStatement(planningId)])
      .then((res) => {
        const [statementStatusModel, detailStatementModel] = res;
        statementStatusModel &&
          statementStatusModel.content &&
          setStatementStatusList(statementStatusModel.content);
        detailStatementModel &&
          detailStatementModel.content &&
          setDetailStatement(detailStatementModel.content);
        setFiles(
          detailStatementModel.content && detailStatementModel.content.files
            ? [detailStatementModel.content.files]
            : []
        );

        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const onClose = () => {
    history.push({
      pathname: UrlCollection.PlanningAnnouncementProcess,
    });
  };

  const onGetStatementStatusLookup = () => {
    return new Promise((resolve, reject) => {
      statementAction.GetStatementStatusLookup().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };
  const GetDetailStatement = (id) => {
    return new Promise((resolve, reject) => {
      statementAction.GetDetailStatement(id).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
    });
  };

  const onChangeContent = (content) => {
    clearErrors(['content']);
    if (content === '<p><br></p>') {
      setError('content', { type: 'required' });
      setContent('');
    } else {
      clearErrors('content');
      setContent(content);
    }
  };

  const onSubmit = (data) => {
    if (!data) {
      return;
    }
    showLoading(true);
    statementAction
      .UpdateStatement({
        id: detailStatement.id,
        planningId: planningId,
        title: data.title,
        brief: data.description,
        content: data.content,
        numberOfDecisions: data.numberOfDecisions,
        approvalAgency: data.approvalAgency,
        issuedDate: new Date(),
        statementStatusId: statementStatus.id ? statementStatus.id : 1,
        yearOfStatement: data.yearOfStatement,
        DocumentUploadId:
          files && files.length > 0 && files[0] && files[0].fileId,
      })
      .then(
        (res) => {
          ShowNotification(
            'Thay đổi trạng thái công bố thành công',
            NotificationMessageType.Success
          );
          history.push({
            pathname: UrlCollection.PlanningAnnouncementProcess,
          });
          showLoading(false);
        },
        (err) => {
          showLoading(false);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
  };

  const onOpenSelectFile = () => {
    setShow(true);
    setFilesTemp(files);
  };

  const onCloseSelectFile = () => {
    setShow(false);
    setFiles(filesTemp);
  };

  const onSaveSelectFile = () => {
    setShow(false);
  };

  const handlePreviewIcon = (fileObject, classes) => {
    const { type } = fileObject.file;
    const iconProps = {
      className: classes.image,
    };

    switch (type) {
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <Description {...iconProps} />;
      case 'application/pdf':
        return <PictureAsPdf {...iconProps} />;
      default:
        return <AttachFile {...iconProps} />;
    }
  };

  return (
    <>
      {detailStatement ? (
        <div className='w-100'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='p-3'>
              <div className='form-group'>
                <label className='text-dark'>
                  Tiêu đề Công bố QH<span className='required'></span>
                </label>
                <TextField
                  fullWidth
                  inputRef={register({ required: true })}
                  type='text'
                  name='title'
                  defaultValue={detailStatement.title}
                  error={errors.title && errors.title.type === 'required'}
                />
                {errors.title && errors.title.type === 'required' && (
                  <span className='error'>Trường này là bắt buộc</span>
                )}
              </div>

              <div className='form-group'>
                <label className='text-dark'>
                  Tóm tắt<span className='required'></span>
                </label>
                <textarea
                  name='description'
                  rows='5'
                  defaultValue={detailStatement.brief}
                  ref={register({ required: true })}
                  maxLength={500}
                  className={
                    'form-control' +
                    (errors.description &&
                    errors.description.type === 'required'
                      ? ' is-invalid'
                      : '')
                  }></textarea>
                {errors.description &&
                  errors.description.type === 'required' && (
                    <span className='error'>Trường này là bắt buộc</span>
                  )}
              </div>

              <div className='form-group'>
                <label className='text-dark'>
                  Bài viết Công bố QH<span className='required'></span>
                </label>
                <SunEditor
                  enableToolbar={true}
                  showToolbar={true}
                  imageUploadSizeLimit={MaxSizeImageUpload}
                  videoFileInput={false}
                  setContents={detailStatement.content}
                  setOptions={{
                    height: 500,
                    imageUploadUrl: urlUploadImage,
                    imageUploadSizeLimit: MaxSizeImageUpload,
                    imageAccept: '.jpg,.jpeg,.png,.gift,.svg,.tif',
                    buttonList: [
                      [
                        'undo',
                        'redo',
                        'font',
                        'fontSize',
                        'formatBlock',
                        'paragraphStyle',
                        'blockquote',
                        'bold',
                        'underline',
                        'italic',
                        'strike',
                        'subscript',
                        'superscript',
                        'fontColor',
                        'hiliteColor',
                        'textStyle',
                        'removeFormat',
                        'outdent',
                        'indent',
                        'align',
                        'horizontalRule',
                        'list',
                        'lineHeight',
                        'table',
                        'link',
                        'image',
                        'video',
                        'audio',
                        'fullScreen',
                        'showBlocks',
                        'codeView',
                      ],
                    ],
                  }}
                  onChange={onChangeContent}
                  onBlur={(event, editorContents) =>
                    onChangeContent(editorContents)
                  }
                />
                <TextField
                  type='text'
                  inputRef={register({ required: true })}
                  name='content'
                  defaultValue={detailStatement.content}
                  className='d-none'
                  value={content}
                />
                {errors.content && errors.content.type === 'required' && (
                  <span className='error'>Trường này là bắt buộc</span>
                )}
              </div>

              <div className='form-group'>
                <label className='text-dark'>
                  Quyết định phê duyệt<span className='required'></span>
                </label>
                <TextField
                  fullWidth
                  inputRef={register({ required: true })}
                  type='text'
                  defaultValue={detailStatement.numberOfDecisions}
                  name='numberOfDecisions'
                  error={
                    errors.numberOfDecisions &&
                    errors.numberOfDecisions.type === 'required'
                  }
                />
                {errors.numberOfDecisions &&
                  errors.numberOfDecisions.type === 'required' && (
                    <span className='error'>Trường này là bắt buộc</span>
                  )}
              </div>

              {/* <div className="form-group">
                  <label className="text-dark">Nhập file</label>
                  <DropzoneArea className="dropzoneClass"
                    acceptedFiles={['.doc', '.docx', '.txt', '.pdf']}
                    showAlerts={false}
                    filesLimit={1}
                    maxFileSize={configCommon.Configs.fileDocument}
                    initialFiles={[config.APIUrlDefault + detailStatement.statementDocumentFile]}
                    getDropRejectMessage={(rejectedFile) => customMessages(rejectedFile)}
                    getFileLimitExceedMessage={(filesLimit) => ShowNotification(`Nhiều nhất ${filesLimit} file`, NotificationMessageType.Error)}
                    dropzoneText={"Chọn file"}
                    onChange={handleChange}
                    getPreviewIcon={handlePreviewIcon}
                    showFileNames={true}
                  />
                </div> */}

              <div className='form-group'>
                <label className='text-dark'>
                  Cơ quan phê duyệt<span className='required'></span>
                </label>
                <TextField
                  fullWidth
                  inputRef={register({ required: true })}
                  type='text'
                  name='approvalAgency'
                  defaultValue={detailStatement.approvalAgency}
                  error={
                    errors.approvalAgency &&
                    errors.approvalAgency.type === 'required'
                  }
                />
                {errors.approvalAgency &&
                  errors.approvalAgency.type === 'required' && (
                    <span className='error'>Trường này là bắt buộc</span>
                  )}
              </div>

              <div className='form-group'>
                <label className='text-dark'>
                  Trạng thái<span className='required'></span>
                </label>
                {statementStatusList &&
                  statementStatusList.length > 0 &&
                  detailStatement.statementStatusId && (
                    <Autocomplete
                      fullWidth
                      options={statementStatusList}
                      getOptionLabel={(option) => option.name}
                      value={
                        detailStatement.statementStatusId === 1
                          ? statementStatusList[0]
                          : statementStatusList[1]
                      }
                      onChange={(event, newValue) => {
                        setStatementStatus(newValue);
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name='statementStatus'
                          inputRef={register({ required: true })}
                          error={
                            errors.statementStatus &&
                            errors.statementStatus.type === 'required'
                          }
                        />
                      )}
                    />
                  )}
                {errors.statementStatus &&
                  errors.statementStatus.type === 'required' && (
                    <span className='error'>Trường này là bắt buộc</span>
                  )}
              </div>

              <div className='form-group'>
                <label className='text-dark'>
                  Năm công bố<span className='required'></span>
                </label>
                <TextField
                  fullWidth
                  inputRef={register({ required: true, maxLength: 4 })}
                  type='text'
                  name='yearOfStatement'
                  defaultValue={detailStatement.yearOfStatement}
                  error={
                    errors.yearOfStatement &&
                    errors.yearOfStatement.type === 'required'
                  }
                />
                {errors.yearOfStatement &&
                  ((errors.yearOfStatement.type === 'required' && (
                    <span className='error'>Trường này là bắt buộc</span>
                  )) ||
                    (errors.yearOfStatement.type === 'maxLength' && (
                      <span className='error'>Không được quá 4 ký tự</span>
                    )))}
              </div>

              <div className='form-group'>
                <label className='text-dark'>Nhập file quyết định</label>
                {!isShow &&
                  files &&
                  files.length > 0 &&
                  files.map((item) => (
                    <div key={item.fileName} style={{ width: '150px' }}>
                      <img
                        src={require('../../../../assets/icon/default.svg')}
                        alt={item.fileName}
                        title={item.fileName}
                        className='img-fluid mb-2'
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </div>
                  ))}
                <div>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={onOpenSelectFile}>
                    Chọn File
                  </Button>
                </div>
              </div>
            </div>
            <div className='text-right border-top pt-3 pr-2 pb-3'>
              <Button
                type='button'
                onClick={onClose}
                variant='contained'
                className={classes.button}
                startIcon={<CloseIcon />}>
                Thoát
              </Button>
              {!isLock && (
                <Button
                type='submit'
                color='primary'
                variant='contained'
                startIcon={<SaveIcon />}>
                Lưu
              </Button>
              )}
              
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className='text-danger text-center'>
            <HighlightOffIcon className='mt-n1 mr-1' />
            {'Không có bản ghi nào'}
          </div>
        </div>
      )}
      {isShow && (
        <Dialog
          onClose={onCloseSelectFile}
          open={isShow}
          fullWidth={true}
          maxWidth='md'
          className='dialog-preview-form'>
          <DialogTitle disableTypography>
            <Typography variant='h6'>Quản lý file</Typography>
            <IconButton
              aria-label='close'
              className={classes.closeButton}
              onClick={onCloseSelectFile}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FileManagement
              files={files}
              setFiles={setFiles}
              acceptedFiles={["doc", "docx", "txt", "pdf", "png", "jpg"]}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type='button'
              onClick={onCloseSelectFile}
              variant='contained'
              startIcon={<CloseIcon />}>
              Hủy
            </Button>
            {files && files.length > 0 && (
              <Button
                type='button'
                color='primary'
                variant='contained'
                startIcon={<SaveIcon />}
                onClick={onSaveSelectFile}>
                Lưu
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAnnounced);
