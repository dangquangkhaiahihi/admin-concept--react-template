import React from 'react'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'

import FileManagement from '../../../components/file_management/file_management'

const AvatarUploadModal = ({
  onSaveSelectFile,
  onCloseSelectFile,
  isShow,
  files,
  setFiles,
}) => {
  return (
    <Dialog
      onClose={onCloseSelectFile}
      open={isShow}
      fullWidth={true}
      maxWidth="md"
      className="dialog-preview-form"
    >
      <DialogTitle disableTypography>
        <Typography variant="h6">Quản lý file</Typography>
        <IconButton aria-label="close" onClick={onCloseSelectFile}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FileManagement
          files={files}
          setFiles={setFiles}
          acceptedFiles={['jpeg', 'png', 'jpg', 'gif']}
        />
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          onClick={onCloseSelectFile}
          variant="contained"
          startIcon={<CloseIcon />}
        >
          Hủy
        </Button>
        {files && files.length > 0 && (
          <Button
            type="button"
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSaveSelectFile}
          >
            Lưu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AvatarUploadModal
