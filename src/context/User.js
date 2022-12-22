import {createContext, useEffect, useState} from 'react';
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserContext = createContext({});

export const UserProvider = ({children}) => {
    const axiosPrivate = useAxiosPrivate();
    const [isLogged, setIsLogged] = useState(false);
    const [pgData, setPgData] = useState({});
    const [permissions, setPermissions] = useState({});


    if (!!sessionStorage.getItem("access") && !isLogged) {
        // to avoid too many renders, we need to test true and not assign to true
        // we also need to test if it hasn't already been set (avoid renders again..)
        setIsLogged(true);
    }

    useEffect(() => {
        // the isLogged state changed so we need to update the rest accordingly
        if (isLogged) {
            const controller = new AbortController();
            getUser();
            getPermissions();
            return () => {
                controller.abort();
            }
        } else {
            setPgData({});
            setPermissions({});
        }
        // eslint-disable-next-line
    }, [isLogged])

    const getUser = async () => {
        console.log("UPDATE CONTEXT: USER");
        try {
            const response = await axiosPrivate.get("utilisateur/");
            if (response.data) {
                setPgData(response.data);
            } else {
                errorNotif("Utilisateur", "Pas de PG activé correspondant à l'utilisateur");
            }
        } catch (error) {
            console.log("Error getting utilisateur", error);
        }
    }
    const getPermissions = async () => {
        console.log("UPDATE CONTEXT: PERMISSIONS");
        try {
            const response = await axiosPrivate.get("permissions/");
            setPermissions(response.data);
        } catch (error) {
            if (error?.response?.status !== 403) {
                errorNotif("Permissions", error.message);
            }
        }
    }

    return (
        <UserContext.Provider value={{pgData, permissions, isLogged}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
