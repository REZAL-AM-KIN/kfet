import React, {useEffect, useState} from 'react';
import {useCatColor, useCategorie} from "../hooks/useCategorie";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import errorNotif from "./ErrorNotif";
import {Button, Group} from "@mantine/core";


function Categories({refForOutsideClick, setActive}) {

    const axiosPrivate = useAxiosPrivate();
    const [categorie, setCategorie] = useCategorie();
    const [catColor, setCatColor] = useCatColor();
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        const controller = new AbortController();
        const getCategories = async () => {
            try {
                const response = await axiosPrivate.get("entites/");
                setCategories(response.data.results);
                response.data.results.forEach((line) => {
                    if (line.name === categorie) {
                        setCatColor(line.color);
                    }
                });
            } catch (error) {
                console.log(error);
                errorNotif("Categories", error);
            }
        }
        getCategories();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [])


    return (
        <Group ref={refForOutsideClick}>
            {categories.map((cat, key) => {
                return (
                    <Button key={key}
                            variant="gradient"
                            gradient={{ from: catColor, to: cat.color }}
                            onClick={() => {
                                setCategorie(cat.name);
                                setCatColor(cat.color);
                                setActive(false);
                            }}
                    >{cat.name}</Button>
                );
            })}
        </Group>

    );
}

export default Categories;