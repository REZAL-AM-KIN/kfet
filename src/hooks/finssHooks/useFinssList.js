import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";

/*
Permet d'obtenir la liste des fin'ss

Paramètres: Pas de paramètres

Retour:
    isLoading: bool qui donne l'état de chargement des informations
    finssList: Liste des fin'ss avec informations sur chaque fin'ss
    updateFinssList: Fonction qui force l'update de finssList

FinssList:
    [
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
        },
        ...
    ]


 */

export function useFinssList(){
    const axiosPrivate = useAxiosPrivate()
    const [isLoading, setLoading] = useState(true)
    const [finssList, setFinssList] = useState([])

    const updateFinssList = async () => {
        try {
            const response = await axiosPrivate.get("event/");
            if (response.data) {
                setFinssList(response.data.results);
            } else {
                errorNotif("Finss","Impossible de récupérer la liste des finss");
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

        setLoading(true)
        updateFinssList();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {isLoading, finssList, updateFinssList}
}