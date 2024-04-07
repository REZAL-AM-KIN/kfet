import useAxiosPrivate from "../useAxiosPrivate";
import {useCallback, useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";

/*
Permet de récupérer une liste de participations pour un fin'ss

Paramètres:
    finssId: id du finss dont on veut les participations

Retours:
    isLoading: isLoading: bool qui donne l'état de chargement des informations
    retrieveBucquages: Fonction qui force l'update de bucquages
    bucquages: contient la liste des bucquages organisé comme ci-dessous:
        [
            {
                "consommateur_id": id du consommateur,
                "consommateur_bucque": "Bucque du consommateur",
                "consommateur_nom": "Nom du consommateur",
                "consommateur_fams": "Famss du consommateur",
                "participation_event": liste des participation organisé comme suit :
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
            const response = await axiosPrivate.get("bucquagevent?finss="+finssId);
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

    const debucquage = useCallback(async (debucquagesList)=>{
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

                // On recharge les paramètres pour être certain de n'avoir aucune décorélation entre le back et le front
                retrieveBucquages()

            }else{
                errorNotif("Débucquage", "Une erreur inconue est survenue lors de l'envoi des débucquages")
                console.log("Error sending débucquages", response);

            }
        }catch (error) {
            errorNotif("Débucquage", error.message)
            console.log("Error sending débucquages", error);
        }
    },[axiosPrivate, retrieveBucquages])

    // get Bucquage list
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true)
        retrieveBucquages();

        return () => {
            controller.abort();
        }
    }, [retrieveBucquages, finssId]);

    return {bucquages, isLoading, retrieveBucquages, debucquage}

}