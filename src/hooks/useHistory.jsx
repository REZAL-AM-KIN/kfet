import {useEffect, useState, useCallback} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";


/*
Permet de récupérer l'historique général

Retours :
    isLoading : bool qui donne l'état de chargement des informations
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

    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setLoading] = useState(true);
    const [data, setHistory] = useState([]);
    const [limit, setLimit] = useState(10);

    const retrieve = useCallback(async (limit, offset) => {
        if (!!!limit) {
            limit = 10;
        }
        if (!!!offset) {
            offset = 0;
        }
        console.log("useHistory: Update pg history | limit:", limit, "offset:", offset);
        setLoading(true);
        try {
            const response = await axiosPrivate.get("history/", {params: {limit:limit, offset:offset}});
            setHistory(response.data?.results);
        } catch (error) {
            errorNotif("History", error.message);
            console.log("Error getting general history", error);
        }
        setLoading(false);
    }, []);

    const loadMore = useCallback(() => {
        setLimit(limit => limit + 15);
    }, [])

    // get general history
    useEffect(() => {
        const controller = new AbortController();
        retrieve();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {data, isLoading, retrieve, loadMore}
}


export function usePGHistory(pgId){

    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setLoading] = useState(true);
    const [data, setPgHistory] = useState([]);

    const [loaded, setLoaded] = useState(10);

    const retrieve = useCallback(async (limit, offset) => {
        if (!!!limit) {
            limit = 10
        }
        if (!!!offset) {
            offset = 0
        }
        setLoading(true);
        try {
            // limit is the number of data loaded at once, offset is "load data until <loaded> number of lines"
            const response = await axiosPrivate.get("history/" + pgId + "/", {params: {limit:limit, offset:offset}});
            setPgHistory(response.data);
        } catch (error) {
            errorNotif("History", error.message);
            console.log("Error getting general history", error);
        }
        setLoading(false);
    }, [pgId]);

    const loadMore = useCallback(() => {
        // load more of the history
    }, []);

    // get general history
    useEffect(() => {
        if (!!!pgId) return;
        const controller = new AbortController();
        retrieve();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId]);

    return {data, isLoading, retrieve, loadMore}
}
