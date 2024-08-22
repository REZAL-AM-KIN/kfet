import SearchableDataTable from "../../components/SearchableDataTable";
import {Paper, Box, Center, Switch, Stack, Group, Text, Button, List, Tooltip} from "@mantine/core"
import {useEffect, useState} from "react";
import {IconAlertTriangle, IconCircleCheck, IconCircleX} from "@tabler/icons-react";
import errorNotif from "../../components/ErrorNotif";
import {useConsommateursList} from "../../hooks/useConsommateursList";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {DataTable} from "mantine-datatable";
import FinssProductRecapModal from "../../components/Finss/FinssProductRecapModal";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";
import {usePermissions} from "../../hooks/useUser";


//TODO : Permettre le débucquage en negat'ss si permission.
const FinssDebucquage = ({usebucquage, usefinssproduct, usefinssinfo}) => {
    const useconsommateurlist = useConsommateursList();
    const permissions = usePermissions();

    const [finssProductRecapModalOpened, setFinssProductRecapModalOpened] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [displayDebucque, setDisplayDebucque] = useState(false);
    const [data, setData] = useState([]);

    //On va remplir la liste data avec les bucquages issues de usebucquage.bucquages
    // mais en ajoutant le solde du pg et le montant total de ses participations
    useEffect(()=>{
        //Si la liste des conso n'est pas chargé, alors on ne va pas plus loin
        if(useconsommateurlist.isLoading){
            return
        }

        //On va ajouter le prix total (prix_total) des participations du PG et le solde du pg (solde_pg).
        const completedData = usebucquage.bucquages.map((bucquage)=>{
            let prix_total = 0

            //On récupère le consommateur
            const consommateur = useconsommateurlist.consommateurs.find((consommateur)=>consommateur.id===bucquage.consommateur_id)
            if(!consommateur){
                errorNotif("Débucquage","Correspondance consommateur manquante\n consommateur id: "+bucquage.consommateur_id)
                return;
            }


            bucquage.participation_event.forEach((participation) => {
                //Récupération des infos produits depuis le hook useFinssProducts
                const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
                if (!product) {
                    errorNotif("Débucquage", "Correspondance produit manquante\n participation id: " + participation.id)
                    return;
                }

                //Si la quantité vaut 0, que la participation n'est pas bucquée ou qu'elle est déjà débucquée, on n'affiche pas la quantité
                if (participation.quantity === 0 || !participation.participation_bucquee || participation.participation_debucquee) {
                    return
                }

                //On ajoute le prix au prix total dû par le PG
                prix_total += (parseFloat(product.prix_unitaire) * participation.quantity)
            })

            return {...bucquage, prix_total: parseFloat(prix_total.toFixed(2)), solde_pg: consommateur.solde}
        })
        setData(completedData)

    }, [usebucquage.bucquages, useconsommateurlist.isLoading, useconsommateurlist.consommateurs, usefinssproduct.productsList]);
    
    


    //Est appelé au clique sur le bouton débucquer
    function debucquage() {

        // On vérifie qu'au moins un PG est séléctionné.
        if(selectedRecords.length === 0){
            openModal({
                title: 'Aucun PG séléctionné',
                children: (
                    <>
                        <Text size="sm">
                            Vous devez sélectionner au moins un PG à débucquer.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });
            return
        }

        //On déclare la modal de confirmation qui sera appelé plus tard.
        const debucquageConfirmModal = () => openConfirmModal({
            title: <Text color="red">Confirmation de débucquage</Text>,
            children: (

                <Text size="sm">
                    Vous êtes sur le point de débucquer {selectedRecords.length} PG dont <span color="red">{negatssList.length}</span> en négat'ss.<br/>
                    Le débucquage sera <u><i><b>définitif</b></i></u>. Vous ne pourrez plus enregistrer de nouveau bucquages.<br/>
                    Etes vous certains de vouloir continuer ?
                </Text>

            ),
            labels: { confirm: 'Débucquer', cancel: 'Annuler' },
            confirmProps:{color:"red"},
            onConfirm: () => debucquer(),
        });


        let debucquageList = []
        let negatssList = []

        //On extrait les id des participations et les negatss pour constituer la liste des débucquages.
        selectedRecords.forEach((bucquage) => {
            //On regarde si le pg va être débucquée en négatss
            // Si oui on l'ajoute à une liste qui permettra de faire un recap des PG débucquée en negatss
            const negatss = bucquage.solde_pg<bucquage.prix_total
            if(negatss){
                negatssList.push({...bucquage, id:bucquage.consommateur_id})
            }

            //On récupère la liste des participations qui sont bucquée mais pas débucquée et dont la quantité est non nulle.
            const bucquedParticipation = bucquage.participation_event.filter((participation)=>
                                                                    participation.participation_bucquee &&
                                                                    !participation.participation_debucquee &&
                                                                    participation.quantity !== 0)
            bucquedParticipation.forEach((participation)=>{
                debucquageList.push({id: participation.id, negatss: negatss})
            })


        });

        //Si des produits ont un prix nul, on prévient l'utilisateur
        if(usefinssproduct.productsList.some((product)=>parseFloat(product.prix_min)===0 || parseFloat(product.prix_total)===0)){
            openConfirmModal({
                title: <Group spacing="0"><IconAlertTriangle color="red"/><Text color="red"> Produit gratuit !</Text></Group>,
                closeOnConfirm: false,
                children: (
                    <Text size="sm">
                        Certains produits ont un prix nul. <br/>
                        Il seront donc gratuit.<br/>
                        Etes vous certain de vouloir continuer ?
                    </Text>
                ),
                labels: { confirm: 'Continuer', cancel: 'Annuler' },
                confirmProps:{color:"red"},
                onConfirm: () => checkNegatss(),
            })
        }else{
            checkNegatss()
        }

        function checkNegatss() {
            // S'il y a des pg à débucquer en négatss, on affiche une modale de confirmation avec la list des pg concernés
            if(negatssList.length !==0){
                openConfirmModal({
                    title: <Text color="red">Débucquage en négatss !</Text>,
                    closeOnConfirm: false,
                    children: (
                        <Stack>
                            <Text size="sm">
                                Vous êtes sur le point de débucquer {negatssList.length} PG en négat'ss.<br/>
                                Liste des PG qui seront débucqués en négat'ss :
                            </Text>
                            <Box style={{maxHeight:"300px"}}>
                                <DataTable
                                    columns={[
                                        {accessor: "consommateur_bucque_famss", title:"Bucque", visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                                        {accessor: "consommateur_nom", title:"Nom"},
                                        {accessor: "solde_pg", title:"Solde (€)"},
                                        {accessor: "prix_total", title:"Prix à payer (€)"}
                                    ]}

                                    records={negatssList}
                                />
                            </Box>
                        </Stack>
                    ),
                    labels: { confirm: 'Continuer', cancel: 'Annuler' },
                    confirmProps:{color:"red"},
                    onConfirm: () => debucquageConfirmModal(),
                })
            }else{
                debucquageConfirmModal()
            }
        }

        function debucquer() {
            usebucquage.sendDebucquage(debucquageList).then((success)=> {
                    if (success) {
                        useconsommateurlist.retrieveConsommateurs();
                        usebucquage.retrieveBucquages();
                    }
                }
            )
            closeAllModals()
            setSelectedRecords([])
        }
    }


    //Construction du déroulant au clique sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        const productQuantityNodes = record.participation_event.map((participation) => {
            //Récupération des infos produits depuis le hook useFinssProducts
            const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
            if(!product){
                errorNotif("Débucquage","Correspondance produit manquante\n participation id: "+participation.id)
                return;
            }

            //Si la quantité vaut 0 ou que la participation n'est pas bucquée, on affiche pas la quantité
            if(participation.quantity ===0 || !participation.participation_bucquee ){
                return;
            }

            // On ajoute la note qui correspond aux quantités produits
            return ( <List.Item key={participation.id}>
                        <Tooltip label={participation.participation_debucquee ? "Participation déjà débucquée" :""} disabled={!participation.participation_debucquee}>
                                <Text strikethrough = {participation.participation_debucquee}>
                                    {participation.quantity}x {product.nom}
                                </Text>
                        </Tooltip>
                    </List.Item>)
        })


        return (
            <Box style={{display:"flex"}}>
                <Stack spacing="0" style = {{flexBasis: "fit-content", marginLeft: "auto", marginRight:"auto"}}>
                    <Group style={{marginBottom: 8}}>
                        <Text>Récapitulatif : </Text>
                        <List size="sm">
                            {productQuantityNodes}
                        </List>
                    </Group>
                    <Group>
                        <Text>Prix total: </Text>
                        <Text>{record.prix_total}€</Text>
                    </Group>

                    <Center>
                        {record.solde_pg>=record.prix_total ?
                            <Text color="green"> Consommateur débucquable</Text> :
                            <Text color="red"> Solde insuffisant (Solde : {record.solde_pg}€)</Text>
                        }
                    </Center>
                </Stack>
            </Box>
        )
    }

    //Fonction qui permet d'ajouter la colonne débucquée ? si l'affichage de tous les bucquages (y compris ceux déjà débucqué) est activé
    const columnsList = () => {
        const baseColumns =[
            {accessor: "consommateur_bucque_famss", title:"Bucque", searchable: true, sortable: true},
            {accessor: "consommateur_nom", title:"Nom", searchable: true, sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
        ]
        if(displayDebucque){
            baseColumns.push({accessor: "status", title:"Débucquée ?", width: 110,render:statusColum})
        }
        return baseColumns
    }

    // Déclaration de la render node pour la colonne "débucquée ?"
    const statusColum = (record) =>{
        // Si dans le bucquage courant il y a des participations non débucquées dont la quantité est non nulle alors on affiche une croix
        if(record.participation_event.some((participation)=>(!participation.participation_debucquee && participation.quantity !==0))){
            return (<Center><IconCircleX color={"red"}/></Center>)
        }

        return (<Center><IconCircleCheck color="green"/></Center>)
    }


    const CategorieFilter = (
            <Switch
                style={{flex:"1"}}
                styles={{body:{alignItems:"center"}}}
                labelPosition="left"
                label="Afficher les participations déjà débucquée ?"
                checked={displayDebucque}
                onChange={(event)=>setDisplayDebucque(event.currentTarget.checked)}
            />
        )

    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "20px 10px 0px 10px", flex: "1 1 auto"}}>
                <SearchableDataTable
                    searchPlaceHolder={"Rechercher un PG"}
                    columns={columnsList()}
                    idAccessor="consommateur_bucque_famss"


                    //On récupère les bucquages dont au moins une participation est bucquee
                    // et si on n'affiche pas les débucquée on sélectionne seulement les bucquages
                    // qui ont au moins une participation non débucquee dont la quantité n'est pas nulle.
                    //On ajoute aussi la bucque et la famss du consommateur dans une colonne pour faciliter la recherche
                    data={data.filter((bucquage)=>bucquage.participation_event.some(
                        (participation)=>
                            participation.participation_bucquee &&
                            (displayDebucque || (!participation.participation_debucquee && participation.quantity!==0)))
                    ).map((bucquage)=> ({...bucquage, consommateur_bucque_famss: bucquage.consommateur_bucque+" "+bucquage.consommateur_fams}))}


                    isLoading = {usebucquage.isLoading ||useconsommateurlist.isLoading}

                    elementSpacing={"xs"}

                    styles={{
                        input: {flex: "auto"}
                    }}

                    searchBarPosition="apart"

                    rowExpansion={{
                        content: ({record})=>(rowExpansionContent(record))
                    }}

                    selectedRecords = {selectedRecords}
                    onSelectedRecordsChange = {setSelectedRecords}

                    //On regarde si le pg est débucquable et pas débucqué sur tous ses produits
                    isRecordSelectable = {(record)=> {
                        return(
                            (record.solde_pg >= record.prix_total || permissions.event_debucquage_negats) &&
                            record.participation_event.some((participation)=>!participation.participation_debucquee
                                && participation.quantity > 0)
                        )
                    }}
                    
                    categoriesSelector={CategorieFilter}

                    secondBarNodes={
                        <Group spacing="0" position = "apart">
                            <Tooltip label={"Débucquer les PG sélectionnés"} position={"bottom-start"} withArrow>
                                <Button disabled={usefinssinfo.finssInfo.etat_event !== etatEventValues.DEBUCQUAGE}
                                        color="red"
                                        style={{flex:"1 1 auto", maxWidth: "130px", marginRight:3}}
                                        onClick={debucquage}>
                                    Débucquer
                                </Button>
                            </Tooltip>

                            <Tooltip label={"Recap des produits et des bucquages"} position={"bottom-end"} withArrow>
                                <Button style={{flex:"1 1 auto", maxWidth: "170px", marginLeft:3}}
                                        onClick={()=>setFinssProductRecapModalOpened(true)}>
                                    Recap prix
                                </Button>
                            </Tooltip>
                        </Group>
                    }

                    withReloadIcon
                    reloadCallback={()=> {
                        useconsommateurlist.retrieveConsommateurs();
                        usebucquage.retrieveBucquages();
                    }}

                />
            </Paper>
            <FinssProductRecapModal opened={finssProductRecapModalOpened}
                                    setOpened={setFinssProductRecapModalOpened}
                                    usefinssproduct={usefinssproduct}/>
        </Box>
    )
}

export default FinssDebucquage;