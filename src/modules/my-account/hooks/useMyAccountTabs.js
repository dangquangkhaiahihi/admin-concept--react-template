import { useState } from 'react'

export const MY_ACCOUNT_TAB = {
  accountInfo: 'accountInfo',
  changePassword: 'changePassword',
}

const useMyAccountTabs = () => {
  const [tab, setTab] = useState(MY_ACCOUNT_TAB.accountInfo)

  const handleChangeTab = (tab) => setTab(tab)

  const tabs = [
    {
      label: 'Thông tin tài khoản',
      tab: MY_ACCOUNT_TAB.accountInfo,
    },
    {
      label: 'Thay đổi mật khẩu',
      tab: MY_ACCOUNT_TAB.changePassword,
    },
  ]

  const currentTabIndex = tabs.findIndex((tabs) => tabs.tab === tab)

  return {
    currentTab: tab,
    tabIndex: currentTabIndex,
    handleChangeTab,
  }
}

export default useMyAccountTabs
