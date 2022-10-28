import {createContext, useState} from 'react';

const CategorieContext = createContext({});

export const CategorieProvider = ({children}) => {
    const [categorie, setCategorie] = useState("");

    return (
        <CategorieContext.Provider value={{categorie, setCategorie}}>
            {children}
        </CategorieContext.Provider>
    )
}

export default CategorieContext;
