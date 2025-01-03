import { createContext, useState } from 'react'

export const UserContext = createContext()

export const UserProvider = ({children}) => {

    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)

    const userInfo = JSON.parse(sessionStorage.getItem('user'))

    if(!user && userInfo){
        setUser(userInfo)
    }

    const value = {
        user, setUser,
        loading, setLoading
    }

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    )
}