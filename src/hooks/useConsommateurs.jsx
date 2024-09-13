import {useCallback, useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer la liste des consommateurs

Retours :
    isLoading : bool qui donne l'état de chargement des informations
    retrieveConsommateurs : Fonction qui force l'actualisation de consommateurList
    consommateurList :
        [
            {
                "id": id du consommateur (int),
                "prenom": (str),
                "nom": (str),
                "commentaire": (str),
                "bucque": (str),
                "fams": (str),
                "proms": (str),
                "solde": (str),
                "totaldep": (str)
            }, 
            ...
        ]
 */

export function useConsommateurList(){

    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setLoading] = useState(true);
    const [consommateurList, setConsommateurList] = useState([]);
    const [search, setSearch] = useState("");

    const retrieveConsommateurs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get("consommateurs/", {params: {search:search}});
            if (response.data) {
                setConsommateurList(response.data.results);
            } else {
                errorNotif("Consommateurs","Impossible de récupérer la liste des Consommateurs");
            }
        } catch (error) {
            errorNotif("Catégories", error.message);
            console.log("Error getting entities", error);
        }
        setLoading(false);
    }, [axiosPrivate, search]);

    // get Consommateurs list
    useEffect(() => {
            const controller = new AbortController();

            retrieveConsommateurs();

            return () => {
                controller.abort();
            }
        // eslint-disable-next-line
    }, [retrieveConsommateurs]);

    return {consommateurList, isLoading, retrieveConsommateurs, search, setSearch}

}