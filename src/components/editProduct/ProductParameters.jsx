import {
    Box,
    Button,
    Center,
    Stack,
    TextInput,
    NumberInput,
    useMantineTheme
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect} from "react";
import EntitySelector from "./EntitySelector";
import {useProductInfo} from "../../hooks/products/useProductInfo";
import {usePermissions} from "../../hooks/useUser";



const ProductParameters = ({productId,setModalOpened, entity})=>{
    const theme = useMantineTheme();
    const useproductinfo = useProductInfo(productId);
    const permissions = usePermissions();
    const entitiesManageable = permissions.entities_manageable;
    // Initialisation de la Form des paramètres du produit
    const form = useForm({
        initialValues:{
            nom: "",
            raccourci : "",
            prix : 0,
            entite: ""
        },
        validateInputOnChange:["nom", "raccourci", "prix"],

        validate:{
            nom: (value) => (value.length>50 ? "Le nom doit faire moins de 50 caractères" :
                value.length===0 ? "Le titre est obligatoire !": null),
            raccourci: (value) => (value.length>3 ? "Le raccourci doit faire moins de 3 caractères" : null),
            prix: (value) => (value === undefined
                ? 'Le prix est obligatoire !'
                : value >= 1000
                ? 'Le prix doit être inférieur à 1000€'
                : value < 0
                ? 'Le prix doit être positif'
                : null),
        },
    })
    useEffect(()=>{
        if(Object.keys(useproductinfo.productInfo).length>0){
            form.setValues({ ...useproductinfo.productInfo, prix:parseFloat(useproductinfo.productInfo.prix)})
        }else{
            form.setValues({ nom:"", raccourci:"", prix:0, entite:entity}) //on met des valeurs nulles et on définit l'entité à celle de travail actuel
        }
    }, [useproductinfo.productInfo])

    function formSubmit(values) {
        if(productId){
            useproductinfo.updateProduct(values).then(()=>setModalOpened(false))
        }else{
            useproductinfo.addProduct(values).then(()=>setModalOpened(false))
        }
    }


    //Construction de l'UI
    return (
        <Stack>
            <Center style={{paddingTop:20}}>
                <Box style={{width:400, position:'relative'}}>
                    <form  onSubmit={form.onSubmit((values) => formSubmit(values))}>
                        <TextInput
                            label="Nom"
                            placeholder = "Nom"
                            withAsterisk
                            {...form.getInputProps('nom')}
                        />
                        <TextInput
                            label="Raccourci"
                            placeholder = "Raccourci"
                            {...form.getInputProps('raccourci')}
                        />
                        <NumberInput
                            label="Prix"
                            placeholder = "Prix"
                            precision={2}
                            hideControls
                            withAsterisk
                            {...form.getInputProps('prix')}
                        />

                        <EntitySelector entitiesManageable={entitiesManageable}
                            withAsterisk
                            {...form.getInputProps('entite')}
                        />

                        <Button disabled={!form.isValid()} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                    </form>
                </Box>
            </Center>
        </Stack>


    )
}
export default ProductParameters;
