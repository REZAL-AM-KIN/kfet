import useAxiosPrivate from "../useAxiosPrivate";
import {useCallback, useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

/*
Permet de récupérer une liste de participations pour un fin'ss

Paramètres:
    finssId: id du finss dont on veut les participations

Retours:
    isLoading: isLoading: bool qui donne l'état de chargement des informations
    retrieveBucquages: Fonction qui force l'actualisation de bucquages
    sendBucquage: Fonction qui permet d'envoyer les bucquages à backend. Prend en argument une liste bucquagesList au
        format [{cible_participation :<id>, product_participation :<id>, quantity :<int>}, ... ]
    sendDebucquage: Fonction qui permet d'envoyer les débucquages à backend. Prend en argument une liste debucquagesList
        au format [{id_participation :<id>, (optionnel) negats :<True|False>}, ... ]
    bucquages: contient la liste des bucquages organisé comme ci-dessous :
        [
            {
                "consommateur_id": id du consommateur,
                "consommateur_bucque": "Bucque du consommateur",
                "consommateur_nom": "Nom du consommateur",
                "consommateur_fams": "Fam'ss du consommateur",
                "participation_event": liste des participations, organisées comme suit :
                    [
                        {
                            "id": id de la participation,
                            "cible_participation": id du consommateur cible,
                            "product_participation": id du produit,
                            "prebucque_quantity": quantité demandée à l'inscription,
                            "quantity": quantité bucqué (prise le jour du finss),
                            "participation_bucquee": la participation est-elle bucquée ?,
                            "participation_debucquee": la participation est-elle débucquée ?
                        },
                        ....
                    ]
            },
            ...
        ]


 */

export function useBucquage(finssId) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [bucquages, setBucquages] = useState([])
    
    const retrieveBucquages = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("bucquagevent/?finss="+finssId);
            if (response.data) {
                setBucquages(response.data.results);
            } else {
                errorNotif("Bucquage","Impossible de récupérer les bucquage du Fin'ss");
            }
        } catch (error) {
            errorNotif("Bucquage", error.message)
            console.log("Error getting Bucquage", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId])

    const sendDebucquage = useCallback(async (debucquagesList)=>{
        try {
            const response = await axiosPrivate.post("bucquagevent/debucquage/", debucquagesList)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Débucquages envoyés avec succès',
                    message: debucquagesList.length+' débucquages envoyés avec succès'
                })
                return true
            }else{
                errorNotif("Débucquage", "Une erreur inconnue est survenue lors de l'envoi des débucquages")
                console.log("Error sending débucquages", response);
                return false
            }
        }catch (error) {
            errorNotif("Débucquage", error.message)
            console.log("Error sending débucquages", error);
            return false
        }
    },[axiosPrivate])

    const sendBucquage = useCallback(async (bucquagesList)=>{
        try {
            const response = await axiosPrivate.post("bucquagevent/bucquage/", bucquagesList)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Bucquages envoyés avec succès',
                    message: bucquagesList.length+' bucquages envoyés avec succès'
                })
                return true
            }else{
                errorNotif("Débucquage", "Une erreur inconnue est survenue lors de l'envoi des bucquages")
                console.log("Error sending bucquages", response);
                return false
            }
        }catch (error) {
            errorNotif("Débucquage", error.message)
            console.log("Error sending bucquages", error);
            return false
        }
    },[axiosPrivate])

    // get Bucquage list
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true)
        retrieveBucquages();

        return () => {
            controller.abort();
        }
    }, [retrieveBucquages, finssId]);

    return {bucquages, isLoading, retrieveBucquages, sendDebucquage, sendBucquage}

}