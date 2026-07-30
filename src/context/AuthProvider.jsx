import { useState,  createContext } from "react";
export const AuthContext  = createContext(null)
export default function AuthProvider ({children}) {
    const [user, setUser] = useState(null)
    const [userName , setUserName] = useState("")
return(
    <AuthContext.Provider value={{user , setUser , userName , setUserName}}>
        {children}
    </AuthContext.Provider>
)
}