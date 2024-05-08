import {Center, Stack, Box, Modal} from "@mantine/core"
import {useEffect, useState} from "react";
import ProductsSelector from "../components/editProduct/ProductsSelector";
import {useProductsList} from "../hooks/products/useProductsList";
import ProductParameters from "../components/editProduct/ProductParameters";

const Edit = () => {
    //Le context pour l'entité sera à implémenter ici, et dev dans une autre branche.
    //Il faudra possiblement enlever les props des components appelés ici et utilise le context dans ceux-ci
    const entityId = 2;
    const [category, setCategory] = useState("rezal");

    const useproductslist = useProductsList(entityId);
    const [modalOpened, setModalOpened] = useState(false)
    const [productId, setProductId] = useState()
    //const useProductsList = [{"id": 1,"raccourci": "cab","nom": "cable","prix": "1.00"},{"id": 2,"raccourci": "sw","nom": "switch","prix": "5.00"}, {"id": 3,"raccourci": "fx","nom": "faux","prix": "0.00"}]


    useEffect(()=>{
        if(modalOpened===false){
            useproductslist.retrieveProducts()
        }
    }, [modalOpened])

    return(
        <Stack>
            <Center>
                <h1 style={{margin:"10px"}}>Listes des produits de {category}</h1>
            </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <ProductsSelector
                    useproductslist={useproductslist}
                    category={category}
                    setProductId={setProductId}
                    setModalOpened={setModalOpened}
                />

                <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Ajouter un produit">
                    <ProductParameters
                        productId={productId}
                        entity={category}
                        setModalOpened={setModalOpened}
                    />
                </Modal>
            </Box>
        </Stack>
    );
}

export default Edit;