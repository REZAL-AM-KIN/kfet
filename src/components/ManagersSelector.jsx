import {Group, MultiSelect, Stack, Text} from "@mantine/core";
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


const ManagersSelector = ({...props})=>{
    const {consommateurList, retrieveConsommateurs} = useConsommateurList()
    const [debounced, setDebounced] = useDebouncedState('', 300);
    const [selectorData, setSelectorData] = useState([])

    useEffect(()=>{
        retrieveConsommateurs(debounced)
    },[debounced])

    useEffect(()=>{
        const data = consommateurList.map(({...consommateur})=>({
            key:consommateur.id,
            label:consommateur.bucque+" "+consommateur.fams,
            value: consommateur.id,
            ...consommateur,
        }))
        setSelectorData(data)
    }, [consommateurList])

    return (
      <MultiSelect
          data={selectorData}
          label="Managers"
          itemComponent={SelectItem}
          searchable
          filter={(value, item) =>
              true}
          nothingFound="Aucun PG trouvé..."
          clearable
          limit={5}
          onSearchChange={setDebounced}
          {...props}
      />
    );
}

export default ManagersSelector