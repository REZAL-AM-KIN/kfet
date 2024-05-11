import {Autocomplete, Group, Stack, Text, useMantineTheme} from "@mantine/core";
import {forwardRef, useEffect, useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import errorNotif from "./ErrorNotif";
import {getHotkeyHandler} from "@mantine/hooks";

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

const SearchPg = ({refForOutsideClick, setActive})=>{


    const theme = useMantineTheme()

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [consommateurList, setConsommateurList] = useState([]);

    //retrieve All consomateur
    useEffect(() => {

        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("consommateurs/");
                setConsommateurList(response.data.results);
            } catch (error) {
                errorNotif("Catégories", error.message);
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
    const data = consommateurList.map((pg) =>{
        return {id: pg.id, value: pg.bucque, fams: pg.fams, nom: pg.nom, prenom: pg.prenom, proms: pg.proms}
    })


    const onItemSubmit = (e)=>{
        console.log("ee")
        setActive(false) //On ferme le popover quand un pg est sélectionné
        navigate("pg/"+e.id)
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
                    borderStyle: "none",
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
            onKeyDown={getHotkeyHandler([       // On ajoute un handler pour le onKeyDown pour fermer le Popover
                ['escape', ()=>setActive(false)],       //En appuyant sur escape.
            ])}
        />


    );
}

export default SearchPg
