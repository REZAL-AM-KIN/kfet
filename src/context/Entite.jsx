import {createContext, useCallback, useEffect, useState} from 'react';
import {usePermissions} from "../hooks/useUser";
import {useEntiteList} from "../hooks/useEntiteList";

const EntiteContext = createContext({});

export const EntiteProvider = ({children}) => {

    const [entite, setEntiteState] = useState({
        id: null,
        nom: "",
        color: "",
        description: ""
    });

    const permissions = usePermissions();
    const entiteList = useEntiteList();

    // Override setEntite and setCatColor to save the data in the localStorage
    // for later sessions
    const setEntite = useCallback((id) => {
        // get the other props based on the Id:
        const linefound = entiteList.entitiesList.find((line) => {
            return line.id === id;
        });
        if (linefound) {
            localStorage.setItem("entite", JSON.stringify(linefound));
            setEntiteState(linefound);
        }
        // eslint-disable-next-line
    },[entiteList]);
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
                // Check if the entite is already in the localStorage
                setEntiteState(JSON.parse(localStorage.getItem("entite")));
            } else if (permissions.entities_manageable?.length) {
                // Check if the user has a entite manageable
                // get the entite from the list
                setEntite(
                    // TODO: modify when the back will use the id instead of the name
                    entiteList.entitiesList.find((line) => {
                        return line.nom === permissions.entities_manageable[0];
                    })
                );
            } else if (permissions.entities?.length) {
                // Check if the user has a entite
                entiteList.entitiesList.forEach((line) => {
                    if (line.nom === permissions.entities[0]) {
                        setEntite(line.id);
                    }
                });
            }
        }
    // eslint-disable-next-line
    }, [permissions,entiteList.entitiesList])

    return (
        <EntiteContext.Provider value={[entite, setEntite]}>
            {children}
        </EntiteContext.Provider>
    )
}

export default EntiteContext;
