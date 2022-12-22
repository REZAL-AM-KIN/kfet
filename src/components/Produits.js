import React from "react";
import {forwardRef, useState} from "react";
import {UnstyledButton, Container, Group, Text, TextInput, Button, useMantineTheme, Stack} from "@mantine/core";
import errorNotif from "./ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useCatColor} from "../hooks/useCategorie";



const Produit = (({nom, raccourci, prix, sx, ...others}) => (
        <UnstyledButton sx={sx}>
            <Group position="apart" {...others}>
                <Stack>
                    <Text>{nom}</Text>
                    <Text size="xs" color="dimmed">({raccourci})</Text>
                </Stack>
                <Text>{prix}</Text>
            </Group>
        </UnstyledButton>
    )
);

function ProduitSelector({n, produits}) {
    const [catColor, ] = useCatColor();
    return(produits.map((produit, key) => {
        return(<Produit nom={produit.line.nom}
                        raccourci={produit.line.raccourci}
                        prix={produit.line.prix}
                        key={key}
                        sx={{backgroundColor:catColor}}
        />);
    }))
}


function Produits({pgData, produits, categorie, onDebucuqage}) {

    const theme = useMantineTheme();
    const axiosPrivate = useAxiosPrivate();
    const [value, setValue] = useState("");

    // create the list of produits in the categorie
    let produits_list = [];
    for (let line of produits) {
        if (line["nom_entite"] === categorie) {
            produits_list.push({line});
        }
    }

    const onItemSubmit = (item) => {
        const createBucquage = async () => {
            try {
                await axiosPrivate.post("bucquages/",
                    JSON.stringify({
                        cible_bucquage: pgData.id,
                        id_produit: item.id
                    }));
                if (onDebucuqage) {
                    onDebucuqage();
                }
            } catch (error) {
                errorNotif("Debucquage", error);
            }
        }
        createBucquage();
    }

    return (
        <Container p={0}>
            <TextInput placeholder="Rechercher un Produit"
                       value={value}
                       onChange={(e) => {
                           setValue(e.currentTarget.value)
                       }}
            />
            <Group>
                <ProduitSelector n={6}
                                 produits={produits_list.filter(obj =>
                                     obj.line.nom.toLowerCase().includes(value.toLowerCase()) ||
                                     obj.line.raccourci.includes(value.toLowerCase())
                                 )}/>
            </Group>
        </Container>
    );
}

export default Produits;