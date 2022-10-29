import {forwardRef, useState} from "react";
import {Autocomplete, Group, Text, useMantineTheme} from "@mantine/core";
import errorNotif from "./ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const AutoCompleteItem = forwardRef(({value, nom, raccourci, prix, ...others}, ref) => (
        <Group position="apart" ref={ref} {...others}>
            <Group>
                <Text>{nom}</Text>
                <Text size="xs" color="dimmed">({raccourci})</Text>
            </Group>
            <Text>{prix}</Text>
        </Group>
    )
);


function Produits({pgData, produits, categorie, onDebucuqage}) {

    const theme = useMantineTheme();
    const axiosPrivate = useAxiosPrivate();
    const [value, setValue] = useState("");

    // create the list of produits in the categorie
    let produits_list = [];
    for (let line of produits) {
        if (line["nom_entite"] === categorie) {
            produits_list.push({value: line.nom, ...line});
        }
    }

    const onItemSubmit = (e) => {
        const createBucquage = async () => {
            try {
                await axiosPrivate.post("bucquages/",
                    JSON.stringify({
                        cible_bucquage: pgData.id,
                        id_produit: e.id
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
        <Autocomplete
            data={produits_list}
            itemComponent={AutoCompleteItem}
            limit={6}
            value={value}
            onChange={setValue}
            onItemSubmit={(e) => {
                onItemSubmit(e);
                setValue("");
            }}
            placeholder="Rechercher un Produit"
            nothingFound="Aucun produit trouvé :("
            styles={{
                input: {
                    width: "100%",
                    borderRadius: 9,
                    borderStyle: "none",
                    borderWidth: 2,
                    '&:focus': {
                        borderStyle: "solid",
                        borderColor: theme.fn.variant({variant: 'filled', color: theme.primaryColor}).background
                    }
                }
            }}
            filter={(value, item) =>
                item.nom.toLowerCase().includes(value.toString().toLowerCase().trim()) ||
                item.raccourci.toLowerCase().includes(value.toString().toLowerCase().trim())
            }
        />
    );
}

export default Produits;