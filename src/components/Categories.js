import React, {useEffect} from 'react';


function Categories({produits, permissions, value, onChange}) {

    let categories = [];

    useEffect(() => {
        if (Object.keys(permissions).length && !categories.length) {
            if(categories.length === 0){
                console.log("longeur de la liste: ", categories.length);
                console.log('liste: ', categories);
                console.log("longeur de la liste: (je suis peux etre con) ", categories.length);
            }
            for (let line of produits) {
                if (!categories.includes(line["nom_entite"])) {
                    if (permissions.all || permissions.groupes.includes(line["nom_entite"])) {
                        categories.push(line["nom_entite"]);
                    }
                }
            }
            if (categories.includes(permissions.ipIdentification[0])) {
                onChange(permissions.ipIdentification[0]);
            }
        }
        // eslint-disable-next-line
    }, [produits, permissions]);


    return (
        <>
            <div> shows the categories list {categories.toString()} corresponding to the permissions
                "{permissions.toString()}"
            </div>
            <div> the categorie selected is {value.toString()}</div>
        </>
    );
}

export default Categories;