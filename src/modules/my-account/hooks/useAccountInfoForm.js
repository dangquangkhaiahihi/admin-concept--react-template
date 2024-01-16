import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Service from '../../../api/api-service'
import { ApiUrl } from '../../../api/api-url'
import dateformat from "dateformat";
import dateFormat from 'dateformat';

export const formFields = {
  id: 'id',
  fullName: 'fullName',
  email: 'email',
  gender: 'gender',
  birthDay: 'birthDay',
  phone: 'phone',
  address: 'address',
  description: 'description',
  avatar: 'avatar',
  file: 'file',
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
  id: '',
  fullName: '',
  email: '',
  gender: true,
  birthDay: new Date(),
  phone: '',
  address: '',
  description: '',
  avatar: '',
  file: null,
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
    console.log("check user", user);
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
      id: user?.id ?? '',
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      gender: user?.sex ?? '',
      birthDay,
      phone: user?.phoneNumber ?? '',
      address: user?.address ?? '',
      description: user?.description ?? '',
      avatar: user?.avatar ?? '',
      file: user?.file ?? null,
    })
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("cascacascascascas", selectedFile);
    setUser({...user, file: selectedFile})
  };

  return {
    handleSubmit,
    control,
    register,
    errors,
    setValue,
    resetScreen: getUserAccountDetailData,
    userInfo: user,
    handleFileChange
  }
}

export default useAccountInfoForm
