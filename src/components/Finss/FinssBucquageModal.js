import {
    Box,
    Button,
    Modal,
    NumberInput,
    Stack,
    Text,
    useMantineTheme,
    Overlay,
    Group,
    ActionIcon,
    FocusTrap
} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useFinssProducts} from "../../hooks/finssHooks/useFinssProduct";
import {useEffect, useState} from "react";
import {DataTable} from "mantine-datatable";
import {useFocusTrap, useMediaQuery} from "@mantine/hooks";
import {useUser} from "../../hooks/useUser";
import {useUserParticipation} from "../../hooks/finssHooks/useUserParticipation";
import {showNotification} from "@mantine/notifications";
import {IconCheck, IconCross, IconX} from "@tabler/icons";
import SearchPg from "../SearchPg";


const FinssBucquageModal = ({opened, setOpened, usefinssproduct, usebucquage})=>{
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')


    const userInfo = useUser()
    const useParticipation = useUserParticipation()


    const [isSending, setSending] = useState(false)
    const [selectedPG, setSelectedPG] = useState()
    const [pgselectorValue, setPgselectorValue] = useState()
    const [focusOnPGSelector, setFocusOnPGSelector] = useState(true)

// initialisation de la user form. La liste des produits est vide
    const form = useForm({
        initialValues:{
            products:[]
        }
    })



    //on remplie la liste des produits en renommant l'attribue id en "key"
    //On rajoute les quantités pré-bucquées pour pouvoir les affichés facilement dans le tableau
    useEffect(()=>{
        const data = usefinssproduct.productsList.map(({id, ...product}) => {
            let prebucque_quantity = null
            let already_bucqued_quantity = null

            //Si il n'y a pas de PG selectionné, alors on ne récupère les quantités prébucquées
            if(selectedPG){
                //On selectionne l'objet bucquage (cf useBucquage) de l'utilisateur sélectionné
                const bucquage = usebucquage.bucquages.find(bucquage => bucquage.consommateur_id === selectedPG.id)

                //Si un bucquage est trouvé alors on récupère les participations
                if(bucquage){
                    //On selectionne la participation du bucquage qui correspond à l'id du produit.
                    const participation = bucquage.participation_event.find(participation => participation.product_participation === id)
                    prebucque_quantity = participation ? participation.prebucque_quantity : 0 // On regarde si une participation pour le produit existe, sinon on attribue la quantité de 0


                    //Si la participation est déjà bucqué alors on récupère les quantités déjà bucquées
                    already_bucqued_quantity = (participation && participation.participation_bucquee) ? participation.quantity : undefined


                }else{
                    //Si pas de bucquage on attribut la quantité de 0
                    prebucque_quantity=0
                }

            }


            return ({key:id, ...product, prebucque_quantity: prebucque_quantity, already_bucqued_quantity: already_bucqued_quantity, qts: (already_bucqued_quantity ? already_bucqued_quantity : (product.obligatoire ? 1: 0))})
        })
        form.setValues({products:data})
    },[usefinssproduct.productsList, usebucquage.bucquages, selectedPG])

    //Fonction de submit de la form
    function sendParticipation(values, _event){
        // On regarde si les valeurs de quantité ont augmenté entre le prébucquage et le bucquage
        // Si c'est le cas, on vérifie que le PG a le montant suffisant pour être débucqué
        if(values.products.some((product)=>product.qts>product.already_bucqued_quantity)){
            console.log("qts changed")
            // On calcule le montant du par le PG avec les prix min fixé pour chaques produit
            const prix_min_total = values.products.reduce((accumulator, product)=>accumulator+product.qts*product.prix_min,0)
            console.log(prix_min_total+"/"+selectedPG.solde)
            console.log(selectedPG)
            if(selectedPG.solde<prix_min_total){
                console.log("negatss")
            }

        }


        const participations = values.products.map(({key,qts})=>(
            {cible_participation:selectedPG.id, product_participation:key, quantity:qts, participation_bucquee: true}
        ))
        setSending(true)
        useParticipation.sendParticipations(participations).then((success)=>{
            if(success){
                showNotification( {
                    icon: <IconCheck size={18} />,
                    color: "green",
                    autoClose: true,
                    title: 'Inscription réussie',
                    message: 'Votre participation a bien été prise en compte.'
                })
            }
            //On force la récupération des bucquages
            //TODO : C'est pas très opti, il faudrait permettre de refresh seulement les participations de l'utilisateur concerné
            usebucquage.retrieveBucquages()
            setSending(false)
            if(_event.nativeEvent.submitter.name==="Continue"){
                clearPgSelector()
            }else{
                closeModal()
            }

        })


    }

    function closeModal(){
        clearPgSelector()
        setOpened(false);
    }

    function onPGSelect(pg) {
        setSelectedPG(pg)
        setFocusOnPGSelector(false) // on enlève le focus du SearchPg
    }

    function clearPgSelector() {
        setSelectedPG(undefined);
        setPgselectorValue("");
        setFocusOnPGSelector(true) // On remet le focus sur le SearchPg
    }




    // on extrait tous les produits existant dans la form car on a besoin de l'index de la form pour bind le
    // NumberInput de chaque produit à la form.
    // On en profite pour attribuer "index" à "id" car le champs id sert de key pour le component Datatable.
    const tableData = form.values.products.map((item,index)=>({...item, index, id:index}))


    const QtsInput = ({item})=> {

        const prebucque_qts = form.values.products[item.index].prebucque_quantity
        const qts = form.values.products[item.index].qts

        return (
                <NumberInput
                    min={item.obligatoire ? 1 : 0}
                    styles={{control:{backgroundColor: "white"},
                            input:{
                                    backgroundColor: qts>prebucque_qts ? "orange" :""
                                }
                           }}
                    {...form.getInputProps('products.' + item.index + '.qts', {type: 'numberinput'})}
                />
                );
    }


    return (
        <Modal opened={opened} onClose={closeModal}>
            <form onSubmit={form.onSubmit((values, _event)=>{sendParticipation(values,_event)})}>
               <Box sx={{height: isSmallDevice ? 300:400}}>
                   <Group  spacing="0">
                       <FocusTrap active={focusOnPGSelector}>
                       {/*On wrap le SearchPg dans une box pour pouvoir controler la width*/}
                       <Box style={{width:"90%"}}>

                                <SearchPg onSelectCallBack={onPGSelect} withBorder value={pgselectorValue} onChange={setPgselectorValue} data-autofocus/>

                       </Box>
                       </FocusTrap>

                       <ActionIcon color="red" onClick={()=>{clearPgSelector()}}>
                           <IconX/>
                       </ActionIcon>
                   </Group>


                   <Box style={{position: 'relative'}}>
                       {!selectedPG && <Overlay opacity={0.4} color="#c5c5c5" blur={2} zIndex={5} />}
                       <DataTable
                           minHeight={150} //Pour l'affichage du logo "pas de produits trouvés"
                           fetching={usefinssproduct.isLoading}
                           records={tableData}
                           columns={[
                               {accessor: "nom", title:"Nom"},
                               {accessor: "prebucque_quantity", title:"Pré-bucquage"},
                               {accessor: "actions", title:"Bucquage", textAlignment:"center", width:"20%", render: (product) => (<QtsInput item={product}/>) }
                           ]}
                           noRecordsText="Aucun produit n'existe pour ce fin'ss"




                       />
                   </Box>


               </Box>

                <Button style={{width:"48%", marginTop: 10, marginRight: "3px"}} type="submit" disabled={!selectedPG}>Valider</Button>
                <Button style={{width:"48%", marginTop: 10, marginLeft: "3px", backgroundColor: theme.colors.green[6]}} type="submit" name="Continue" disabled={!selectedPG}>Bucquage suivant</Button>
            </form>
        </Modal>
    )
}

export default FinssBucquageModal;