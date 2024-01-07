import {useState, forwardRef, useEffect} from "react";

import {Input, Stack, Text} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";

import {useProduitByEntite} from "../hooks/useProduitByEntite";


function Produits({entiteId, length, onSubmit, ...others}, ref) {

    const produits = useProduitByEntite(entiteId);

    const [filteredProduits, setFilteredProduits] = useState(produits.data);
    const [recherche, setRecherche] = useState("");
    const [selected, setSelected] = useState(0);

    var itemId = 0;

    const onItemSubmit = (item) => {
        if (onSubmit) {
            onSubmit(item);
        }
        // ref.current.focus()
    }

    useEffect(() => {
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
                onClick={()=>{onItemSubmit(item); ref.current.focus();}}
                // TODO : onMouseEnter sets the selected item bypassing the axrrow navigation
                // change the style with mouse enter, juts for feeodback, keeping independent arrow nav and mouse nav
                onMouseEnter={()=>{setSelected(filteredProduits.indexOf(item))}}
                {...others}
            >{raccourci} - {nom} - {prix}</Text>
        )
    );

    const hotkeys = [
        ["ArrowUp", () => setSelected((current) => (current > 0 ? current - 1 : 0))],
        ["ArrowDown", () => setSelected((current) => (current < filteredProduits.length - 1 ? current + 1 : current))],
        ["Enter", () => onItemSubmit(filteredProduits[selected])],
        ["Escape", () => {setSelected(0); setRecherche("")}] // reset selected item and search field
    ]

    return (
        <Input.Wrapper onKeyDown={getHotkeyHandler(hotkeys)}>
            <Text>Selected: {selected}</Text>
            <Input
                placeholder="Rechercher un produit"
                value={recherche}
                onChange={(event) => {
                    setRecherche(event.currentTarget.value);
                    setSelected(0)}} // reset selected item when user types
                ref={ref}
            />
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
                            sx={{
                                backgroundColor: itemId-1 === selected ? "blue" : "white",
                                color: itemId-1 === selected ? "white" : "black"
                            }}
                        />
                    )
                })}
            </Stack>
        </Input.Wrapper>
    );
}

export default Produits;
