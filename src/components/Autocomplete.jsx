import {useState, forwardRef, useEffect} from "react";
import {Input, Stack, Text, createStyles} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";


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


function Autocomplete({data, filter, itemComponent, limit, onItemSubmit, placeholder, ...others}) {

    const {classes} = useStyles();


    const [filteredData, setFilteredData] = useState(data);
    const [recherche, setRecherche] = useState("");
    const [selected, setSelected] = useState(0);

    var itemId = 0;

    const submit = (item) => {
        if (!item) return;
        if (onItemSubmit) {
            onItemSubmit(item);
        }
    }

    // TODO: chemin de la flemme. Ecrire un onChange plutot que de faire un useEffect
    useEffect(() => {
        if (!data) return;
        // function to filter the products
        setFilteredData(data.filter((item) => {
            return item.toLowerCase().includes(recherche.substring(1).toLowerCase().trim())
        }));
    }, [recherche, data]);


    const ItemComponent = itemComponent 
        ? itemComponent
        : forwardRef(
            ({item, ...others}, itemRef) => (
                <Text ref={itemRef}
                    onClick={()=>{
                        submit(item);
                        // ref.current.focus();
                    }}
                    {...others}
                >{item}</Text>
            )
        );

    const hotkeys = [
        ["ArrowUp", () => setSelected((current) => (current > 0 ? current - 1 : 0))],
        ["ArrowDown", () => setSelected((current) => (current < filteredData.length - 1 ? current + 1 : current))],
        ["Enter", () => submit(filteredData[selected])],
        ["Escape", () => {setSelected(0); setRecherche("")}] // reset selected item and search field
    ]

    return (
        <Input.Wrapper onKeyDown={getHotkeyHandler(hotkeys)}>
            <Input
                placeholder={placeholder}
                value={recherche}
                onChange={(event) => {
                    setRecherche(event.currentTarget.value);
                    setSelected(0)}} // reset selected item when user types
                // ref={ref}
            />
            <Stack spacing="xxs">
                {filteredData.map((item) => {
                    itemId ++;
                    if (itemId > limit) {
                        return null;
                    }
                    return (
                        <ItemComponent
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

export default Autocomplete;
