/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './add-announced.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ApiUrl } from '../../../../api/api-url';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import ShowNotification from '../../../../components/react-notifications/react-notifications';
import {
  NotificationMessageType,
  MaxSizeImageUpload,
  APIUrlDefault,
} from '../../../../utils/configuration';

import * as viVN from '../../../../language/vi-VN.json';
import * as appActions from '../../../../core/app.store';
import * as statementAction from '../../../../redux/store/statement/statement.store';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Typography,
  IconButton,
} from '@material-ui/core';

import FileManagement from '../../../../components/file_management/file_management';

function CreateAnnounced(props) {
  const { showLoading, planningId, planning, onClose, onSuccess, classes } =
    props;

  const [statementStatusList, setStatementStatusList] = useState([]);
  const [statementStatus, setStatementStatus] = useState(null);
  const [content, setContent] = useState();
  const [isShow, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesTemp, setFilesTemp] = useState([]);
  const urlUploadImage = APIUrlDefault + ApiUrl.UrlUploadFromEditor;
  const { register, handleSubmit, errors, setError, clearErrors, setValue } =
    useForm({
      mode: 'all',
      reValidateMode: 'onBlur',
    });

  useEffect(() => {
    onGetData();
  }, [planningId]);

  const onGetData = () => {
    showLoading(true);
    Promise.all([onGetStatementStatusLookup()])
      .then((res) => {
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  const onGetStatementStatusLookup = () => {
    return new Promise((resolve, reject) => {
      statementAction.GetStatementStatusLookup().then(
        (res) => {
          if (res && res.content && res.content.length > 0) {
            setStatementStatusList(res.content);
            setStatementStatus(res.content[0]);
          }
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
      .CreateStatement({
        id: 0,
        planningId: planningId,
        title: data.title,
        brief: data.brief,
        content: data.content,
        numberOfDecisions: data.numberOfDecisions,
        issuedDate: new Date(),
        approvalAgency: data.approvalAgency,
        statementStatusId: statementStatus.id,
        yearOfStatement: data.yearOfStatement,
        DocumentUploadId:
          files && files.length > 0 && files[0] && files[0].fileId,
      })
      .then(
        (res) => {
          ShowNotification(
            'Công bố thành công',
            NotificationMessageType.Success
          );
          onSuccess();
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

  return (
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
            name='brief'
            rows='5'
            ref={register({ required: true })}
            maxLength={500}
            className={
              'form-control' +
              (errors.brief && errors.brief.type === 'required'
                ? ' is-invalid'
                : '')
            }></textarea>
          {errors.brief && errors.brief.type === 'required' && (
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
            videoFileInput={false}
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
            onBlur={(event, editorContents) => onChangeContent(editorContents)}
          />
          <TextField
            type='text'
            inputRef={register({ required: true })}
            name='content'
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
            type='text'
            name='numberOfDecisions'
            defaultValue={(planning && planning.report) || ''}
            inputRef={register({ required: true })}
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

        <div className='form-group'>
          <label className='text-dark'>
            Cơ quan phê duyệt<span className='required'></span>
          </label>
          <TextField
            fullWidth
            inputRef={register({ required: true })}
            type='text'
            name='approvalAgency'
            defaultValue={(planning && planning.planningAgency) || ''}
            error={
              errors.approvalAgency && errors.approvalAgency.type === 'required'
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
          {statementStatusList && statementStatusList.length > 0 && (
            <Autocomplete
              fullWidth
              options={statementStatusList}
              getOptionLabel={(option) => option.name}
              value={statementStatusList[0]}
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
            error={
              errors.yearOfStatement &&
              (errors.yearOfStatement.type === 'required' ||
                errors.yearOfStatement.type === 'maxLength')
            }
            onChange={(e) =>
              setValue('yearOfStatement', e.target.value.replace(/[^0-9]/g, ''))
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
          Hủy
        </Button>
        <Button
          type='submit'
          color='primary'
          variant='contained'
          startIcon={<SaveIcon />}>
          Lưu
        </Button>
      </div>
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
    </form>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(CreateAnnounced);
