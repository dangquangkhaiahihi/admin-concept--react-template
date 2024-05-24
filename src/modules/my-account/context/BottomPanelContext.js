import React, { useState, useContext } from "react";

const UserInfoContext = React.createContext();
const UpdateUserInfoContext = React.createContext();

export function UserInfoProvider({children}) {
    const [userId, setUserId] = useState('');
    
    return (
        <UserInfoContext.Provider value={userId}>
            <UpdateUserInfoContext.Provider value={(val) => setUserId(val)}>
                {children}
            </UpdateUserInfoContext.Provider>
        </UserInfoContext.Provider>
    )
}

export function useUserInfo() {
    return useContext(UserInfoContext);
}

export function useUpdateUserInfoContext() {
    return useContext(UpdateUserInfoContext);
}
