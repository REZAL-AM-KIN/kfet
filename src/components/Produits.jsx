import {useState} from "react";


function Produits({produits, categorie}) {

    const [selectedProduit, setSelectedProduit] = useState(null);

    let produits_list = [];
    for (let line of produits) {
        if (line["nom_entite"] === categorie) {
            produits_list.push(line);
        }
    }

    return (
        <>
            <div>shows the products list "{produits_list.toString()}" corresponding to the categorie "{categorie.toString()}"</div>
            <div> the product selected is {selectedProduit?selectedProduit.toString():"NONE"}</div>
        </>
    );
}

export default Produits;