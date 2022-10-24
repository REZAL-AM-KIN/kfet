import { useContext } from 'react';
import UserContext from '../context/User';

export const useUser = () => {
    return useContext(UserContext);
}

export const usePermissions = () => {
    return useContext(UserContext);
}