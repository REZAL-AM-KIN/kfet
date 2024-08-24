import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Modal,
    NumberInput,
    Center,
    Text,
    useMantineTheme,
    Overlay,
    Group,
    ActionIcon,
    FocusTrap
} from "@mantine/core";
import {useForm} from '@mantine/form';
import {DataTable} from "mantine-datatable";
import {useMediaQuery} from "@mantine/hooks";
import {showNotification} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons-react";
import SearchPg from "../SearchPg";

// Ce composant permet de faire le bucquage d'un fin'ss.
// Il s'agit d'un modal qui s'ouvre depuis FinssGeneralParameters.
// Il est composé d'un tableau de produit avec les quantités à bucqué, d'un sélecteur de PG et d'un bouton de validation.
// Il permet également de faire un bucquage partiel (sélectionner un produit et une quantité)
// Il permet également de débucquer (sélectionner un produit et une quantité)


// On le définit ici sinon on ne peut pas écrire directement dans le NumberInput (je crois qu'il recrée le composant
// plutôt que de le re-render)
const QtsInput = ({item, qts, ...othersProps})=> {
    return (
        <NumberInput
            min={item.obligatoire ? 1 : 0}
            styles={{control:{backgroundColor: "white"},
                input:{
                    backgroundColor: qts>item.prebucque_quantity ? "orange" :""
                }
            }}
            {...othersProps}
        />
    );
}


