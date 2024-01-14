import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import useMyAccountTabs, { MY_ACCOUNT_TAB } from './hooks/useMyAccountTabs'
import AccountUpdate from './update-my-account/update-my-account.view'
import PasswordUpdate from './update-password/update-password'
import Paper from '@material-ui/core/Paper'

const MAPPED_MY_ACCOUNT = {
  [MY_ACCOUNT_TAB.accountInfo]: <AccountUpdate />,
  [MY_ACCOUNT_TAB.changePassword]: <PasswordUpdate />,
}

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

const MyAccount = (props) => {
  const { currentTab, tabIndex, handleChangeTab } = useMyAccountTabs()

  return (
    <>
      <Tabs
        orientation={`${props.isTabletOrMobile ? 'vertical' : 'horizontal'}`}
        value={tabIndex}
        aria-label="My account vertical tabs"
      >
        {tabs.map(({ label, tab }, index) => (
          <Tab key={index} label={label} onClick={() => handleChangeTab(tab)} style={props.isTabletOrMobile ? {alignSelf: 'flex-start'} : {}}/>
        ))}
      </Tabs>
      <Paper className="m-2 p-4">{MAPPED_MY_ACCOUNT[currentTab]}</Paper>
    </>
  )
}

export default MyAccount
