import {useContext} from "react";
import CategorieContext from "../context/Categorie";

/*
This hooks are used to get the categorie and the color of the categorie
from the context

useCategorieCtxt() ->
    categorie: str, name of the categorie
    setCategorie

useCatColor() ->
    catColor:str, color of the categorie (hex) '#aabbcc'
    setCatColor
*/

export function useCategorieCtxt() {
    return useContext(CategorieContext)["categorie"];
}

export function useCatColor() {
    return useContext(CategorieContext)["catColor"];
}
