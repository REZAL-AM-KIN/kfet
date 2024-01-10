import React from 'react';
import {Button, Group} from "@mantine/core";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";
import {useEntiteList} from "../hooks/useEntiteList";

/*
* This component is used to display the entites in the popover
* a click on a entite will set the entite in the context, the color of the entite
* and close the popover (setActive(false))

The buttons are styled with the color of the entite
and there is a shadow to make them pop out
*/
function EntiteSelector({setActive}) {
    const { setEntite } = useEntiteCtxt();
    const entiteList = useEntiteList();

    return (
        <Group>
        {entiteList.entitiesList.map((entite, key) => {
            return (
                <Button key={key}
                    onClick={() => {
                        setEntite(entite.id);
                        setActive(false);
                    }}
                    radius="md"
                    style={{minWidth: 'fit-content', flexGrow: 1, backgroundColor:entite.color, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                >{entite.nom}</Button>
            );
        })}
        </Group>
    );
}

export default EntiteSelector;
