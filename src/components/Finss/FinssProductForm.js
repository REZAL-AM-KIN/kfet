import {useForm} from "@mantine/form";
import {Button, NumberInput, Switch, Textarea, TextInput} from "@mantine/core";
import {useEffect} from "react";

/*
Permet d'obtenir une form d'édition ou de création de produit.
Si initialProduct est spécifié alors les valeurs de la form seront celles du produit passé
Il faut implementer "formSubmitCallback" pour la gestion du submit de la form
Exemple:

func formSubmitCallback(values){
    console.log(values)
}

 */
const FinssProductForm = ({initialProduct, formSubmitCallback, disabled}) => {

    // Initialisation de la Form des paramètres d'un produit
    const form = useForm({
        initialValues:{
            "id" : null,
            "nom": "",
            "description": "",
            "prix_total": 0,
            "solde_requis": 0,
            "obligatoire": false,
        },
        validateInputOnChange:["nom", "description", "prix_total", "solde_requis"],

        validate:{
            nom: (value) => (value.length>30 ? "Le nom doit faire moins de 30 caractères" :
                value.length===0 ? "Le titre est obligatoire !": null),
            description: (value) => (value.length>100 ? "La description doit faire moins de 100 caractères" : null),
            prix_total: (value) => (value<0 ? "Le prix total doit être positif" :
                value.length===0 ? "Le prix total est obligatoire !": null),
            solde_requis: (value) => (value<0 ? "Le solde minimum sur le compte du pg doit être positif" :
                value.length===0 ? "Le solde minimum requis est obligatoire !": null),

        },
    })

    useEffect(()=>{
        form.setValues(initialProduct)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialProduct])

    return (
        <form onSubmit={form.onSubmit((values) => formSubmitCallback(values))}>
            <TextInput
                label="Nom"
                placeholder = "Nom"
                {...form.getInputProps('nom')}
                withAsterisk
            />
            <Textarea
                label="Description"
                placeholder = "Description"
                autosize
                minRows={2}
                maxRows={4}
                {...form.getInputProps('description')}

            />

            <NumberInput
                placeholder="Prix total pour le produit"
                label="Prix total"
                withAsterisk
                precision={2}
                decimalSeparator=","
                hideControls
                {...form.getInputProps('prix_total')}
            />

            <NumberInput
                placeholder="Solde minimum requis sur le compte du PG"
                label="Solde minimum"
                withAsterisk
                precision={2}
                decimalSeparator=","
                hideControls
                {...form.getInputProps('solde_requis')}
            />


                <Switch
                    labelPosition="left"
                    label="Produit obligatoire"
                    {...form.getInputProps('obligatoire',{type:'checkbox'})}
                />

            <Button disabled={!form.isValid() || disabled} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
        </form>
    )

}

export default FinssProductForm;