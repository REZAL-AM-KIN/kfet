import useAxiosPrivate from "../useAxiosPrivate";
import {useCallback, useState} from "react";
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
                "nom": "Nom du consommateur",
                "prenom": "Prénom du consommateur",
                "bucque": "Bucque du consommateur",
                "fams": "Fam'ss du consommateur",
                "proms": "Prom'ss du consommateur",
                "solde": "Solde du consommateur",
                "participation_event": liste des participations, organisées comme suit :
                    [
                        {
                            "id": id de la participation,
                            "cible_participation": id du consommateur cible,
                            "product_participation": id du produit,
                            "prebucque_quantity": quantité demandée à l'inscription,
                            "quantity": quantité bucqué (prise le jour du finss),
                            "is_bucquee": la participation est-elle bucquée ?,
                            "is_debucquee": la participation est-elle débucquée ?
                        },
                        ....
                    ]
            },
            ...
        ]


 */

export function useBucquage(finssId) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(false)
    const [bucquages, setBucquages] = useState([])
    
    const retrieveBucquages = useCallback(async (consommateur_id) => {
        if (!consommateur_id || !finssId) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const response = await axiosPrivate.get("bucquageevent/", {params:
                    {finss: finssId, consommateur_id: consommateur_id}});
            if (response.data) {
                setBucquages(response.data.results);
            } else {
                errorNotif("Bucquage","Impossible de récupérer les bucquages du PG");
            }
        } catch (error) {
            errorNotif("Bucquage", error.message)
            console.log("Error getting Bucquage", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId])

    const sendDebucquage = useCallback(async (debucquagesList)=>{
        try {
            const response = await axiosPrivate.post("bucquageevent/debucquage/", debucquagesList)

            if(response.status===200){
                if(response.data.errors_count>0){
                    errorNotif("Débucquage", response.data.errors_count+" débucquages n'ont pas été effectué (sur "+debucquagesList.length+")")
                    console.log("Error sending débucquages", response.data);
                }
                else {
                    showNotification( {
                        icon: <IconCheck size={18} />,
                        color: "green",
                        autoClose: true,
                        title: 'Débucquages envoyés avec succès',
                        message: response.data.success_count+' débucquages envoyés avec succès'
                    })
                }
                return true
            }
            else{
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
            const response = await axiosPrivate.post("bucquageevent/bucquage/", bucquagesList)

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

    return {bucquages, isLoading, retrieveBucquages, sendDebucquage, sendBucquage}

}