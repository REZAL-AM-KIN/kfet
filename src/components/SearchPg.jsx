import {forwardRef} from "react";
import {Group, Stack, Text, useMantineTheme} from "@mantine/core";
import { useConsommateurList } from "../hooks/useConsommateurs";
import {Autocomplete} from "@mantine/core";

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

const SearchPg = ({onSubmit, withBorder, ...othersProps})=>{

    const theme = useMantineTheme()

    const {consommateurList} = useConsommateurList();

    //Pour que l'autocomplétion fonctionne, il faut obligatoirement un champ "value". On transforme donc le champ bucque en value
    const data = consommateurList.map((pg) =>{
        return {id: pg.id, value: pg.bucque, fams: pg.fams, nom: pg.nom, prenom: pg.prenom, proms: pg.proms}
    })

    return (
        <Autocomplete
            data={data}
            itemComponent={AutoCompleteItem}
            limit={6}
            onItemSubmit={onSubmit}
            placeholder="Rechercher un PG"
            nothingFound="Aucun PG trouvé :("
            styles={{
                input: {
                    width: "100%",
                    borderRadius: theme.radius.md,
                    borderStyle: withBorder ? "solid" : "none",
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

            {...othersProps}
        />


    );
}

export default SearchPg
