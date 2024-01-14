import { useState } from 'react'
import Service from '../../../api/api-service'
import { ApiUrl } from '../../../api/api-url'
import NotificationService from '../../../common/notification-service'

const service = new Service()
const useUpdateAccountPassword = ({ resetScreen = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateAccountPassword = async (data) => {
    if (!data) return
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }
    setIsLoading(true)

    try {
      const response = await service.post(
        ApiUrl.UpdateUserAccountPassword,
        payload,
      )
      response.content.status &&
        NotificationService.success('Đổi mật khẩu thành công')
      resetScreen()
    } catch (error) {
      NotificationService.error(error?.errorMessage ?? '')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleUpdateAccountPassword,
    isUpdating: isLoading,
  }
}

export default useUpdateAccountPassword
