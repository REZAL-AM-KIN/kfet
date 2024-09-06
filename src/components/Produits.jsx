import {useState, forwardRef, useEffect} from "react";

import {Input, Stack, Text, createStyles, LoadingOverlay, Box} from "@mantine/core";
import {getHotkeyHandler, useDebouncedValue} from "@mantine/hooks";

import { useBucquage } from "../hooks/useBucquage";
import { useProductsList } from "../hooks/products/useProductsList";


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

    const useproductslist = useProductsList(entite.id, length);
    const usebucquage = useBucquage();

    const [recherche, setRecherche] = useState("");
    const [selected, setSelected] = useState(0);
    const [debounced] = useDebouncedValue(recherche, 300);

    var itemId = 0;

    const onItemSubmit = (item) => {
        if (!item) return;
        if (usebucquage.isLoading) return;
        usebucquage.bucquage(pgData.id, item.id, onSubmit);
    }

    useEffect(()=>{
        useproductslist.setSearch(debounced);
        setSelected(0);
    }, [debounced]);

    useEffect(() => {
        if (!usebucquage.isLoading && ref.current) {
            ref.current.focus();
        }
    }, [usebucquage.isLoading]);

    const ProduitItem = forwardRef(
        ({item, raccourci, nom, prix, ...others}, itemRef) => (
            <Text ref={itemRef}
                onClick={()=>{
                    onItemSubmit(item);
                    ref.current.focus();}}
                {...others}
            >{raccourci} - {nom} - {prix}</Text>
        )
    );

    const hotkeys = [
        ["ArrowUp", () => setSelected((current) => (current > 0 ? current - 1 : 0))],
        ["ArrowDown", () => setSelected((current) => (current < useproductslist.productsList.length - 1 ? current + 1 : current))],
        ["Enter", () => onItemSubmit(useproductslist.productsList[selected])],
        ["Escape", () => {setSelected(0); setRecherche("")}] // reset selected item and search field
    ]

    return (
        <Input.Wrapper onKeyDown={getHotkeyHandler(hotkeys)}>
            <Input
                placeholder="Rechercher un produit"
                value={recherche}
                onChange={(event) => setRecherche(event.currentTarget.value)}
                ref={ref}
                disabled={usebucquage.isLoading}
            />
            <Box pos="relative" mih="3rem">
                <LoadingOverlay visible={useproductslist.isLoading} overlayBlur={2} />
                <Stack spacing="xxs">
                    {useproductslist.productsList.map((item) => {
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
            </Box>
        </Input.Wrapper>
    );
}

export default Produits;