const FinssBucquageModal = ({opened, setOpened, usefinssproduct, usebucquage})=>{
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')


    const [isSending, setSending] = useState(false)
    const [selectedPG, setSelectedPG] = useState()
    const [pgselectorValue, setPgselectorValue] = useState("")
    const [focusOnPGSelector, setFocusOnPGSelector] = useState(true)
    const [error, setError] = useState("")
    const [soldeRequisTotal, SetSoldeRequisTotal] = useState(0)

// Initialisation du useForm. La liste des produits est vide.
    const form = useForm({
        initialValues:{
            products:[],
        },
        validate: validateForm,
        validateInputOnChange: true,

    })

    //on remplie la liste des produits en renommant l'attribue id en "key"
    //On rajoute les quantités pré-bucquées pour pouvoir les afficher facilement dans le tableau
    useEffect(()=>{
        const data = usefinssproduct.productsList.map(({id, ...product}) => {
            let prebucque_quantity = null
            let already_bucqued_quantity = null

            // S'il n'y a pas de PG sélectionné, alors on ne récupère les quantités prébucquées
            if(selectedPG){
                //On sélectionne l'objet bucquage (cf. useBucquage) de l'utilisateur sélectionné
                const bucquage = usebucquage.bucquages.find(bucquage => bucquage.consommateur_id === selectedPG.id)

                //Si un bucquage est trouvé, alors on récupère les participations
                if(bucquage){
                    //On sélectionne la participation du bucquage qui correspond à l'id du produit.
                    const participation = bucquage.participation_event.find(participation => participation.product_participation === id)
                    prebucque_quantity = participation ? participation.prebucque_quantity : 0 // On regarde si une participation pour le produit existe, sinon on attribue la quantité de 0.


                    //Si la participation est déjà bucqué, alors on récupère les quantités déjà bucquées
                    already_bucqued_quantity = (participation && participation.participation_bucquee) ? participation.quantity : undefined


                }else{
                    //Si pas de bucquage, on attribue la quantité de 0.
                    prebucque_quantity=0
                }

            }


            return ({key:id, ...product,
                    prebucque_quantity: prebucque_quantity,
                    already_bucqued_quantity: already_bucqued_quantity,
                    qts: (already_bucqued_quantity ? already_bucqued_quantity : (prebucque_quantity>0 ? prebucque_quantity : (product.obligatoire ? 1: 0)))})
        })
        form.setValues({products:data, selectedPG:selectedPG})
        validateForm({products:data, selectedPG:selectedPG})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[usefinssproduct.productsList, usebucquage.bucquages, selectedPG])

    function validateForm(values){
        const solde_requis_total = values.products.reduce((accumulator, product)=>accumulator+product.qts*product.solde_requis,0)
        SetSoldeRequisTotal(solde_requis_total)
        if (values.selectedPG && values.selectedPG.solde<solde_requis_total) {
            setError("Solde insuffisant")
            return {products: values.products.map(() => "solde insuffisant")}
        }
        setError("")
        return {};
    }

    //Fonction de submit de la form
    function sendParticipation(values, _event){
        const participations = values.products.map(({key,qts})=>(
            {cible_participation:selectedPG.id, product_participation:key, quantity:qts}
        ))
        setSending(true)
        usebucquage.sendBucquage(participations).then((success)=>{
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
        setError("")
        setSelectedPG(undefined);
        setPgselectorValue("");
        setFocusOnPGSelector(true) // On remet le focus sur le SearchPg
    }

    // On extrait tous les produits existants dans la form car on a besoin de l'index de la form pour bind le
    // NumberInput de chaque produit à la form.
    // On en profite pour attribuer "index" à "id" puisque le champ id sert de key pour le component Datatable.
    const tableData = form.values.products.map((item,index)=>({...item, index, id:index}))


    return (
        <Modal opened={opened} onClose={closeModal} size={isSmallDevice ? "100%":"lg"}>
            <form onSubmit={form.onSubmit((values, _event)=>{sendParticipation(values,_event)})} >
               <Box sx={{minHeight: isSmallDevice ? 300:400}}>
                   <Group  spacing="0">
                       <FocusTrap active={focusOnPGSelector}>
                       {/*On wrap le SearchPg dans une box pour pouvoir contrôler la width*/}
                       <Box style={{flex:"auto"}}>

                                <SearchPg onSubmit={onPGSelect} withBorder value={pgselectorValue} onChange={setPgselectorValue} data-autofocus/>

                       </Box>
                       </FocusTrap>

                       <ActionIcon color="red" onClick={()=>{clearPgSelector()}}>
                           <IconX/>
                       </ActionIcon>
                   </Group>


                   <Box style={{position: 'relative'}} mt={10}>
                       {!selectedPG && <Overlay opacity={0.4} color="#c5c5c5" blur={2} zIndex={5} />}
                       {selectedPG &&
                           <Box style={{color: (error !== "" ? "red":""),}} >
                               <Center><Text>Solde: {selectedPG.solde}€</Text></Center>
                               <Center><Text>Solde requis total: {soldeRequisTotal.toFixed(2)}€</Text></Center>
                           </Box>
                       }
                       {error !== "" ? <Center><Text color="red">{error}</Text></Center> : ""}
                       <DataTable
                           mt={5}
                           horizontalSpacing={2}
                           minHeight={150} //Pour l'affichage du logo "pas de produits trouvés"
                           fetching={usefinssproduct.isLoading}
                           records={tableData}
                           columns={[
                               {accessor: "nom", title:"Nom"},
                               {accessor: "prebucque_quantity", title:"Inscription"},
                               {accessor: "solde_requis", title:"Solde requis",
                                   render: (product) => (form.values.products[product.index].qts*product.solde_requis).toFixed(2)+" €"},
                               {accessor: "actions", title:"Bucquage", textAlignment:"center", width:"20%",
                                   render: (product) => (
                                       <QtsInput item={product} qts={form.values.products[product.index].qts}
                                           {...form.getInputProps(`products.${product.index}.qts`, {type: 'number'})}/>
                                   )
                               }
                           ]}
                           noRecordsText="Aucun produit n'existe pour ce fin'ss"
                       />
                   </Box>
               </Box>

                <Group spacing="0">
                    <Button style={{flex: "auto", marginTop: 10, marginLeft: "3px", order:2}}
                            type="submit" name="Continue" disabled={!selectedPG || error !== "" || isSending} color="green">Bucquage suivant</Button>
                    <Button style={{flex:"auto", marginTop: 10, marginRight: "3px", order:1}}
                            type="submit" disabled={!selectedPG || error !== "" || isSending}>Valider</Button>
                </Group>
            </form>
        </Modal>
    )
}

export default FinssBucquageModal;