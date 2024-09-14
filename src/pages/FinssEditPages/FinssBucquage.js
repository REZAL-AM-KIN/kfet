import BackendSearchableDataTable from "../../components/BackendSearchableDataTable";
import {
    Paper,
    Box,
    ActionIcon,
    Text,
    Button,
    Group,
    Progress,
    Table,
    useMantineTheme, Tooltip
} from "@mantine/core"
import {IconAlertTriangle, IconNotes, IconUserPlus} from "@tabler/icons-react";
import errorNotif from "../../components/ErrorNotif";
import FinssBucquageModal from "../../components/Finss/FinssBucquageModal";
import {useEffect, useState} from "react";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {useMediaQuery} from "@mantine/hooks";
import FinssProductRecapModal from "../../components/Finss/FinssProductRecapModal";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";
import {useBucquageList} from "../../hooks/finssHooks/useBucquageList";



//TODO : Modification des bucquages dans le tableau
//TODO : Bloquer la diminution des quantités si pas la permission
const FinssBucquage = ({usebucquage, usefinssproduct, usefinssinfo, finssId}) => {

    const [bucquageModalOpened, setBucquageModalOpened] = useState(false);
    const [finssProductRecapModalOpened, setFinssProductRecapModalOpened] = useState(false);
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')
    const usebucquagelist = useBucquageList(finssId)

    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        //Construction des nodes contenant la quantité de chaque produit demandé par le PG
        const productQuantity =
            record.participation_event.map((participation) =>
            {

                //Récupération des infos des produits depuis le hook useFinssProducts
                const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
                if(!product){
                    errorNotif("Prebucquage","Correspondance produit manquante\n participation id: "+participation.id)
                    return;
                }

                //construction des nodes
                return {nom:product.nom, preQts: participation.prebucque_quantity, qts: participation.quantity}

            })


       let tabs_content = [[],[],[]]

        //Si on est sur téléphone, on affiche tous les bucquages dans un seul tableau
        if (isSmallDevice){
            tabs_content[0]=productQuantity

        }else{ //Sinon, on les répartit dans 3 tableaux
            productQuantity.forEach((quantity, index)=>{
                tabs_content[index%3].push(quantity)
            })
        }


        const nodes = tabs_content.map((tab,index)=>{
            if(tab.length===0){
                return ""
            }

            const content = tab.map((quantity, index)=>(
                <tr key={index}>
                    <td>{quantity.nom}</td>
                    <td>{quantity.qts}</td>
                    <td>{quantity.preQts}</td>
                </tr>
            ))

            return (
                <Box style={{flex:"1"}} key={index}>
                    <Table withBorder withColumnBorders style={{tableLayout:"fixed", wordBreak:"break-word"}}>
                        <thead >
                        <tr>
                            <th>Nom</th>
                            <th style={{width:"28%"}}>Bucqués</th>
                            <th style={{width:"35%"}}>Commandés</th>
                        </tr>
                        </thead>
                        <tbody>{content}</tbody>
                    </Table>
                </Box>
            )
        })

        return (

            <Group style={{alignItems: "flex-start", margin:"10px 0"}} key={record.id}>
                {nodes}
            </Group>
        )

    }

    //Construction de l'élément de progression des bucquages
    const BucquageProgress = () =>{
        const prebucqueBucquage = usefinssinfo.finssNbPrebucque
        const bucquedBucquage = usefinssinfo.finssNbBucque
        const value = prebucqueBucquage === 0 ? 100 : (bucquedBucquage/prebucqueBucquage)*100
        const label = prebucqueBucquage === 0 ? "Aucune inscription" : bucquedBucquage+"/"+prebucqueBucquage

        return (
            <Tooltip label={"Indique le nombre de personne qui se sont inscrites et qui ont été bucquées"} position={"bottom"} withArrow>
                <Progress value={value} label={label} size={theme.fontSizes.xl} radius="md" style={{marginBottom:"1rem"}}/>
            </Tooltip>
        )
    }

    //On souhaite vérifier que les inscriptions sont fermé avant de permettre le bucquage des gens.
    function openBucquage() {
        if(usefinssinfo.finssInfo.etat_event === etatEventValues.PREBUCQUAGE){
            openModal({
                title: 'Bucquage impossible',
                children: (
                    <>
                        <Text size="sm">
                            Le bucquage n'est pas disponible car les inscriptions sont toujours ouvertes. <br/>
                            Rendez-vous dans les paramètres pour clôturer les inscriptions.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });
            return
        }else if(usefinssinfo.finssInfo.etat_event > etatEventValues.BUCQUAGE){
            openModal({
                title: 'Bucquage impossible',
                children: (
                    <>
                        <Text size="sm">
                            Le bucquage pour ce fin'ss est terminé!
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });
            return
        }

        //Si des produits ont un prix nul, on prévient l'utilisateur
        if(usefinssproduct.productsList.some((product)=>parseFloat(product.prix_min)===0 || parseFloat(product.prix_total)===0)){
            openConfirmModal({
                title: <Group spacing="0"><IconAlertTriangle color="red"/><Text color="red"> Produit gratuit !</Text></Group>,
                children: (
                    <Text size="sm">
                        Certains produits ont un prix nul. <br/>
                        Ils seront donc gratuits.<br/>
                        Êtes vous certain de vouloir continuer ?
                    </Text>
                ),
                labels: { confirm: 'Continuer', cancel: 'Annuler' },
                confirmProps:{color:"red"},
                onConfirm: () => setBucquageModalOpened(true),
            })
        }else{
            // Tout est ok, on ouvre la modal de débucquage
            setBucquageModalOpened(true)
        }



    }

    useEffect(()=>{
        if (!bucquageModalOpened){
            usefinssinfo.retrieveFinssProgression();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bucquageModalOpened])

    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "16px 8px 0px 8px", flex: "1 1 auto"}}>
                <BucquageProgress/>

                <BackendSearchableDataTable
                    searchPlaceHolder={"Rechercher un PG"}
                    columns={[
                        {accessor: "bucque", title:"Bucque", sortable: true},
                        {accessor: "fams", title:"Fam'ss", sortable: true},
                        {accessor: "proms", title:"Prom'ss", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                        {accessor: "nom", title:"Nom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                        {accessor: "prenom", title:"Prénom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                    ]}
                    idAccessor="bucque"
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

                    extraButtons={
                        <>
                            <Tooltip label={"Ajouter un bucquage"} position={"bottom"} withArrow>
                                <ActionIcon disabled={usefinssinfo.finssInfo.etat_event !== etatEventValues.BUCQUAGE}
                                            size={33} color="green" onClick={()=>{openBucquage()}}>
                                  <IconUserPlus size={33}/>
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label={"Recap des produits et des bucquages"} position={"bottom"} withArrow>
                                <ActionIcon size={33} color="blue" onClick={()=>setFinssProductRecapModalOpened(true)}>
                                    <IconNotes size={33}/>
                                </ActionIcon>
                            </Tooltip>
                        </>
                    }

                    withReloadIcon

                    reloadCallback={()=> {
                        usebucquagelist.retrieve();
                        usefinssinfo.retrieveFinssProgression();
                    }}

                    rowExpansion={{
                          content: ({record})=>(rowExpansionContent(record))
}}
                />
            </Paper>

            <FinssBucquageModal opened={bucquageModalOpened} setOpened={setBucquageModalOpened} usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
            <FinssProductRecapModal opened={finssProductRecapModalOpened} setOpened={setFinssProductRecapModalOpened} usefinssproduct={usefinssproduct}/>
        </Box>

    );
}

export default FinssBucquage;