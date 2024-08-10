import {useEffect, useState, useCallback} from "react";
import useAxiosPrivate from "../useAxiosPrivate";

import errorNotif from "../../components/ErrorNotif";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

/*
Permet d'obtenir et de changer les informations d'un Fin'ss

Paramètres:
    finssId: Id du fin'ss

Retour:
    isLoading: bool qui donne l'état de chargement des informations
    finssInfo: Dictionnaire qui contient les infos du fin'ss
    retrieveFinssInfo: Fonction qui force la mise à jour de finssInfo
    changeInfo: Change les informations du fin'ss (prends en entrée le tableau d'info du fin'ss)

Tableau d'info du fin'ss:
    {
        "id": id du fin'ss,
        "titre": "Nom du fin'ss",
        "description": "Description du fin'ss",
        "date_event": "Date du fin'ss",
        "etat_event": entier pour décrire l'état du fin'ss (les entiers et labels associés sont définis dans EtatEventConst.js),
        "can_manage": l'utilisateur en cours peut-il le manager ?,
        "is_prebucque":  l'utilisateur est il inscrit ?,
        "managers": [Liste des managers]
    }


 */

export function useFinssInfo(finssId) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [finssInfo, setFinssInfo] = useState([])

    const retrieveFinssInfo = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("event/"+finssId+"/");
            if (response.data) {
                setFinssInfo(response.data);
            } else {
                errorNotif("Finss","Impossible de récupérer la liste des produits");
            }
        } catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error getting Finss", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId])

    //TODO utiliser endpoint /event/{id}/fermeture_debucquage/ en Patch
    const endFinss = useCallback(async ()=>{
        try {
            await retrieveFinssInfo()
            finssInfo.can_subscribe=false
            finssInfo.ended=true

            const response = await axiosPrivate.put("event/"+finssId+"/", finssInfo)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification des paramètres du Finss',
                    message: 'Le finss à bien été cloturé'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveFinssInfo()

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de la cloture du finss")
                console.log("Error sending Finss parameters", response);
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Finss parameters", error);
        }
    },[axiosPrivate, retrieveFinssInfo, finssId, finssInfo])

    const changeInfo = useCallback(async (finssInfo)=>{
        try {

            const response = await axiosPrivate.put("event/"+finssId+"/", finssInfo)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification des paramètres du Finss',
                    message: 'Les paramètres ont bien été modifiés'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveFinssInfo()

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de l'envoi des paramètres")
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Finss parameters", error);
        }
    }, [axiosPrivate, retrieveFinssInfo, finssId])

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();

        if(finssId) {
            setLoading(true)
            retrieveFinssInfo();
        }
        return () => {
            controller.abort();
        }
    }, [retrieveFinssInfo, finssId]);

    return {isLoading, finssInfo, retrieveFinssInfo, changeInfo, endFinss}

}