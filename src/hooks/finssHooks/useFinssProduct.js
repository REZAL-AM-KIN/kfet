import {useCallback, useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

/*
Permet de récupérer la liste des produits d'un fin'ss

Paramètres:
    finssId: id du finss dont on veut les produits

Retours:
    isLoading: isLoading: bool qui donne l'état de chargement des informations
    retrieveProducts: Fonction qui force l'actualisation de productsList
    updateProduct/deleteProduct/addProduct : Fonction qui permet de mettre à jour/supprimer/ajouter un produit avec l'endpoint /productevent/
    productsList:
        [
            {
                "id": id du produit,
                "parent_event": "url de l'event",
                "nom": "Nom du produit",
                "description": "Description du produit",
                "prix_total": "Prix total (Pour l'ensemble des produits)",
                "prix_min": "Prix mini",
                "prix_unitaire" : Prix unitaire calculé (read only),
                "obligatoire": Si le produit est obligatoire,
                "quantite_prebucque": Quantité totale de participation inscrite.
                "quantite_bucque": Quantité totale de participation bucqué.
            },
            ...
        ]



 */

export function useFinssProducts(finssId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState([])

    const retrieveProducts = useCallback(async () => {
        setLoading(true)
        try {

            const response = await axiosPrivate.get("productevent/?finss="+finssId);
            if (response.data) {
                setProductsList(response.data.results);
            } else {
                errorNotif("Bucquage","Impossible de récupérer les bucquage du Fin'ss");
            }
        } catch (error) {
            errorNotif("Bucquage", error.message)
            console.log("Error getting Bucquage", error);
        }
        setLoading(false)
    }, [axiosPrivate, finssId])

    const updateProduct = useCallback(async (productInfo)=>{
        try {

            const response = await axiosPrivate.put("productevent/"+productInfo.id+"/", productInfo)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification des paramètres du Finss',
                    message: 'Les paramètres ont bien été modifiés'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveProducts()

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de l'envoi des paramètres produit")
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending product parameters", error);
        }
    },[axiosPrivate, retrieveProducts])

    const deleteProduct = useCallback(async (productInfo)=>{
        try {

            const response = await axiosPrivate.delete("productevent/"+productInfo.id+"/")

            if(response.status===204){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification des paramètres du Finss',
                    message: 'Le produit à été supprimé.'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveProducts()

            }else{
                errorNotif("Finss", "Une erreur inconnue est survenue lors de la suppression du produit.")
                console.log("Error deleting product", response);
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error deleting product", error);
        }
    }, [axiosPrivate, retrieveProducts])

    const addProduct = useCallback(async (productInfo)=>{
        try {
            productInfo.parent_event = finssId      // on remplit l'id de l'event parent.

            const response = await axiosPrivate.post("productevent/", productInfo)

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
                errorNotif("Finss", "Une erreur inconnue est survenue lors de l'envoi des paramètres produit")
                console.log("Error sending product parameters", response);
            }
        }catch (error) {
            errorNotif("Finss", error.message)
            console.log("Error sending product parameters", error);
        }
    }, [axiosPrivate, retrieveProducts, finssId])

    // get product list
    useEffect(() => {
        //Si aucun finssId n'est passé, alors on ne récupère pas les produits
        if(!finssId){
            return
        }
        const controller = new AbortController();

        setLoading(true)
        retrieveProducts();

        return () => {
            controller.abort();
        }
    }, [retrieveProducts, finssId]);

    return {productsList, isLoading, retrieveProducts, updateProduct, addProduct, deleteProduct}

}