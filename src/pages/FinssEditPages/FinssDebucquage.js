import BackendSearchableDataTable from "../../components/BackendSearchableDataTable";
import {Paper, Box, Center, Switch, Stack, Group, Text, Button, List, Tooltip} from "@mantine/core"
import {useState} from "react";
import {IconAlertTriangle, IconCircleCheck, IconCircleX} from "@tabler/icons-react";
import errorNotif from "../../components/ErrorNotif";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {DataTable} from "mantine-datatable";
import FinssProductRecapModal from "../../components/Finss/FinssProductRecapModal";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";
import {usePermissions} from "../../hooks/useUser";
import {useDebucquageList} from "../../hooks/finssHooks/useDebucquageList";


const FinssDebucquage = ({usebucquage, usefinssproduct, usefinssinfo, finssId}) => {
    const permissions = usePermissions();

    const [finssProductRecapModalOpened, setFinssProductRecapModalOpened] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);

    const usebucquagelist = useDebucquageList(finssId)


    //Est appelé au clic sur le bouton débucquer
    function debucquage() {

        // On vérifie qu'au moins un PG est sélectionné.
        if(selectedRecords.length === 0){
            openModal({
                title: 'Aucun PG sélectionné',
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
                    Êtes vous certains de vouloir continuer ?
                </Text>

            ),
            labels: { confirm: 'Débucquer', cancel: 'Annuler' },
            confirmProps:{color:"red"},
            onConfirm: () => debucquer(),
        });


        let debucquageList = []
        let negatssList = []

        //On extrait les id des participations et les négat'ss pour constituer la liste des débucquages.
        selectedRecords.forEach((bucquage) => {
            //On regarde si le pg va être débucquée en négat'ss
            // Si oui, on l'ajoute à une liste qui permettra de faire un recap des PG débucquée en négat'ss
            const negatss = parseFloat(bucquage.solde)<parseFloat(bucquage.prix_total)
            if(negatss){
                negatssList.push({...bucquage, id:bucquage.consommateur_id})
            }

            //On récupère la liste des participations qui sont bucquée mais pas débucquée et dont la quantité est non nulle.
            const bucquedParticipation = bucquage.participation_event.filter((participation)=>
                                                                    participation.is_bucquee &&
                                                                    !participation.is_debucquee &&
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
                        Êtes vous certain de vouloir continuer ?
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
            // S'il y a des pg à débucquer en négat'ss, on affiche une modale de confirmation avec la list des pg concernés
            if(negatssList.length !==0){
                openConfirmModal({
                    title: <Text color="red">Débucquage en négat'ss !</Text>,
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
                                        {accessor: "bucque", title:"Bucque", visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                                        {accessor: "nom", title:"Nom"},
                                        {accessor: "solde", title:"Solde (€)"},
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
                        usebucquagelist.retrieve();
                    }
                }
            )
            closeAllModals()
            setSelectedRecords([])
        }
    }


    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        const productQuantityNodes = record.participation_event.map((participation) => {
            //Récupération des infos des produits depuis le hook useFinssProducts
            const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
            if(!product){
                errorNotif("Débucquage","Correspondance produit manquante\n participation id: "+participation.id)
                return;
            }

            //Si la quantité vaut 0 ou que la participation n'est pas bucquée, on n'affiche pas la quantité
            if(participation.quantity ===0 || !participation.is_bucquee ){
                return;
            }

            // On ajoute la note qui correspond aux quantités des produits
            return ( <List.Item key={participation.id}>
                        <Tooltip label={participation.is_debucquee ? "Participation déjà débucquée" :""} disabled={!participation.is_debucquee}>
                                <Text strikethrough = {participation.is_debucquee}>
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
                        {parseFloat(record.solde)>=parseFloat(record.prix_total) ?
                            <Text color="green"> Consommateur débucquable</Text> :
                            <Text color="red"> Solde insuffisant (Solde : {record.solde}€)</Text>
                        }
                    </Center>
                </Stack>
            </Box>
        )
    }

    //Fonction qui permet d'ajouter la colonne débucquée ? si l'affichage de tous les bucquages (y compris ceux déjà débucqué) est activé
    const columnsList = () => {
        const baseColumns =[
            {accessor: "bucque", title:"Bucque", sortable: true},
            {accessor: "fams", title:"Fam'ss", sortable: true},
            {accessor: "proms", title:"Prom'ss", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
            {accessor: "nom", title:"Nom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
            {accessor: "prenom", title:"Prénom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
        ]
        if(usebucquagelist.displayDebucque){
            baseColumns.push({accessor: "status", title:"Débucquée ?", sortable: false, width: 110, render:statusColumn})
        }
        return baseColumns
    }

    // Déclaration de la render node pour la colonne "débucquée ?"
    const statusColumn = (record) =>{
        // Si dans le bucquage courant il y a des participations non débucquées dont la quantité est non nulle, alors on affiche une croix
        // TODO calculer ça dans le backend, au moins on pourra aussi trier sur cette colonne
        if(record.participation_event.some((participation)=>(!participation.is_debucquee && participation.quantity !==0))){
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
                checked={usebucquagelist.displayDebucque}
                onChange={(event)=>usebucquagelist.setDisplayDebucque(event.currentTarget.checked)}
            />
        )

    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "16px 8px 0px 8px", flex: "1 1 auto"}}>
                <BackendSearchableDataTable
                    searchPlaceHolder={"Rechercher un PG"}
                    columns={columnsList()}
                    idAccessor="consommateur_id"

                    data={usebucquagelist.bucquages}
                    isLoading = {usebucquagelist.isLoading}
                    defaultSortedColumn="bucque"
                    setSearch={usebucquagelist.setSearch}
                    setSort={usebucquagelist.setOrdering}
                    page={usebucquagelist.page}
                    onPageChange={usebucquagelist.setPage}
                    totalRecords={usebucquagelist.numberRecords}
                    recordsPerPage={usebucquagelist.limit}
                    setPageSize={usebucquagelist.setLimit}
                    recordsPerPageOptions={[10, 25, 50]}
                    recordsPerPageLabel={"PG par page"}


                    elementSpacing={"xs"}
                    styles={{
                        input: {flex: "auto"}
                    }}
                    searchBarPosition="apart"

                    rowExpansion={{
                        content: ({record})=>(rowExpansionContent(record))
                    }}

                    withReloadIcon
                    reloadCallback={()=> {
                        usebucquagelist.retrieve();
                    }}

                    extraButtons={CategorieFilter}

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

                    selectedRecords = {selectedRecords}
                    onSelectedRecordsChange = {setSelectedRecords}
                    //On regarde si le pg est débucquable et pas débucqué sur tous ses produits
                    isRecordSelectable = {(record)=> {
                        return(
                            (record.solde_pg >= record.prix_total || permissions.event_debucquage_negats) &&
                            record.participation_event.some((participation)=>!participation.is_debucquee
                                && participation.quantity > 0)
                        )
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