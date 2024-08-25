import {Center, Stack, Box, Title, Modal} from "@mantine/core"
import {useEffect, useState} from "react";
import ProductsSelector from "../components/editProduct/ProductsSelector";
import {useProductsList} from "../hooks/products/useProductsList";
import ProductParameters from "../components/editProduct/ProductParameters";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";

const Edit = () => {
    //Le context pour l'entité sera à implémenter ici, et dev dans une autre branche.
    //Il faudra possiblement enlever les props des components appelés ici et utilise le context dans ceux-ci
    const { entite } = useEntiteCtxt();

    const useproductslist = useProductsList(entite.id);
    const [modalOpened, setModalOpened] = useState(false)
    const [productId, setProductId] = useState()

    //si une modale est refermé, on considère que l'utilisateur a fini de modifier le produit et on recharge la liste
    useEffect(()=>{
        if(modalOpened===false){
            useproductslist.retrieveProducts()
        }
    // eslint-disable-next-line
    }, [modalOpened])

    return(
        <Stack spacing="0">
            <Center>
                <Title order={1}  style={{margin:"0.5rem"}}>Listes des produits de {entite.nom}</Title>
            </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <ProductsSelector
                    useproductslist={useproductslist}
                    category={entite.nom}
                    setProductId={setProductId}
                    setModalOpened={setModalOpened}
                />

                <Modal centered opened={modalOpened} onClose={() => setModalOpened(false)} title={productId ? "Modifier le produit" : "Ajouter un produit" }>
                    <ProductParameters
                        productId={productId}
                        entity={entite.nom}
                        setModalOpened={setModalOpened}
                    />
                </Modal>
            </Box>
        </Stack>
    );
}

export default Edit;