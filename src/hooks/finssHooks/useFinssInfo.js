import useAxiosPrivate from "../useAxiosPrivate";
import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";

/*
Permet d'obtenir et de changer les informations d'un Fin'ss

Paramètres:
    finssId: Id du fin'ss

Retour:
    isLoading: bool qui donne l'état de chargement des informations
    finssInfo: Dictionnaire qui contient les infos du fin'ss
    retrieveFinssInfo: Fonction qui force l'update de finssInfo
    changeInfo: Change les informations du fin'ss (prends en entrée le tableau d'info du fin'ss)

Tableau d'info du fin'ss:
    {
        "id": id du fin'ss,
        "titre": "Nom du fin'ss",
        "description": "Description du fin'ss",
        "can_subscribe": peut on encore s'inscrire ? (bool),
        "date_event": "Date du fin'ss",
        "ended": est-il cloturer ?,
        "can_manage": l'utilisateur en cours peut-il le manager ?,
        "is_prebucque":  l'utilisateur est il inscrit ?,
        "managers": [Liste des managers]
    }


 */

export function useFinssInfo(finssId) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [finssInfo, setFinssInfo] = useState([])

    const endFinss = async ()=>{
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

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrieveFinssInfo()

            }else{
                errorNotif("Finss", "Une erreur inconue est survenue lors de la cloture du finss")
                console.log("Error sending Finss parameters", response);
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Finss parameters", error);
        }
    }

    const changeInfo = async (finssInfo)=>{
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

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrieveFinssInfo()

            }else{
                errorNotif("Finss", "Une erreur inconue est survenue lors de l'envoi des paramètres")
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending Finss parameters", error);
        }
    }

    const retrieveFinssInfo = async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("event/"+finssId);
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
    }

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
        // eslint-disable-next-line
    }, [finssId]);

    return {isLoading, finssInfo, retrieveFinssInfo, changeInfo, endFinss}

}