import { useContext } from 'react';
import UserContext from '../context/User';

export function useUser() {
    return useContext(UserContext)["pgData"];
}

export function usePermissions() {
    return useContext(UserContext)["permissions"];
}

export function useIsLogged() {
    return useContext(UserContext)["isLogged"];
}