import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";

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
    const [isSending, setSending] = useState(false)
    const [productsList, setProductsList] = useState([])

    const addProduct = async (productInfo)=>{
        try {
            if (!productInfo.entite){ productInfo.entite = entityId}    // on remplit l'id de l'entité.

            setSending(true)
            const response = await axiosPrivate.post("products/", productInfo)
            setSending(false)

            if(response.status===201){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: "Ajout d'un produit",
                    message: 'Le produit a bien été ajouté'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveProducts()

            }else{
                errorNotif("Produits", "Une erreur inconnue est survenue lors de l'envoi des paramètres produit")
                console.log("Error sending product parameters", response);
            }
        }catch (error) {
            errorNotif("Produits", error.message)
            console.log("Error sending product parameters", error);
        }
    }

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

    return {productsList, isLoading, isSending, retrieveProducts, addProduct}

}