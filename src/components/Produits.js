import React, {forwardRef} from "react";
import {useState} from "react";
import {
    Container,
    Autocomplete,
    SelectItemProps, Group,
    Text
} from "@mantine/core";
import errorNotif from "./ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


interface ItemProps extends SelectItemProps {
    nom: string;
    raccourci: string;
    prix: string;
}

const AutoCompleteItem = forwardRef(
    ({ nom, raccourci, prix, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Text>{raccourci}</Text>
                <Text>{nom}</Text>
                <Text>{prix}</Text>
            </Group>
        </div>
    )
);


function Produits({pgData, produits, categorie, onDebucuqage}) {

    const axiosPrivate = useAxiosPrivate();

    const [value, setValue] = useState("");

    // create the list of produits in the categorie
    let produits_list = [];
    for (let line of produits) {
        if (line["nom_entite"] === categorie) {
            produits_list.push({value:line.nom, ...line});
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
            <Autocomplete
                label={"Recherche un produit"}
                placeholder={"TODO"}
                data={produits_list}
                value={value}
                onChange={setValue}
                itemComponent={AutoCompleteItem}
                filter={(value, item) =>
                    item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                    item.raccourci.toLowerCase().includes(value.toLowerCase().trim())
                }
                limit={5}
                radius={"xl"}

            />
        </Container>
    );
}

export default Produits;