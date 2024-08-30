import {createContext, useCallback, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";
import {useEntity} from "../hooks/useEntity";

const EntiteContext = createContext({});

export const EntiteProvider = ({children}) => {

    const [entite, setEntiteState] = useState({
        id: null,
        nom: "",
        color: "",
        description: ""
    });

    const permissions = usePermissions();
    const entity = useEntity();

    // Override setEntite and setCatColor to save the data in the localStorage
    // for later sessions
    const setEntite = useCallback((id) => {
        // get the other props based on the Id:
        return entity.getEntityWithId(id).then((dataFound) => {
            if (dataFound) {
                localStorage.setItem("entite", JSON.stringify(dataFound));
                setEntiteState(dataFound);
                return true;
            }
            return false;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[entity.getEntityWithId]);
    // this dependency is needed to avoid stale closure.
    // if there was no dependency, the function would always use the initial value of entiteList,
    // which is an empty array, because it hasn't been fetched yet.
    // by adding entiteList as a dependency, the function will be recreated each time entiteList changes,
    // and will use the new value of entiteList.

    // update the entites
    useEffect(() => {
        if (Object.keys(permissions).length) {
            // Set the entite only if the user has permissions
            // console.log("permission trouvé! affectation de la catégorie")
            if (localStorage.getItem("entite")) {
                // Si une entite est enregistré dans le localStorage, on regarde si elle existe encore du côté du backend
                if (setEntite(JSON.parse(localStorage.getItem("entite")).id)) {
                    return;
                } else {
                    // Si elle n'existe plus, on la supprime du localStorage
                    localStorage.removeItem("entite");
                }
            }
            // On arrive dans cette partie si il n'y a pas d'entité dans le localStorage, ou que c'était une entité qui n'existe plus
            if (permissions.entities_manageable?.length) {
                // Check if the user has a entite manageable
                // get the 1st entite from the list
                setEntite(permissions.entities_manageable[0]);
            } else if (permissions.entities?.length) {
                // Check if the user has a entite
                setEntite(permissions.entities[0]);
            }
        }
    // eslint-disable-next-line
    }, [permissions])

    return (
        <EntiteContext.Provider value={{entite, setEntite}}>
            {children}
        </EntiteContext.Provider>
    )
}

export default EntiteContext;
