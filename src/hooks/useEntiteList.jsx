import {useCallback, useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer la liste des entités

Retours :
    isLoading : bool qui donne l'état de chargement des informations
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

export function useEntiteList(limit){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [entitiesList, setEntitiesList] = useState([])
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1)

    const retrieveEntities = useCallback( async () => {
            setLoading(true)
            try {
                const response = await axiosPrivate.get("mesentites/", {params: {limit:limit, offset:(page-1)*limit}});
                if (response.data) {
                    setEntitiesList(response.data.results);
                    setPageCount(Math.ceil(response.data.count / limit));
                } else {
                    errorNotif("Entités","Impossible de récupérer la liste des entités");
                }
            } catch (error) {
                errorNotif("Catégories", error.message)
                console.log("Error getting entities", error);
            }
            setLoading(false)
        }, [axiosPrivate, limit, page]
    )

    useEffect(() => {
        retrieveEntities();
    }, [retrieveEntities]);

    return {entitiesList, isLoading, retrieveEntities, pageCount, page, setPage}

}
