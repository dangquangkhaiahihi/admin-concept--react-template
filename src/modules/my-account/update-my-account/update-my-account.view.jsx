import React from 'react'
import { Controller } from 'react-hook-form'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import SaveIcon from '@material-ui/icons/Save'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import AvatarUploadModal from '../avatar-upload-modal/avatar-upload-modal'
import useAccountInfoForm, {
  formFields,
  genderDropdown,
} from '../hooks/useAccountInfoForm'
import useSelectFiles from '../hooks/useSelectFiles'
import useUpdateAccountInfo from '../hooks/useUpdateAccountInfo'
import { APIUrlDefault } from '../../../utils/configuration'

const UpdateMyAccount = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    errors,
    resetScreen
  } = useAccountInfoForm()

  const {
    isShow,
    onCloseSelectFile,
    onOpenSelectFile,
    onSaveSelectFile,
    files,
    setFiles,
  } = useSelectFiles()

  const { handleUpdateAccountInfo: onSubmit, isUpdating } = useUpdateAccountInfo({
    files,
    resetScreen
  })


  return (
    <Box position="relative">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Container>
          <Grid container spacing={4}>
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <label className="text-dark">
                  Họ và tên<span className="required"></span>
                </label>
                <TextField
                  type="text"
                  name={formFields.fullName}
                  className="w-100"
                  inputRef={register({ required: true, maxLength: 50 })}
                  error={errors.fullName && errors.fullName.type === 'required'}
                />
                {errors.fullName && errors.fullName.type === 'required' && (
                  <span className="error">Trường này là bắt buộc</span>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <label className="text-dark">Email</label>
                <TextField
                  type="text"
                  name={formFields.email}
                  className="w-100"
                  inputRef={register()}
                  disabled
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <label className="text-dark">Ngày sinh</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Controller
                    render={({ ref, onChange, value, onBlur }) => (
                      <DatePicker
                        id="dateTime"
                        inputRef={ref}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        format="dd/MM/yyyy"
                        fullWidth
                        showTodayButton={true}
                        error={
                          errors.startDate &&
                          errors.startDate.type === 'required'
                        }
                      />
                    )}
                    name={formFields.birthDay}
                    control={control}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <label className="text-dark">Giới tính</label>
                <br />
                <Controller
                  name={formFields.gender}
                  control={control}
                  render={({ onChange, value }) => (
                    <Select value={value} onChange={onChange}>
                      {genderDropdown.map(({ label, value }, index) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <label className="text-dark">Số điện thoại</label>
                <TextField
                  type="text"
                  name={formFields.phone}
                  className="w-100"
                  inputRef={register()}
                  onChange={(e) =>
                    setValue(
                      'phoneNumber',
                      e.target.value.replace(/[^0-9]/g, ''),
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <label className="text-dark">Địa chỉ</label>
                <TextField
                  inputRef={register()}
                  type="text"
                  name={formFields.address}
                  className="w-100"
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <label className="text-dark">Mô tả</label>
                <TextareaAutosize
                  name={formFields.description}
                  rowsMin={3}
                  className={'form-control'}
                  ref={register()}
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item>
                <label className="text-dark">
                  Ảnh<span className="required"></span>
                </label>
                {!isShow &&
                  files &&
                  files.length > 0 &&
                  files.map((item) => (
                    <div key={item.fileName} style={{ width: '150px' }}>
                      <img
                        src={APIUrlDefault + item.filePreview}
                        alt={item.fileName}
                        title={item.fileName}
                        className="img-fluid mb-2"
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
                    variant="contained"
                    color="primary"
                    onClick={onOpenSelectFile}
                  >
                    Chọn file
                  </Button>
                  <TextField
                    inputRef={register({ required: true })}
                    type="hidden"
                    name={formFields.avatar}
                    value={
                      (files && files.length > 0 && files[0].fileName) || ''
                    }
                  />
                  {errors.avatar && errors.avatar.type === 'required' && (
                    <p className="error">Trường này là bắt buộc</p>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box position="absolute" top="-3.5rem" right={0}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isUpdating}
          >
            Lưu
          </Button>
        </Box>
      </form>

      <AvatarUploadModal
        isShow={isShow}
        files={files}
        setFiles={setFiles}
        onSaveSelectFile={onSaveSelectFile}
        onCloseSelectFile={onCloseSelectFile}
      />
    </Box>
  )
}

export default UpdateMyAccount
