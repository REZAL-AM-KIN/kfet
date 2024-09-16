import {Group, MultiSelect, Stack, Text, Loader} from "@mantine/core";
import {useConsommateurList} from "../hooks/useConsommateurs";
import {forwardRef, useEffect, useState} from "react";
import {useDebouncedState} from "@mantine/hooks";

const SelectItem = forwardRef(
    ({ bucque, fams, prenom, nom, proms, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Stack>
                <div>
                    <Group position="apart">
                        <Text>{bucque}</Text>
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


const ManagersSelector = ({initial_managers, onChange, ...props})=>{
    const {consommateurList, setSearch, isLoading} = useConsommateurList(5)
    const [debounced, setDebounced] = useDebouncedState('', 300);
    const [values, setValues] = useState([]);
    const [data, setData] = useState([]);

    const removeUnusedOptions = () => {
        setData((prev) => prev.filter(item => values.includes(item.value)))
    }

    const composeOption = (items) => {
        console.log("composeOption:", items)
        const tempData = items.map(({...consommateur})=>({
            label:consommateur.bucque+" "+consommateur.fams,
            value: consommateur.id,
            ...consommateur,
        }))
        data.forEach((pg) => {
            if (!(tempData.find(item => item.value === pg.id))) {
                tempData.push({
                    value: pg.id,
                    label: pg.bucque+" "+pg.fams,
                    ...pg,
                })
            }
        });
        setData(tempData)
    }

    useEffect(()=>{
        if (debounced) {
            removeUnusedOptions();
        }
        setSearch(debounced)
    },[setSearch, debounced])

    useEffect(() => {
        if (initial_managers){
            composeOption(initial_managers);
            setValues(initial_managers.map(item => item.id));
        }
    }, [initial_managers]);


    useEffect(() => {
        if (consommateurList.length > 0) {
            composeOption(consommateurList);
        }
    }, [consommateurList]);

    //TODO ne pas clear le champ de recherche quand on sélectionne un PG
    return (
        <MultiSelect
          data={data}
          label="Managers"
          itemComponent={SelectItem}
          searchable
          filter={() => true}
          nothingFound="Aucun PG trouvé..."
          clearable
          limit={5}
          onSearchChange={setDebounced}
          withinPortal
          rightSection={isLoading ? <Loader size="1rem" /> : null}

          {...props}
          value={values}
          onChange={(v) => {
              setValues(v);
              onChange(v);
          }}
        />
    );

}

export default ManagersSelector