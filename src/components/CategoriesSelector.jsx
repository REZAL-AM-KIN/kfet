import React from 'react';
import {Button, Group} from "@mantine/core";
import {useCatColor, useCategorieCtxt} from "../hooks/useCategorieCtxt";
import {useCategorieList} from "../hooks/useCategorieList";

/*
* This component is used to display the categories in the popover
* a click on a categorie will set the categorie in the context, the color of the categorie
* and close the popover (setActive(false))

The buttons are styled with the color of the categorie
and there is a shadow to make them pop out
*/
function CategoriesSelector({setActive}) {
    const [, setCategorie] = useCategorieCtxt();
    const [, setCatColor] = useCatColor();
    const usecategorielist = useCategorieList();

    return (
        <Group>
        {usecategorielist.entitiesList.map((cat, key) => {
            return (
                <Button key={key}
                    onClick={() => {
                        setCategorie(cat.nom);
                        setCatColor(cat.color);
                        setActive(false);
                    }}
                    radius="md"
                    style={{minWidth: 'fit-content', flexGrow: 1, backgroundColor:cat.color, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                >{cat.nom}</Button>
            );
        })}
        </Group>
    );
}

export default CategoriesSelector;
