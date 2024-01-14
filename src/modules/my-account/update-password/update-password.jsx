import React from 'react'
import { useForm } from 'react-hook-form'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import SaveIcon from '@material-ui/icons/Save'
import useUpdateAccountPassword from '../hooks/useUpdateAccountPassword'

const formFields = {
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmNewPassword: 'confirmNewPassword',
}

const UpdatePassword = () => {
  const { handleSubmit, register, errors, setError, reset } = useForm()

  const { handleUpdateAccountPassword, isUpdating } = useUpdateAccountPassword({
    resetScreen: reset,
  })
  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmNewPassword)
      return setError(formFields.confirmNewPassword, {
        type: 'manual',
        message: 'Mật khẩu mới không khớp',
      })
    handleUpdateAccountPassword(data)
  }

  return (
    <Box position="relative">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Container>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box mb="1rem">
                <label className="text-dark">Mật khẩu hiện tại</label>
                <TextField
                  className="mb-2"
                  fullWidth
                  name={formFields.currentPassword}
                  defaultValue=""
                  type="password"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message ?? ''}
                  inputRef={register({ required: 'Trường này là bắt buộc' })}
                />
              </Box>
              <Box mb="1rem">
                <label className="text-dark">Mật khẩu mới</label>
                <TextField
                  fullWidth
                  name={formFields.newPassword}
                  defaultValue=""
                  type="password"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message ?? ''}
                  inputRef={register({ required: 'Trường này là bắt buộc' })}
                />
              </Box>
              <Box mb="1rem">
                <label className="text-dark">Xác nhận mật khẩu mới</label>
                <TextField
                  fullWidth
                  name={formFields.confirmNewPassword}
                  defaultValue=""
                  type="password"
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message ?? ''}
                  inputRef={register({ required: 'Trường này là bắt buộc' })}
                />
              </Box>
            </Grid>
            <Grid item />
          </Grid>
        </Container>
        <Box position="absolute" top="-4.5rem" right={0}>
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
    </Box>
  )
}

export default UpdatePassword
