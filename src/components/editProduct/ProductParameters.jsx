import {
    Box,
    Button,
    Center,
    Stack,
    TextInput,
    NumberInput,
    Checkbox,
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
            entite: "",
            suivi_stock: false,
            stock: 0
        },
        validateInputOnChange:["nom", "raccourci", "prix", "stock"],

        validate:{
            nom: (value) => (value.length>50 ? "Le nom doit faire moins de 50 caractères" :
                value.length===0 ? "Le titre est obligatoire !": null),
            raccourci: (value) => (value.length>3 ? "Le raccourci doit faire moins de 3 caractères" : null),
            prix: (value) => (value === null || value === ''
                ? 'Le prix est obligatoire !'
                : value >= 1000
                ? 'Le prix doit être inférieur à 1000€'
                : value < 0
                ? 'Le prix doit être positif'
                : null),
            stock: (value) => (value === '' ? 'Le stock doit être définit si on le suit' : value < 0 ? "Le stock doit être positif" : null),
        },
    })
    useEffect(()=>{
        if(Object.keys(useproductinfo.productInfo).length>0){
            form.setValues({ ...useproductinfo.productInfo, prix:parseFloat(useproductinfo.productInfo.prix),
                stock:useproductinfo.productInfo.stock === null ? 0 : useproductinfo.productInfo.stock})
        }else{
            form.setValues({ nom:"", raccourci:"", prix:0, entite:entity, suivi_stock: false, stock: 0})
            //on met des valeurs nulles et on définit l'entité à celle de travail actuel
        }
    // eslint-disable-next-line
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
                            required
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
                            required
                            {...form.getInputProps('prix')}
                        />

                        <EntitySelector entitiesManageable={entitiesManageable}
                            required
                            {...form.getInputProps('entite')}
                        />

                        <Checkbox
                            label="Suivi de stock"
                            mt={theme.spacing.xs}
                            {...form.getInputProps('suivi_stock')}
                            checked={form.values.suivi_stock}
                            onChange={(event) => {
                                form.setFieldValue('suivi_stock', event.currentTarget.checked);
                                if (!event.currentTarget.checked && form.values.stock === '') {
                                    form.setFieldValue('stock', 0);
                                }
                            }}
                        />

                        {form.values.suivi_stock && (
                            <NumberInput
                                label="Stock"
                                placeholder = "Stock"
                                hideControls
                                required
                                {...form.getInputProps('stock')}
                            />
                        )}

                        <Button disabled={!form.isValid()} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                    </form>
                </Box>
            </Center>
        </Stack>


    )
}
export default ProductParameters;
