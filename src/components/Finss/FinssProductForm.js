import {useForm} from "@mantine/form";
import {Button, Center, NumberInput, Switch, Textarea, TextInput} from "@mantine/core";
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
const FinssProductForm = ({initialProduct, formSubmitCallback}) => {

    // Initialisation de la Form des paramètres d'un produit
    const form = useForm({
        initialValues:{
            "id" : null,
            "nom": "",
            "description": "",
            "prix_total": 0,
            "prix_min": 0,
            "obligatoire": false,
        },
        validateInputOnChange:["nom", "description"],

        validate:{
            nom: (value) => (value.length>30 ? "Le nom doit faire moins de 30 caractères" :
                value.length===0 ? "Le titre est obligatoire !": null),
            description: (value) => (value.length>100 ? "La description doit faire moins de 100 caractères" : null),

        },
    })

    useEffect(()=>{
        form.setValues(initialProduct)
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
                hideControls
                {...form.getInputProps('prix_total')}
            />

            <NumberInput
                placeholder="Prix minimum"
                label="Prix minimum"
                withAsterisk
                precision={2}
                hideControls
                {...form.getInputProps('prix_min')}
            />


                <Switch
                    labelPosition="left"
                    label="Produit obligatoire"
                    {...form.getInputProps('obligatoire',{type:'checkbox'})}
                />

            <Button disabled={!form.isValid()} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
        </form>
    )

}

export default FinssProductForm;