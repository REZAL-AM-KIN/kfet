import {useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer la liste des entités

Retours :
    isLoading : isLoading : bool qui donne l'état de chargement des informations
    retrieveEntities : Fonction qui force l'actualisation de productsList
    entitiesList :
        [
            {
                "id": id due l'entité (int),
                "nom": "Nom de l'entité",
                "description": description,
                "color": code hexadecimal de la couleur de l'entité ("#xxxxxx"),
            },
            ...
        ]
 */

export function useEntiteList(){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [entitiesList, setEntitiesList] = useState([])

    const retrieveEntities = async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("entites/");
            if (response.data) {
                setEntitiesList(response.data.results);
            } else {
                errorNotif("Entités","Impossible de récupérer la liste des entités");
            }
        } catch (error) {
            errorNotif("Catégories", error.message)
            console.log("Error getting entities", error);
        }
        setLoading(false)
    }

    // get product list
    useEffect(() => {
            const controller = new AbortController();

            retrieveEntities();

            return () => {
                controller.abort();
            }
        // eslint-disable-next-line
    }, []);

    return {entitiesList, isLoading, retrieveEntities}

}
