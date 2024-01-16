import { useState } from 'react'
import Service from '../../../api/api-service'
import { ApiUrl } from '../../../api/api-url'
import NotificationService from '../../../common/notification-service'

const service = new Service()
const useUpdateAccountPassword = ({ resetScreen = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateAccountPassword = async (data) => {
    if (!data) return
    
    const formData = generateFormData(data);
    setIsLoading(true)

    try {
      const response = await service.post(
        ApiUrl.UpdateUserAccountPassword,
        formData,
      )
      response.content.status &&
        NotificationService.success('Đổi mật khẩu thành công')
      resetScreen()
    } catch (error) {
      NotificationService.error(error?.errorMessage ?? 'Đổi mật khẩu thất bại, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const generateFormData = (data, files) => {
    let formData = new FormData()
    formData.append('Id', data.id)
    formData.append('CurrentPassword', data.currentPassword)
    formData.append('NewPassword', data.newPassword)
    return formData
  }

  return {
    handleUpdateAccountPassword,
    isUpdating: isLoading,
  }
}

export default useUpdateAccountPassword
