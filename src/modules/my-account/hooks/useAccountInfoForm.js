import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Service from '../../../api/api-service'
import { ApiUrl } from '../../../api/api-url'
import dateformat from "dateformat";
import dateFormat from 'dateformat';

export const formFields = {
  fullName: 'fullName',
  email: 'email',
  gender: 'gender',
  birthDay: 'birthDay',
  phone: 'phone',
  address: 'address',
  description: 'description',
  avatar: 'avatar',
}
export const genderDropdown = [
  {
    label: 'Nam',
    value: true,
  },
  {
    label: 'Nữ',
    value: false,
  },
]

const defaultValues = {
  fullName: '',
  email: '',
  gender: true,
  birthDay: new Date(),
  phone: '',
  address: '',
  description: '',
  avatar: '',
}

const service = new Service()
const useAccountInfoForm = () => {
  const [user, setUser] = useState(null)
  const { handleSubmit, register, errors, setValue, control, reset } = useForm({
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    getUserAccountDetailData()
  }, [])

  useEffect(() => {
    if (!user) return
    resetUserInfoForm(user, reset)
  }, [user, reset])

  const getUserAccountDetailData = async () => {
    const data = await service.get(ApiUrl.GetUserAccountDetail)
    if (!data || !data.content) return
    setUser(data.content)
  }

  const resetUserInfoForm = (user, reset) => {
    const birthDay =new Date(user?.dateOfBirth).getTime()
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      gender: user?.sex ?? '',
      birthDay,
      phone: user?.phoneNumber ?? '',
      address: user?.address ?? '',
      description: user?.description ?? '',
      avatar: user?.avatar ?? '',
    })
  }

  return {
    handleSubmit,
    control,
    register,
    errors,
    setValue,
    resetScreen: getUserAccountDetailData
  }
}

export default useAccountInfoForm
