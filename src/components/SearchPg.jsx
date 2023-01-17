import {Autocomplete, Group, Stack, Text, useMantineTheme} from "@mantine/core";
import {forwardRef, useEffect, useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons";
import {getHotkeyHandler} from "@mantine/hooks";

/*
Composant qui propose la sélection d'un pg.

Lorsqu'un PG est sélectionné, la fonction "onSelectCallBack" est appelée et l'objet pg est passé en paramètre.

 */
const AutoCompleteItem = forwardRef(({ value, fams, prenom, nom, proms, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Stack>
                <div>
                    <Group position="apart">
                        <Text>{value}</Text>
                        <Text>{fams}</Text>
                    </Group>

                    <Group position="apart">
                        <Text size="xs" color="dimmed">{prenom} {nom}</Text>
                        <Text size="xs" color="dimmed">{proms}</Text>
                    </Group>
                </div>
            </Stack>
        </div>
    )
);

const SearchPg = ({refForOutsideClick, setActive, onSelectCallBack, withBorder, ...othersProps})=>{
    const theme = useMantineTheme()

    const axiosPrivate = useAxiosPrivate();

    const [consommateurList, setConsommateurList] = useState([]);


    //retrieve All consomateur
    useEffect(() => {

        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("consommateurs/");
                setConsommateurList(response.data.results);
            } catch (error) {

                showNotification({
                    icon: <IconX size={18} />,
                    color: "red",
                    autoClose: false,
                    title: 'Oh Oh....',
                    message: 'Une erreur est survenue: '+error.message,
                })
                console.log(error);
            }

        }
        getUsers();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);


    //Pour que autocompltete fonctionne, il faut obligatoirement un champ value. On transforme donc le champ bucque en value
    const data = consommateurList.map(({bucque, ...pg}) =>{
        return { value: bucque, ...pg}
    })


    const onItemSubmit = (pg)=>{
        onSelectCallBack(pg)
    }

    return (
        <Autocomplete
            data={data}
            itemComponent={AutoCompleteItem}
            limit={6}
            onItemSubmit={onItemSubmit}
            placeholder="Rechercher un PG"
            nothingFound="Aucun PG trouvé :("
            styles={{
                input: {
                    width: "100%",
                    borderRadius: 9,
                    borderStyle: withBorder ? "solid" : "none",
                    borderColor: theme.fn.variant({variant: 'filled', color: theme.primaryColor}),
                    borderWidth: 2,
                    '&:focus': {
                        borderStyle: "solid",
                        borderColor: theme.fn.variant({variant: 'filled', color: theme.primaryColor}).background
                    }
                }
            }}
            filter={(value, item) =>
                item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.nom.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.prenom.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.fams.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.proms.toLowerCase().includes(value.toLowerCase().trim())
            }
            ref={refForOutsideClick} //on passe en ref le useOutSideClick pour fermer la popover lorsqu'on clique en dehors du champ


            onKeyDown={setActive ? getHotkeyHandler([       // On ajoute un handler pour le onKeyDown pour fermer le Popover
                ['escape', ()=>setActive(false)],       //En appuyant sur escape.
            ]) : undefined}

            {...othersProps}

        />


    );
}

export default SearchPg