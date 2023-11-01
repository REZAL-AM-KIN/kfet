import {createContext, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";

const CategorieContext = createContext({});

export const CategorieProvider = ({children}) => {
    const [categorie, setCategorie] = useState("");
    const [catColor, setCatColor] = useState("");

    const permissions = usePermissions();

    useEffect(() => {
        if (Object.keys(permissions).length) {
            // it means we are connected!
            if (permissions.entities_manageable.length) {
                setCategorie(permissions.entities_manageable[0]);
            } else if (permissions.entities.length) {
                setCategorie(permissions.entities[0]);
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
