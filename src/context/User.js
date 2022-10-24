import {createContext, useEffect, useState} from 'react';
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const axiosPrivate = useAxiosPrivate();
    const [pgData, setPgData] = useState({});
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        console.log("UPDATE CONTEXT: PERMISSIONS");
        const controller = new AbortController();
        const getPermissions = async () => {
            try {
                const response = await axiosPrivate.get("permissions/");
                setPermissions(response.data);
            } catch (error) {
                if (error?.response?.status !== 403) {
                    console.log("Error getting logged user's permissions ", error);
                    errorNotif("Permissions", error.message);
                }
            }
        }
        getPermissions()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log("UPDATE CONTEXT: USER");
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get("utilisateur/");
                if (response.data) {
                    setPgData(response.data);
                } else {
                    errorNotif("Utilisateur", "Pas de PG activé correspondant");
                }
            } catch (error) {
                errorNotif("Utilisateur", error.message)
                console.log("Error getting consommateur", error);
            }
        }
        getUser();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <UserContext.Provider value={{pgData, permissions}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
