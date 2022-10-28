import React from 'react';


function Categories({produits, permissions, value, onChange}) {

    let categories = [];
    for (let line of produits) {
        if (!categories.includes(line["nom_entite"])) {
            if (permissions.all || permissions.groupes.includes(line["nom_entite"])) {
                categories.push(line["nom_entite"]);
            }
        }
    }


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