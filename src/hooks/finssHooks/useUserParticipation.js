
import {useEffect, useState} from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import errorNotif from "../../components/ErrorNotif";

export function useUserParticipation(){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [participations, setParticipations] = useState([])

    const sendParticipations = async (participations) =>{
        try {

            const response = await axiosPrivate.post("bucquagevent/",participations)

            if(response.status===200){

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
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
    }

    const retrieveParticipations = async () => {

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
    }

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true)
        retrieveParticipations();

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {participations, isLoading, retrieveParticipations, sendParticipations}
}