import {forwardRef} from "react";
import {useNavigate} from "react-router-dom";
import {Group, Stack, Text, useMantineTheme} from "@mantine/core";
import { useConsommateurList } from "../hooks/useConsommateurs";
import Autocomplete from "./Autocomplete";

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

const SearchPg = ({onSubmit})=>{

    const theme = useMantineTheme()

    const navigate = useNavigate();

    const {consommateurList} = useConsommateurList();

    //Pour que autocompltete fonctionne, il faut obligatoirement un champ value. On transforme donc le champ bucque en value
    const data = consommateurList.map(({bucque, ...pg}) =>{
        return { value: bucque, ...pg}
    })

    const onItemSubmit = (e)=>{
        if (onSubmit) {
            onSubmit(e);
        }
        navigate("pg/"+e.id);
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
            hoverOnSearchChange
        />


    );
}

export default SearchPg
