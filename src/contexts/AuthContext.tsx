import React, { useState, useEffect, useContext } from 'react'

const AuthContext = React.createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const contextValue = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
  }

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  )
}
