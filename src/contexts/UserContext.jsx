import {createContext, useState} from "react";

export const UserContext = createContext()

export const UserProvider = ({children})=>{
    const isSuperUser = useState(false)
    const groups = useState([])
    const ipIdentification = useState([])
    const canRecharge = useState(false)

    return (
        <UserContext.Provider value={{isSuperUser, groups, ipIdentification, canRecharge}}>
            {children}
        </UserContext.Provider>
    );
}