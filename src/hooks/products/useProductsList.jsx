import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

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

export function useProductsList(entityId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState([])

    const retrieveProducts = async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("produitsDansEntite/"+entityId+"/");
            if (response.data) {
                setProductsList(response.data);
            } else {
                errorNotif("Produits","Impossible de récupérer les produits de l'entité");
            }
        } catch (error) {
            errorNotif("Produits", error.message)
            console.log("Error getting products", error);
        }
        setLoading(false)
    }

    // get product list
    useEffect(() => {
        //Si aucun entityId n'est passé, alors on ne récupère pas les produits
        if(!entityId){
            return
        }
        const controller = new AbortController();

        setLoading(true)
        retrieveProducts();

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [entityId]);

    return {productsList, isLoading, retrieveProducts}

}