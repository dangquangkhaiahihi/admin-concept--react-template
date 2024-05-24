import React, { useEffect} from 'react'
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
import { useUpdateUserInfoContext } from '../context/BottomPanelContext'

const UpdateMyAccount = () => {
  const updateUserInfoContext = useUpdateUserInfoContext();
  
  const {
    control,
    register,
    handleSubmit,
    setValue,
    errors,
    resetScreen,
    userInfo,
    handleFileChange
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

  useEffect (()=> {
    if(!userInfo) {
      return;
      }
    console.log("userInfo", userInfo)
    //updateUserInfoContext(userInfo.id)
  }, [userInfo])

  return (
    <Box position="relative">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <TextField
          type="text"
          name={formFields.id}
          className="w-100"
          inputRef={register({ required: true, maxLength: 50 })}
          hidden
        />
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
                  inputProps={
					{ readOnly: true, }
				}
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

            {/* <Grid container item spacing={2}>
              <Grid item xs={12}>
                <label className="text-dark">Mô tả</label>
                <TextareaAutosize
                  name={formFields.description}
                  rowsMin={3}
                  className={'form-control'}
                  // ref={register()}
                  {...register("description")}
                />
              </Grid>
            </Grid> */}

            <Grid container item spacing={2}>
              <Grid item>
                <label className="text-dark">
                  Ảnh<span className="required"></span>
                </label>
                {/* <div>
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
                  {
                    !(!isShow &&
                    files &&
                    files.length > 0) &&
                      <img
                        id="previewImage"
                        src={`https://sonladev-api.cgis.asia${userInfo?.avatar}`}
                        // onError={(e) =>
                        //   (e.target.src =
                        //     process.env.PUBLIC_URL + '/logo.png')
                        // }
                        alt='logo'
                        className='logo'
                      />
                  }
                </div> */}
                <img
                  id="previewImage"
                  src={`${APIUrlDefault}${userInfo?.avatar}`}
                  // onError={(e) =>
                  //   (e.target.src =
                  //     process.env.PUBLIC_URL + '/logo.png')
                  // }
                  alt='logo' width='100px'
                  className='logo'
                />
                <div className='mt-3'>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=> {
                      const inputForm = document.getElementById('input-form'); 
                      if (inputForm) inputForm.click();
                    }}>
                    Chọn file
                  </Button>
                  <TextField
                    name={formFields.file}
                    id="input-form"
                    type="file"
                    onChange={handleFileChange}
                    hidden
                    {...register("file")}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Box>  {/* position="absolute" top="-3.5rem" right={0} */}
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
        </Container>
        
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
