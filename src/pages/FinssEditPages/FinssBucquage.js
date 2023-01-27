import SearchableDataTable from "../../components/SearchableDataTable";
import {
    Paper,
    Box,
    ActionIcon,
    Text,
    Button,
    Group,
    Progress,
    Table,
    useMantineTheme
} from "@mantine/core"
import {IconAlertTriangle, IconNotes, IconUserPlus} from "@tabler/icons";
import errorNotif from "../../components/ErrorNotif";
import FinssBucquageModal from "../../components/Finss/FinssBucquageModal";
import {useState} from "react";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import openFinssProductRecapModal from "../../components/Finss/FinssProductRecapModal";
import {useMediaQuery} from "@mantine/hooks";



//TODO : Modification des bucquages dans le tableau
//TODO : Blocquer la diminution des quantités si pas la permission
const FinssBucquage = ({usebucquage, usefinssproduct, usefinssinfo}) => {

    const [bucquageModalOpened, setBucquageModalOpened] = useState(false);
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')

    //Construction du déroulant au clique sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        //Construction des nodes contenant la quantité de chaque produit demandé par le PG
        const productQuantity =
            record.participation_event.map((participation) =>
            {

                //Récupération des infos produits depuis le hook useFinssProducts
                const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
                if(!product){
                    errorNotif("Prebucquage","Correspondance produit manquante\n participation id: "+participation.id)
                    return;
                }

                //construction des nodes
                return {nom:product.nom, preQts: participation.prebucque_quantity, qts: participation.quantity}

            })


       let tabs_content = [[],[],[]]

        //Si on est sur téléphone on affiche tous les bucquages dans un seul tableau
        if (isSmallDevice){
            tabs_content[0]=productQuantity

        }else{ //Sinon on les répartis dans 3 tableau
            productQuantity.forEach((quantity, index)=>{
                tabs_content[index%3].push(quantity)
            })
        }


        const nodes = tabs_content.map((tab)=>{
            if(tab.length===0){
                return ""
            }

            const content = tab.map((quantity, index)=>(
                <tr key={index}>
                    <td>{quantity.nom}</td>
                    <td>{quantity.preQts}</td>
                    <td>{quantity.qts}</td>
                </tr>
            ))

            return (
                <Box style={{flex:"1"}}>
                    <Table withBorder withColumnBorders style={{tableLayout:"fixed", wordBreak:"break-word"}}>
                        <thead >
                            <tr>
                                <th>Nom</th>
                                <th>Pré Qts</th>
                                <th>Qts</th>
                            </tr>
                        </thead>
                        <tbody>{content}</tbody>
                    </Table>
                </Box>
            )
        })

        return (

            <Group style={{alignItems: "flex-start", margin:"10px 0"}}>
                {nodes}
            </Group>
        )

    }

    //Construction de l'élément de progession des bucquages
    const BucquageProgress = () =>{

        //on sélectionne tous les prébucquages
        const prebucqueBucquage = usebucquage.bucquages.filter((bucquage) =>
                                                            bucquage.participation_event.some((participation)=>
                                                                participation.prebucque_quantity!==0
                                                            ))
        //On sélectionne tous les bucquages qui ont été d'abord prébucqué puis bucqué
        const bucquedBucquage = prebucqueBucquage.filter((bucquage) =>
                                                            bucquage.participation_event.some((participation)=>
                                                                participation.prebucque_quantity!==0 &&
                                                                participation.participation_bucquee &&
                                                                participation.quantity !==0
                                                            ))

        const value = prebucqueBucquage.length === 0 ? 100 : (bucquedBucquage.length/prebucqueBucquage.length)*100
        const label = prebucqueBucquage.length === 0 ? "Aucune inscription" : bucquedBucquage.length+"/"+prebucqueBucquage.length

        return (<Progress value={value} label={label} size="lg" style={{marginBottom:10}}/>)
    }

    //On souhaite vérifier que les inscriptions sont fermé avant de permettre le bucquage des gens.
    function openBucquage() {


        if(usefinssinfo.finssInfo.can_subscribe){
            openModal({
                title: 'Bucquage impossible',
                centered: true,
                children: (
                    <>
                        <Text size="sm">
                            Le bucquage n'est pas disponible car les inscriptions sont toujours ouvertes. <br/>
                            Rendez-vous dans les paramètres pour cloturer les inscriptions.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });
            return
        }

        //On vérifie si certaines participation on déjà été débucqué, si c'est le cas, alors on interdit les bucquages.
        if(usebucquage.bucquages.some((bucquage)=>bucquage.participation_event.some((participation)=>participation.participation_debucquee))){
            openModal({
                title: 'Bucquage impossible',
                centered: true,
                children: (
                    <>
                        <Text size="sm">
                            Le bucquage n'est plus disponible car certaine participation ont déjà été débucquées.
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
                centered: true,
                children: (
                    <Text size="sm">
                        Certains produits ont un prix nul. <br/>
                        Il seront donc gratuit.<br/>
                        Etes vous certain de vouloir continuer ?
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

    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>
                <BucquageProgress/>

                  <SearchableDataTable
                      searchPlaceHolder={"Rechercher un PG"}
                      columns={[
                          {accessor: "consommateur_bucque", title:"Nom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                          {accessor: "consommateur_prenom", title:"Prénom", sortable: true},
                      ]}
                      idAccessor="consommateur_bucque"
                      data={usebucquage.bucquages.filter((bucquage)=>bucquage.participation_event.some((participation)=>participation.participation_bucquee))}
                      isLoading = {usebucquage.isLoading}

                      elementSpacing={"xs"}

                      styles={{
                          input: {flex: "auto"}
                      }}

                      searchBarPosition="apart"

                      extraButtons={
                                    <>
                                        <ActionIcon disabled={usefinssinfo.finssInfo.ended} size={33} color="green" onClick={()=>{openBucquage()}}>
                                          <IconUserPlus size={33}/>
                                        </ActionIcon>
                                        <ActionIcon size={33} color="blue" onClick={()=>openFinssProductRecapModal(usefinssproduct)}>
                                            <IconNotes size={33}/>
                                        </ActionIcon>
                                    </>
                                    }

                      withReloadIcon

                      reloadCallback={()=>usebucquage.retrieveBucquages()}

                      rowExpansion={{
                          content: ({record})=>(rowExpansionContent(record))
                      }}


                  />
            </Paper>

            <FinssBucquageModal opened={bucquageModalOpened} setOpened={setBucquageModalOpened} usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
        </Box>

    );
}

export default FinssBucquage;