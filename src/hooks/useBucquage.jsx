import {useState, useCallback} from "react";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de créer un bucquage

Retours :
    isLoading : bool qui donne l'état de chargement
    bucquage(pgId, produitId) : Fonction qui créer le bucquage
 */
export function useBucquage(){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(false)

    const bucquage = useCallback(async (pgId, produitId, callback) => {
        console.log("useBucquage: Create bucquage");
        setLoading(true);
        try {
            await axiosPrivate.post("bucquages/",
                JSON.stringify({
                    cible_bucquage: pgId,
                    id_produit: produitId
                }));
            if (callback){
                callback();
            }
        } catch (error) {
            errorNotif("Bucquage", error.message);
            console.log("Error creating bucquage", error);
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return {isLoading, bucquage}
}
