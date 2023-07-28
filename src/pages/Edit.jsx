
import {Center, Stack, Box} from "@mantine/core"
import {useEffect, useState} from "react";
import ProductsSelector from "../components/editProduct/ProductsSelector";

const Edit = ({setPage}) => {
    useEffect(()=>{setPage("Edition")})
    const productsList = [
        {"id": 1,"raccourci": "cab","nom": "cable","prix": "1.00"},
        {"id": 2,"raccourci": "sw","nom": "switch","prix": "5.00"},
        {"id": 3,"raccourci": "fx","nom": "faux","prix": "0.00"}
    ]
    const [categorie, setCategorie] = useState("");
    return(
        <Stack>
            <Center>
                <h1 style={{margin:"10px"}}>Listes des produits de {categorie}</h1>
            </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <ProductsSelector
                    productsList={productsList}
                />
            </Box>
        </Stack>
    );
}

export default Edit;