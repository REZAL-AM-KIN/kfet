import {useCallback, useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";

/*
Permet de récupérer la liste des produits d'une entité

Paramètres :
    entityId : id de l'entité dont on veut les produits

Retours :
    isLoading : isLoading : bool qui donne l'état de chargement des informations
    retrieveProducts : Fonction qui force l'actualisation de productsList
    productsList :
        [
            {
                "id": id du produit (int),
                "raccourci": "raccourci pour trouver le produit",
                "nom": "Nom du produit",
                "prix": prix du produit en euros (float),
                "entite": entité auquel le produit appartient,
            },
            ...
        ]



 */

export function useProductsList(entityId, initial_limit=25){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState([])
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initial_limit);
    const [numberRecords, setNumberRecords] = useState(1)
    const [ordering, setOrdering] = useState("nom")
    const [search, setSearch] = useState("")

    const retrieveProducts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("produitsDansEntite/", {params:
                    {cible_entity:entityId, limit:limit, offset:(page-1)*limit, ordering:ordering, search:search}});
            if (response.data) {
                setProductsList(response.data.results);
                setNumberRecords(response.data.count);
            } else {
                errorNotif("Produits","Impossible de récupérer les produits de l'entité");
            }
        } catch (error) {
            errorNotif("Produits", error.message)
        }
        setLoading(false)
    },[axiosPrivate, entityId, limit, page, ordering, search]);

    // get product list
    useEffect(() => {
        //Si aucun entityId n'est passé, alors on ne récupère pas les produits
        if(!entityId){
            return
        }
        const controller = new AbortController();

        retrieveProducts();

        return () => {
            controller.abort();
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retrieveProducts]);

    return {productsList, isLoading, retrieveProducts, page, setPage, limit, setLimit, numberRecords, ordering, setOrdering, search, setSearch}

}