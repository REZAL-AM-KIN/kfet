import { createContext, useState } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [pgData, setPgData] = useState({});
    const [permissions, setPermissions] = useState({});

    return (
        <UserContext.Provider value={{pgData, permissions}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
