import {useContext} from "react";
import EntiteContext from "../context/Entite";

/*
This hook is used to get the entite from the context

useCategorieCtxt() ->
    entite: {
        id: null,
        name: "",
        color: "",
        description: ""
    }
    setCategorie(id) -> set the entite in the context

*/

export function useEntiteCtxt() {
    return useContext(EntiteContext);
}
