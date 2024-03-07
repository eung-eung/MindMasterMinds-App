import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthConText = createContext({
    accessToken: '',
    refreshToken: '',
    isAuthenticated: false,
    authenticate: (token) => { },
    logout: () => { }
})

export default function AuthConTextProvider({ children }) {
    const [authToken, setAuthToken] = useState()



    const authenticate = async (token) => {
        setAuthToken(token)
        await AsyncStorage.setItem('token', token)
    }

    const logout = () => {
        AsyncStorage.removeItem('token')
        setAuthToken(null)
    }
    const value = {
        accessToken: authToken,
        authenticate,
        logout,
        isAuthenticated: !!authToken
    }
    return <AuthConText.Provider value={value}>{children}</AuthConText.Provider>
}