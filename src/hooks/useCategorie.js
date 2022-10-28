import {useContext} from "react";
import CategorieContext from "../context/Categorie";

export function useCategorie() {
    return useContext(CategorieContext);
}
