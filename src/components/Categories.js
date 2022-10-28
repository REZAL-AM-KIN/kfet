import React, {useEffect, useState} from 'react';
import {useCategorie} from "../hooks/useCategorie";
import {IconBoxMultiple} from "@tabler/icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import errorNotif from "./ErrorNotif";
import {Button, Group, Popover} from "@mantine/core";


function Categories({value, onChange}) {

    const axiosPrivate = useAxiosPrivate();
    const [categorie, setCategorie] = useCategorie();
    const [categories, setCategories] = useState([]);
    const [catColor, setCatColor] = useState([]);

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
        <Popover
            width={300}
            position="right"
            styles={{
                dropdown: {
                    padding: 0,
                    borderRadius: 9,
                    borderStyle: "none"
                }
            }}
            shadow="md"
            offset={20}
            trapFocus
        >
            <Popover.Target>
                <IconBoxMultiple size={34} stroke={1.5}/>
            </Popover.Target>

            <Popover.Dropdown>
                <Group>
                    {categories.map((cat, key) => {
                        return (
                            <Button key={key}
                                    variant="gradient"
                                    gradient={{from: catColor, to: cat.color}}
                                    onClick={() => {
                                        setCategorie(cat.name);
                                        setCatColor(cat.color);
                                    }}
                            >{cat.name}</Button>
                        );
                    })}
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
}

export default Categories;