import React from 'react';
import {useCatColor, useCategorieCtxt} from "../hooks/useCategorieCtxt";
import {Button, Group, useMantineTheme} from "@mantine/core";
import {useCategorieList} from "../hooks/useCategorieList";


function CategoriesSelector({refForOutsideClick, setActive}) {
    const theme = useMantineTheme()

    const [categorie, setCategorie] = useCategorieCtxt();
    const [catColor, setCatColor] = useCatColor();
    const usecategorielist = useCategorieList();

    function colorMixer(color1,color2){
        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }

// this function takes an array of 3 RGB integer values and converts this array into a CSS color, like this: #AAAAA
        function rgbToHex([r, g, b]) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

// the regex is separating the value into groups of 2 characters, these characters being letters from 'a' to 'f' and digits, that is to say hexadecimal numbers.
        function convert(color) {
            return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color).map(x=>parseInt('0x'+x)).slice(1, 4)
        }
        const [c1,c2]= [color1,color2].map(x=>convert(x))
        // this variable will be the array of the mixed color
        let cm = []
        // we take the middle of each RGB value between the two colors
        c1.forEach((c,i) => cm.push(parseInt((c1[i]+c2[i])/2)))
        // we convert the value into a CSS value
        return(rgbToHex(cm))
    }

    return (
        <Group ref={refForOutsideClick}>
            {usecategorielist.entitiesList.map((cat, key) => {
                return (
                    <Button key={key}
                            variant="gradient"
                            gradient={{ from: colorMixer(catColor===""?theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background//expression à rallonge qui permet d'avoir la même couleur que le fond de la navBar
                                    :catColor, cat.color) //on utilise le milieu pour avoir un gradient plus doux, sinon c'est dégueulasse
                                    , to: cat.color}}
                            onClick={() => {
                                setCategorie(cat.nom);
                                setCatColor(cat.color);
                                setActive(false);
                            }}
                    >{cat.nom}</Button>
                );
            })}
        </Group>

    );
}

export default CategoriesSelector;
