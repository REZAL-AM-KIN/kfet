import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";

/*
Permet de récupérer la liste des produits d'une entité

Paramètres :
    productId : id du produit dont on veut les informations

Retours :
    isLoading : bool qui donne l'état de chargement des informations
    isSending : bool qui donne l'état de l'envoi d'informations
    retrieveProducts : Fonction qui force l'actualisation des informations du produit
    updateProduct : Fonction pour mettre à jour les infos d'un produit
    deleteProduct : Fonction pour supprimer un produit
    productInfo :
        {
            "id": id du produit (int),
            "raccourci": "raccourci pour trouver le produit",
            "nom": "Nom du produit",
            "prix": prix du produit en euros (float),
            "entite": entité auquel le produit appartient,
        }
 */

export function useProductInfo(productId){

    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [isSending, setSending] = useState(false)
    const [productInfo, setProductInfo] = useState({})

    const addProduct = async (productInfo)=>{
        try {
            setSending(true)
            const response = await axiosPrivate.post("produits/", productInfo)
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
                retrieveProductInfo()

            }else{
                errorNotif("Produits", "Une erreur inconnue est survenue lors de l'envoi des paramètres produit")
                console.log("Error sending product parameters", response);
            }
        }catch (error) {
            setSending(false)
            errorNotif("Produits", error.message)
            console.log("Error sending product parameters", error);
        }
    }

    const updateProduct = async (productInfo)=>{
        try {
            setSending(true)
            const response = await axiosPrivate.put("produits/"+productInfo.id+"/", productInfo)
            setSending(false)

            if(response.status===200){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification des paramètres du produit',
                    message: 'Le produit à bien été modifié'
                })

            }else{
                errorNotif("Produit", "Une erreur inconnue est survenue lors de l'envoi des paramètres du produit")
            }
        }catch (error) {
            setSending(false)
            errorNotif("Produit", error.message)
            console.log("Error sending product parameters", error);
        }
    }

    const deleteProduct = async (productInfo)=>{
        try {

            setSending(true)
            const response = await axiosPrivate.delete("produits/"+productInfo.id+"/")
            setSending(false)

            if(response.status===204){
                // On indique à l'utilisateur que les paramètres ont été changés
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Modification du produit',
                    message: 'Le produit à été supprimé.'
                })

                // On recharge les paramètres pour être certain de n'avoir aucune décorrélation entre le back et le front
                retrieveProductInfo()

            }else{
                errorNotif("Produit", "Une erreur inconnue est survenue lors de la suppression du produit.")
                console.log("Error deleting product", response);
            }
        }catch (error) {
            setSending(false)
            errorNotif("Produit", error.message)
            console.log("Error deleting product", error);
        }
    }

    const retrieveProductInfo = async () => {
        setLoading(true)
        if(productId){
            try {
                const response = await axiosPrivate.get("produits/"+productId+"/");
                if (response.data) {
                    setProductInfo(response.data);
                } else {
                    errorNotif("Produits","Impossible de récupérer les produits de l'entité");
                }
            } catch (error) {
                errorNotif("Produits", error.message)
                console.log("Error getting products", error);
            }
        }
        setLoading(false)
    }

    // get product list
    useEffect(() => {
        //Si aucun productId n'est passé, alors on ne récupère pas les produits
        if(!productId){
            return
        }
        const controller = new AbortController();

        setLoading(true)
        retrieveProductInfo();

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [productId]);

    return {productInfo, isLoading, isSending, retrieveProductInfo, addProduct, updateProduct, deleteProduct}

}