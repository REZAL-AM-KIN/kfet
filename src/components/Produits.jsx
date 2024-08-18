import {useState, forwardRef, useEffect} from "react";

import {Input, Stack, Text, Tooltip, createStyles} from "@mantine/core";
import {getHotkeyHandler, useHotkeys} from "@mantine/hooks";

import {useProduitByEntite} from "../hooks/useProduitByEntite";
import { useBucquage } from "../hooks/useBucquage";


const useStyles = createStyles((theme) => ({
    selected: {
        backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]],
        color: theme.colors.gray[0],
        "&:hover": {
            backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]-2],
        },
    },
    // to distinguish the odd/even rows
    even: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        },
    },
    odd: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        },
    },
}));


function Produits({entite, length, pgData, onSubmit, ...others}, ref) {

    const {classes} = useStyles();

    const produits = useProduitByEntite(entite.id);
    const {bucquage} = useBucquage();

    const [filteredProduits, setFilteredProduits] = useState(produits.data);
    const [recherche, setRecherche] = useState("");
    const [selected, setSelected] = useState(0);

    var itemId = 0;

    const onItemSubmit = (item) => {
        if (!item) return;
        // console.log("Produits: Submit item");
        bucquage(pgData.id, item.id, onSubmit);
        // console.log("Produits: Submit item: bucquage done", isLoading);
        ref.current.focus();
    }

    // TODO: chemin de la flemme. Ecrire un onChange plutot que de faire un useEffect
    useEffect(() => {
        if (!produits.data) return;
        // function to filter the products
        setFilteredProduits(produits.data.filter((item) => {
            if (recherche.startsWith("!")) {
                // ! is a search by produit nom
                return item.nom.toLowerCase().includes(recherche.substring(1).toLowerCase().trim())
            } else {
                // search by raccourci
                return item.raccourci.toLowerCase().includes(recherche.toLowerCase().trim())
            }
        }));
    }, [recherche, produits.data]);

    const ProduitItem = forwardRef(
        ({item, raccourci, nom, prix, ...others}, itemRef) => (
            <Text ref={itemRef}
                onClick={()=>{
                    onItemSubmit(item);}}
                {...others}
            >{raccourci} - {nom} - {prix}</Text>
        )
    );

    const hotkeys = [
        ["ArrowUp", () => setSelected((current) => (current > 0 ? current - 1 : 0))],
        ["ArrowDown", () => setSelected((current) => (current < filteredProduits.length - 1 ? current + 1 : current))],
        ["Enter", () => onItemSubmit(filteredProduits[selected])],
        ["Escape", () => {setSelected(0); setRecherche(""); ref.current.blur()}] // reset selected item and search field
    ]

    const shortcut = "alt+R";
    useHotkeys([[shortcut, ()=>ref.current.focus()]])

    return (
        <Input.Wrapper onKeyDown={getHotkeyHandler(hotkeys)}>
            <Tooltip label="! pour rechercher par nom" position="right" withArrow>
                <Input
                    placeholder={`Rechercher un produit (${shortcut})`}
                    value={recherche}
                    onChange={(event) => {
                        setRecherche(event.currentTarget.value);
                        setSelected(0)}} // reset selected item when user types
                    ref={ref}
                />
            </Tooltip>
            <Stack spacing="xxs">
                {filteredProduits.map((item) => {
                    itemId ++;
                    if (itemId > length) {
                        return null;
                    }
                    return (
                        <ProduitItem
                            item={item}
                            raccourci={item.raccourci}
                            nom={item.nom}
                            prix={item.prix}
                            key={itemId-1}
                            className={itemId-1 === selected // if selected
                                        ? classes.selected
                                        : itemId % 2 === 0
                                            ? classes.even // else, distinguish rows
                                            : classes.odd}
                        />
                    )
                })}
            </Stack>
        </Input.Wrapper>
    );
}

export default Produits;
