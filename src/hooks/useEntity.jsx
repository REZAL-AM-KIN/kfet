import {useCallback, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer les infos d'une entité à partir de son id

Retours :
    isLoading : bool qui donne l'état de chargement des informations
    getEntityWithId :
        {
            "id": id due l'entité (int),
            "nom": "Nom de l'entité",
            "description": description,
            "color": code hexadecimal de la couleur de l'entité ("#xxxxxx"),
        }
 */

export function useEntity(){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)

    const getEntityWithId = useCallback(async (id) => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("entites/"+id+"/");
            if (response.data) {
                setLoading(false)
                return response.data;
            } else {
                errorNotif("Entités","Impossible de récupérer l'entité "+id);
            }
        } catch (error) {
            errorNotif("Catégories", error.message)
            console.log("Error getting entity", error);
        }
        setLoading(false)
    }, [axiosPrivate])


    return {isLoading, getEntityWithId}

}
