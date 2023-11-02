import {createContext, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";
import {useCategorieList} from "../hooks/useCategorieList";

const CategorieContext = createContext({});

export const CategorieProvider = ({children}) => {
    const [categorie, setCategorie] = useState("");
    const [catColor, setCatColor] = useState("");

    const permissions = usePermissions();
    const usecategorielist = useCategorieList();

    const majColor = (listCategorie,catName) => {
        // console.log("MàJ de la couleur")
        listCategorie.forEach((line) => {
            if (line.nom === catName) {
                setCatColor(line.color);
            }
        });
    }

    useEffect(() => {
        if (Object.keys(permissions).length) {
            // console.log("permission trouvé! affectation de la catégorie")
            if (permissions.entities_manageable.length) {
                setCategorie(permissions.entities_manageable[0]);
                majColor(usecategorielist.entitiesList,permissions.entities_manageable[0]);
            } else if (permissions.entities.length) {
                setCategorie(permissions.entities[0]);
                majColor(usecategorielist.entitiesList,permissions.entities[0]);
            }
        }
    }, [permissions,usecategorielist.entitiesList])

    return (
        <CategorieContext.Provider value={{categorie:[categorie, setCategorie], catColor:[catColor, setCatColor]}}>
            {children}
        </CategorieContext.Provider>
    )
}

export default CategorieContext;
