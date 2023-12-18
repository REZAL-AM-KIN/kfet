import {createContext, useCallback, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";
import {useCategorieList} from "../hooks/useCategorieList";

const CategorieContext = createContext({});

export const CategorieProvider = ({children}) => {
    const [categorie, setCategorieState] = useState("");
    const [catColor, setCatColorState] = useState("");

    const permissions = usePermissions();
    const usecategorielist = useCategorieList();

    // Override setCategorie and setCatColor to save the data in the localStorage
    // for later sessions
    const setCategorie = useCallback((catName) => {
        setCategorieState(catName);
        localStorage.setItem("categorie",catName);
        // eslint-disable-next-line
    },[]);

    const setCatColor = useCallback((color) => {
        setCatColorState(color);
        localStorage.setItem("catColor",color);
        // eslint-disable-next-line
    },[]);

    // function to update the color of the categorie
    const majColor = (listCategorie,catName) => {
        // console.log("MàJ de la couleur")
        listCategorie.forEach((line) => {
            if (line.nom === catName) {
                setCatColor(line.color);
            }
        });
    }

    // update the categories
    useEffect(() => {
        if (Object.keys(permissions).length) {
            // Set the categorie only if the user has permissions
            // console.log("permission trouvé! affectation de la catégorie")
            if (localStorage.getItem("categorie")) {
                // Check if the categorie is already in the localStorage
                setCategorie(localStorage.getItem("categorie"));
                majColor(usecategorielist.entitiesList,localStorage.getItem("categorie"));
            } else if (permissions.entities_manageable?.length) {
                // Check if the user has a categorie manageable
                setCategorie(permissions.entities_manageable[0]);
                majColor(usecategorielist.entitiesList,permissions.entities_manageable[0]);
            } else if (permissions.entities?.length) {
                // Check if the user has a categorie
                setCategorie(permissions.entities[0]);
                majColor(usecategorielist.entitiesList,permissions.entities[0]);
            }
        }
    // eslint-disable-next-line
    }, [permissions,usecategorielist.entitiesList])

    return (
        <CategorieContext.Provider value={{categorie:[categorie, setCategorie], catColor:[catColor, setCatColor]}}>
            {children}
        </CategorieContext.Provider>
    )
}

export default CategorieContext;
