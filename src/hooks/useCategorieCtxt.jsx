import {useContext} from "react";
import CategorieContext from "../context/Categorie";

export function useCategorieCtxt() {
    return useContext(CategorieContext)["categorie"];
}

export function useCatColor() {
    return useContext(CategorieContext)["catColor"];
}