import {useEffect, useState, useCallback} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

/*
Permet d'obtenir la liste des fin'ss

Paramètres : Pas de paramètres

Retour:
    isLoading: bool qui donne l'état de chargement des informations
    finssList: Liste des fin'ss avec informations sur chaque fin'ss
    updateFinssList: Fonction qui force l'actualisation de finssList

FinssList:
    [
        {
            "id": id du fin'ss,
            "titre": "Nom du fin'ss",
            "description": "Description du fin'ss",
            "date_event": "Date du fin'ss",
            "etat_event": entier pour décrire l'état du fin'ss (les entiers et labels associés sont définis dans EtatEventConst.js),
            "can_manage": l'utilisateur en cours peut-il le manager ?,
            "is_prebucque":  booléen indiquant si l'utilisateur est inscrit,
            "managers": [Liste des managers]
        },
        ...
    ]


 */

export function useFinssList(initial_limit=25, initial_ordering="titre"){
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setLoading] = useState(true);
    const [isSending, setSending] = useState(false);
    const [finssList, setFinssList] = useState([]);
    const [page, setPage] = useState(1);
    const [numberRecords, setNumberRecords] = useState(1);
    const [limit, setLimit] = useState(initial_limit);
    const [ordering, setOrdering] = useState(initial_ordering);
    const [search, setSearch] = useState("");

    const retrieveFinssList = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("event/", {params:
                {limit:limit, offset:(page-1)*limit, ordering:ordering, search:search}});
            if (response.data) {
                setFinssList(response.data.results);
                setNumberRecords(response.data.count);
            } else {
                errorNotif("Finss","Impossible de récupérer la liste des finss");
            }
        } catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error getting Finss", error);
        }
        setLoading(false)
    }, [axiosPrivate, setFinssList, limit, page, ordering, search]);

    const createFinss = useCallback(async (finssInfo)=>{
        try {
            setSending(true)
            const response = await axiosPrivate.post("event/", finssInfo)
            setSending(false)

            console.log(response)

            if(response.status===201){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: "Ajout d'un finss",
                    message: 'Finss créé avec succès'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveFinssList()


            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de la création du finss")
                console.log("Error creating finss", response);
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error creating finss", error);
        }
    }, [axiosPrivate, retrieveFinssList])

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();

        retrieveFinssList();
        return () => {
            controller.abort();
        }
    }, [retrieveFinssList]);

    return {isLoading, finssList, isSending, retrieveFinssList, createFinss,
        setOrdering, setLimit, setPage, setSearch, ordering, limit, page, search, numberRecords}
}