import {Box, Button, Modal, NumberInput, Stack, Text, useMantineTheme} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useFinssProducts} from "../hooks/finssHooks/useFinssProduct";
import {useEffect} from "react";
import {DataTable} from "mantine-datatable";
import {useMediaQuery} from "@mantine/hooks";

function sendParticipation(values){
    console.log(values)
    //TODO: Faire l'envoie des participations (prébucquage) --> Finir backend
}


const FinssRegisterModal = ({opened, setOpened, finssId})=>{
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')


    const {isLoading, productsList} = useFinssProducts(finssId)

// initialisation de la user form. La liste des produits est vide
    const form = useForm({
        initialValues:{
            products:[]
        }
    })


//on remplie la liste des produits en renommant l'attribue id en "key"
    useEffect(()=>{
        const data = productsList.map(({id, ...product}) => ({key:id, ...product, qts: (product.obligatoire ? 1: 0)}))
        form.setValues({products:data})
    },[productsList])



    function closeModal(){
        setOpened(false);
    }


    // on extrait tous les produits existant dans la form car on a besoin de l'index de la form pour bind le
    // NumberInput de chaque produit à la form.
    // On en profite pour attribuer "index" à "id" car le champs id sert de key pour le component Datatable.
    const tableData = form.values.products.map((item,index)=>({...item, index, id:index}))


    const QtsInput = ({item})=> {
        return (
                <NumberInput
                    min={item.obligatoire ? 1 : 0}
                    {...form.getInputProps('products.' + item.index + '.qts', {type: 'numberinput'})}
                />
                );
    }

    const RowDescription = ({product}) => {
        if (product.description===""){
            return
        }

        return (
            <Stack style={{
                background: theme.colors.gray[1],

            }}>
                <Text style={{marginLeft: 40, textAlign:"justify"}}> {product.description}</Text>
            </Stack>
        )
    }

    return (
        <Modal opened={opened} onClose={closeModal}>
            <form onSubmit={form.onSubmit((values)=>sendParticipation(values))}>
               <Box sx={{height: isSmallDevice ? 300:400}}>
                   <DataTable
                       minHeight={150} //Pour l'affichage du logo "pas de produits trouvés"
                       fetching={isLoading}
                       records={tableData}
                       columns={[
                           {accessor: "nom", title:"Nom"},
                           {accessor: "actions", title:"Quantités", textAlignment:"center", width:"20%", render: (product) => (<QtsInput item={product}/>) }
                       ]}
                       noRecordsText="Aucun produit n'existe pour ce fin'ss"
                       rowExpansion={{
                           trigger: "always",
                           content: ({record})=>(<RowDescription product={record}/>),
                       }}
                   >

                   </DataTable>
               </Box>

                <Button style={{width:"100%", marginTop: 10}} type="submit">Valider</Button>
            </form>
        </Modal>
    )
}

export default FinssRegisterModal;