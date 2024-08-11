
import {useCallback, useEffect, useState} from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import errorNotif from "../../components/ErrorNotif";

export function useUserParticipation(){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [participations, setParticipations] = useState([])

    const retrieveParticipations = useCallback(async () => {

        setLoading(true)
        try {
            const response = await axiosPrivate.get("bucquagevent/my_bucquages/");
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
    }, [axiosPrivate])

    const sendPrebucquage = useCallback(async (participations) =>{
        try {

            const response = await axiosPrivate.post("bucquagevent/prebucquage/",participations)

            if(response.status===200){

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveParticipations()
                return true

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de l'envoi des participations")
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Participations", error);
        }
        return false
    }, [axiosPrivate, retrieveParticipations])

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true)
        retrieveParticipations();

        return () => {
            controller.abort();
        }
    }, [retrieveParticipations]);

    return {participations, isLoading, retrieveParticipations, sendPrebucquage}
}