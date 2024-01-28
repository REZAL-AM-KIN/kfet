import {useEffect, useState, useCallback} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";


/*
Permet de récupérer l'historique général

Retours :
    isLoading : isLoading : bool qui donne l'état de chargement des informations
    retrieve : Fonction qui force l'actualisation de l'historique
    data :
        {
            "id": int,
            "prenom": str,
            "commentaire": str,
            "bucque": srt,
            "fams": str,
            "proms": str,
            "nom": str,
            "solde": str,
            "totaldep": str
        }
 */

export function usePG(pgId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [data, setPgData] = useState([])

    const retrieve = useCallback(async () => {
        console.log("usePG: Update pg data");
        setLoading(true);
        try {
            const response = await axiosPrivate.get("consommateurs/" + pgId + "/");
            if (response.data) {
                setPgData(response.data);
            } else {
                errorNotif("usePG/" + pgId, "Pas de PG activé correspondant");
            }
        } catch (error) {
            errorNotif("usePG", error.message);
            console.log("Error getting consommateur", error);
        }
        setLoading(false);
    }, [pgId]);

    // get general history
    useEffect(() => {
        if (!pgId) return;
        const controller = new AbortController();
        retrieve();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId]);

    return {data, isLoading, retrieve}
}
