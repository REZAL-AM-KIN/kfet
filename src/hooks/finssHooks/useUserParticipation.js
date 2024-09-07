
import {useCallback, useEffect, useState} from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import errorNotif from "../../components/ErrorNotif";

export function useUserParticipation(finssId) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [participations, setParticipations] = useState([])

    const retrieveParticipations = useCallback(async () => {

        setLoading(true)
        try {
            const response = await axiosPrivate.get("bucquagevent/my_bucquages/", {params: {finss: finssId}});
            if (response.data) {
                setParticipations(response.data);
            } else {
                errorNotif("Participation","Impossible de récupérer les participations de l'utilisateur");
            }
        } catch (error) {
            errorNotif("Participation", error.message)
            console.log("Error getting Participations", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId])

    const sendPrebucquage = useCallback(async (participations) =>{
        try {
            const response = await axiosPrivate.post("bucquagevent/prebucquage/",participations)

            if(response.status===200){
                return true

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de l'envoi des participations")
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Participations", error);
        }
        return false
    }, [axiosPrivate])

    // get product list
    useEffect(() => {
        //Si aucun finssId n'est passé, alors on ne récupère pas les produits
        if(!finssId){
            setParticipations([]);
            return
        }
        const controller = new AbortController();

        retrieveParticipations();

        return () => {
            controller.abort();
        }
    }, [retrieveParticipations, finssId]);

    return {participations, isLoading, retrieveParticipations, sendPrebucquage}
}