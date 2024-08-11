import {Box, Button, LoadingOverlay, Modal, NumberInput, Stack, Text, useMantineTheme} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useFinssProducts} from "../../hooks/finssHooks/useFinssProduct";
import {useEffect, useState} from "react";
import {DataTable} from "mantine-datatable";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "../../hooks/useUser";
import {useUserParticipation} from "../../hooks/finssHooks/useUserParticipation";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";


const FinssRegisterModal = ({opened, setOpened, finssId})=>{
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')


    const userInfo = useUser()
    const useParticipation = useUserParticipation()
    const {isLoading, productsList} = useFinssProducts(finssId)

    const [isSending, setSending] = useState(false)

// initialisation de la user form. La liste des produits est vide
    const form = useForm({
        initialValues:{
            products:[]
        }
    })



//TODO : Pb avec useParticipation.participations qui reste = undefined du coup pas de récupération des participations
//on remplie la liste des produits en renommant l'attribue id en "key"
    useEffect(()=>{
        const data = productsList.map(({id, ...product}) => {
            let prebucque_quantity = (product.obligatoire ? 1: 0)

            //On vérifie que la participation n'est pas en loading
            if (!useParticipation.isLoading) {
                //On selectionne l'objet pariticipation qui correspond au produit
                const participation = useParticipation.participations.find((participation) => participation.product_participation === id)

                //Si une participation est trouvée alors on récupère la quantité déjà prébucquée
                prebucque_quantity = participation && participation.prebucque_quantity // On regarde si une participation pour le produit existe
            }

            return {key:id, ...product, qts: prebucque_quantity}
        })
        form.setValues({products:data})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productsList, useParticipation.participations, useParticipation.isLoading])

    //Fonction de submit de la form
    function sendParticipation(values){

        const participations = values.products.map(({key,qts})=>(
            {cible_participation:userInfo.id, product_participation:key, prebucque_quantity:qts}
        ))
        setSending(true)
        useParticipation.sendPrebucquage(participations).then((success)=>{
            if(success){
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Inscription réussie',
                    message: 'Votre inscription a bien été prise en compte.'
                })
            }
            setSending(false)
            closeModal()
        })


    }

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
            <Stack sx={{
                background: theme.colors.gray[1],

            }}>
                <Text truncate sx={{marginLeft: 40, whiteSpace: "normal", overflowWrap: "anywhere"}}> {product.description}</Text>
            </Stack>
        )
    }

    return (
        <Modal opened={opened} onClose={closeModal} size="lg">
            <Box sx={{position:"relative"}}>
                <LoadingOverlay visible={isSending} />

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

                    <Button sx={{width:"100%", marginTop: 10}} type="submit">Valider</Button>
                </form>
            </Box>
        </Modal>
    )
}

export default FinssRegisterModal;