import {useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";


/*
Permet de récupérer l'historique général

Retours :
    isLoading : isLoading : bool qui donne l'état de chargement des informations
    retrieve : Fonction qui force l'actualisation de l'historique
    data :
        [
            {
                "cible_evenement": PG (objet pg),
                "nom_evenement": str,
                "prix_evenement": str,
                "entite_evenement": str,
                "date_evenement": str (datetime),
                "initiateur_evenement": str
            },
            ...
        ]
 */

export function useHistory(){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [data, setHistory] = useState([])

    const retrieve = async () => {
        console.log("useHistory: update history");
        setLoading(true);
        try {
            const response = await axiosPrivate.get("history/");
            setHistory(response.data?.results);
        } catch (error) {
            errorNotif("History", error.message);
            console.log("Error getting general history", error);
        }
        setLoading(false);
    }

    // get general history
    useEffect(() => {
        const controller = new AbortController();
        retrieve();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {data, isLoading, retrieve}
}


export function usePGHistory(pgId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [data, setPgHistory] = useState([])

    const retrieve = async () => {
        console.log("usePGHistory: Update pg history");
        setLoading(true);
        try {
            const response = await axiosPrivate.get("history/" + pgId + "/");
            setPgHistory(response.data);
        } catch (error) {
            errorNotif("History", error.message);
            console.log("Error getting general history", error);
        }
        setLoading(false);
    }

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
