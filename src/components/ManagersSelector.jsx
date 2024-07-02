import {Group, MultiSelect, Stack, Text} from "@mantine/core";
import {useConsommateursList} from "../hooks/useConsommateursList";
import {forwardRef, useEffect, useState} from "react";

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
    const {consommateurs, isLoading} = useConsommateursList()
    const [selectorData, setSelectorData] = useState([])

    useEffect(()=>{
        const data = consommateurs.map(({...consommateur})=>({
            key:consommateur.id,
            label:consommateur.bucque+" "+consommateur.fams,
            value: consommateur.id,
            ...consommateur,
        }))
        setSelectorData(data)
    }, [consommateurs])

    return (
      <MultiSelect
          data={selectorData}
          label="Managers"
          itemComponent={SelectItem}
          searchable
          filter={(value, selected,item) =>
              !selected && (
              item.bucque.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.nom.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.prenom.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.fams.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.proms.toLowerCase().includes(value.toLowerCase().trim())
                        )
          }
          nothingFound="Aucun PG trouvé..."
          clearable
          limit={5}
          {...props}
      />
    );
}

export default ManagersSelector