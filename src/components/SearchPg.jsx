import {forwardRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Group, Stack, Text, useMantineTheme} from "@mantine/core";
import { useConsommateurList } from "../hooks/useConsommateurs";
import {Autocomplete} from "@mantine/core";

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

    const [value, setValue] = useState('');

    const {consommateurList} = useConsommateurList();

    //Pour que l'autocomplétion fonctionne, il faut obligatoirement un champ "value". On transforme donc le champ bucque en value
    const data = consommateurList.map((pg) =>{
        return {id: pg.id, value: pg.bucque, fams: pg.fams, nom: pg.nom, prenom: pg.prenom, proms: pg.proms}
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
            value={value}
            onChange={setValue}
            onDropdownClose={()=>setValue("")}
            styles={{
                input: {
                    width: "100%",
                    borderRadius: theme.radius.md,
                    borderStyle: "none",
                    borderWidth: 2,
                    '&:focus': {
                        borderStyle: "solid",
                        borderColor: theme.fn.variant({variant: 'filled', color: theme.primaryColor}).background
                    }
                },
                item: {
                    '&[data-hovered]': {
                        backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]],
                        color: theme.colors.gray[0],
                        "&:hover": {
                            backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]-1],
                        },
                    },
                },
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
