import useAxiosPrivate from "../useAxiosPrivate";
import {useCallback, useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";

/*
Permet de récupérer une liste des bucquages pour un fin'ss (toutes les participations avec participation_bucquee=true)

Paramètres:
    finssId: id du finss dont on veut les participations

Retours:
    isLoading: isLoading: bool qui donne l'état de chargement des informations
    retrieveBucquages: Fonction qui force l'actualisation de bucquages
    page: page courante
    setPage: Fonction qui permet de changer la page courante
    limit: nombre de prébucquages par page
    setLimit: Fonction qui permet de changer le nombre de prébucquages par page
    ordering: nom de la colonne utilisée pour le tri
    setOrdering: Fonction qui permet de changer ordering
    search: texte que l'on recherche. Les champs sur lesquels on peut rechercher sont défini par backend
    setSearch: Fonction qui permet de changer le texte de recherche
    numberRecords: nombre total de prébucquages
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

export function useBucquageList(finssId, initial_limit=25) {
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [bucquages, setBucquages] = useState([])
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initial_limit);
    const [numberRecords, setNumberRecords] = useState(1)
    const [ordering, setOrdering] = useState("bucque")
    const [search, setSearch] = useState("")
    
    const retrieve = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("event_bucquage/", {params:
                    {finss:finssId, limit:limit, offset:(page-1)*limit, ordering:ordering, search:search}});
            if (response.data) {
                setBucquages(response.data.results);
                setNumberRecords(response.data.count);
            } else {
                errorNotif("Bucquage","Impossible de récupérer les bucquages du Fin'ss");
            }
        } catch (error) {
            errorNotif("Bucquage", error.message)
            console.log("Error getting Bucquages", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId, limit, page, ordering, search])

    // get Bucquage list
    useEffect(() => {
        const controller = new AbortController();

        retrieve();

        return () => {
            controller.abort();
        }
    }, [retrieve]);

    return {bucquages, isLoading, retrieve, page, setPage, limit, setLimit, ordering, setOrdering, search, setSearch,
        numberRecords}

}