import React from 'react';
import {useCatColor, useCategorieCtxt} from "../hooks/useCategorieCtxt";
import {Button, Group} from "@mantine/core";
import {useCategorieList} from "../hooks/useCategorieList";

function CategoriesSelector({setActive}) {

    const [, setCategorie] = useCategorieCtxt();
    const [, setCatColor] = useCatColor();
    const usecategorielist = useCategorieList();

    return (
        <Group>
        {usecategorielist.entitiesList.map((cat, key) => {
            return (
                <Button key={key}
                    variant="fill"
                    onClick={() => {
                        setCategorie(cat.nom);
                        setCatColor(cat.color);
                        setActive(false);
                    }}
                    style={{minWidth: 'fit-content', flexGrow: 1, backgroundColor:cat.color}}
                >{cat.nom}</Button>
            );
        })}
        </Group>
    );
}

export default CategoriesSelector;
