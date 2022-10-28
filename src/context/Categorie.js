import {createContext, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";

const CategorieContext = createContext({});

export const CategorieProvider = ({children}) => {
    const [categorie, setCategorie] = useState("");
    const [catColor, setCatColor] = useState("#760076");

    const permissions = usePermissions();

    useEffect(() => {
        if (Object.keys(permissions).length) {
            // it means we are connected!
            if (permissions.ipIdentification.length) {
                setCategorie(permissions.ipIdentification[0]);
            } else {
                setCategorie(permissions.groupes[0]);
            }

        }
    }, [permissions])

    return (
        <CategorieContext.Provider value={{categorie:[categorie, setCategorie], catColor:[catColor, setCatColor]}}>
            {children}
        </CategorieContext.Provider>
    )
}

export default CategorieContext;
