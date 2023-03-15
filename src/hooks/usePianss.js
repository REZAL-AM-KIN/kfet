import {useEffect, useState} from "react";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "./useAxiosPrivate";

/*
Permet de récupérer la liste des pianss
Paramètres:
    - Aucun
Retours:
    isLoading: isLoading: bool qui donne l'état de chargement des informations
    retrievePianss: Fonction qui permet de récupérer les informations d'un pianss
    pianssList: Liste des pianss
    updatePianss: Fonction qui permet de mettre à jour les informations d'un pianss
    deletePianss: Fonction qui permet de supprimer un pianss
    createPianss: Fonction qui permet de créer un pianss

    forme de pianssList:
    [
        {
            "id": <id>,
            "groupe": <id de l'entité auquel le pian'ss à accès>,
            "nom": <nom du pian'ss>,
            "description": <description du pian'ss>,
            "token": <token du pian'ss généré aléatoirement lors de la création du pian'ss>,
        }
    ]

 */

export function usePians(){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [pianssList, setPianssList] = useState([])

    const updatePianss = async (pianssInfo)=>{
        try {

            const response = await axiosPrivate.put("pianss/"+pianssInfo.id+"/", pianssInfo)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: "Modification des paramètres du Pian'ss",
                    message: 'Les paramètres ont bien été modifiés'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrievePianss()

            }else{
                errorNotif("Pian'ss", "Une erreur inconnue est survenue lors de l'envoi des paramètres pian'ss")
            }
        }catch (error) {
            errorNotif("Pian'ss", error.message)
            console.log("Error sending pian'ss parameters", error);
        }
    }

    const deletePianss = async (pianssInfo)=>{
        try {

            const response = await axiosPrivate.delete("pianss/"+pianssInfo.id+"/")

            if(response.status===204){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: "Modification des paramètres du Pian'ss",
                    message: "Le pian'ss à été supprimé."
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrievePianss()

            }else{
                errorNotif("Pian'ss", "Une erreur inconnue est survenue lors de la suppression du pian'ss.")
                console.log("Error deleting pian'ss", response);
            }
        }catch (error) {
            errorNotif("Pian'ss", error.message)
            console.log("Error deleting pian'ss", error);
        }
    }

    const addPianss = async (pianssInfo)=>{
        try {

            const response = await axiosPrivate.post("pianss/", pianssInfo)

            if(response.status===201){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: "Ajout d'un pian'ss",
                    message: "Le pian'ss a bien été ajouté"
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrievePianss()

            }else{
                errorNotif("Pian'ss", "Une erreur inconnue est survenue lors de l'envoi des paramètres pian'ss")
                console.log("Error sending pian'ss parameters", response);
            }
        }catch (error) {
            errorNotif("Pian'ss", error.message)
            console.log("Error sending pian'ss parameters", error);
        }
    }

    const retrievePianss = async () => {
        setLoading(true)
        try {

            const response = await axiosPrivate.get("pianss/");
            if (response.data) {
                setPianssList(response.data.results);
            } else {
                errorNotif("Pian'ss","Impossible de récupérer les pian'ss");
            }
        } catch (error) {
            errorNotif("Pian'ss", error.message)
            console.log("Error getting pian'ss", error);
        }
        setLoading(false)
    }

    // get pianss list
    useEffect(() => {

        const controller = new AbortController();

        setLoading(true)
        retrievePianss();

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {pianssList, isLoading, retrievePianss, updatePianss, addPianss, deletePianss}

}