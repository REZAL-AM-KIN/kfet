import {useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer la liste des entités

Retours :
    isLoading : isLoading : bool qui donne l'état de chargement des informations
    retrieve : Fonction qui force l'actualisation de productsList
    data :
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
export function useProduitByEntite(entiteId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [data, setProduitList] = useState([])

    const retrieve = async () => {
        console.log("useProduitByEntite: Update produit by entite list");
        setLoading(true);
        try {
            const response = await axiosPrivate.get("produitsDansEntite/" + entiteId + "/");
            setProduitList(response.data);
        } catch (error) {
            errorNotif("Produit par Entite", error.message);
            console.log("Error getting produit by entite", error);
        }
        setLoading(false);
    }

    // get general history
    useEffect(() => {
        if (!entiteId) return;
        const controller = new AbortController();
        retrieve();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [entiteId]);

    return {data, isLoading, retrieve}
}
