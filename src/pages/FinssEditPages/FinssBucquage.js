import SearchableDataTable from "../../components/SearchableDataTable";
import {Paper, Box, ActionIcon, Center, Text, SimpleGrid, Button, Group} from "@mantine/core"
import {IconAlertTriangle, IconUserPlus} from "@tabler/icons";
import errorNotif from "../../components/ErrorNotif";
import FinssBucquageModal from "../../components/Finss/FinssBucquageModal";
import {useState} from "react";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";


//TODO : Verifier le montant avant de permettre le bucquage
//TODO : Modification des bucquages dans le tableau

const FinssBucquage = ({usebucquage, usefinssproduct, usefinssinfo}) => {

    const [bucquageModalOpened, setBucquageModalOpened] = useState(false);

    //Construction du déroulant au clique sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        //Construction des nodes contenant la quantité de chaque produit demandé par le PG
        const productQuantityNodes =
            record.participation_event.map((participation) =>
            {

                //Récupération des infos produits depuis le hook useFinssProducts
                const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
                if(!product){
                    errorNotif("Prebucquage","Correspondance produit manquante\n participation id: "+participation.id)
                    return;
                }

                //construction des nodes
                return (
                    <Center key={participation.id}>
                        <Text weight={500}> {product.nom} </Text>
                        <Text>: {participation.prebucque_quantity} | {participation.quantity}</Text>
                    </Center>
                )
            })

        //On wrap les nodes de quantités dans une SimpleGrid,
        // On régle le nombre de colone égale aux nombres de produits
        // si il y a moins de 3 produits afin d'avoir une grille centrée.
        return (

            <SimpleGrid cols={usefinssproduct.productsList.length<3 ? usefinssproduct.productsList.length: 3}>
                {productQuantityNodes}
            </SimpleGrid>
        )

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
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", flex: "1 1 auto"}}>
                  <SearchableDataTable
                      searchPlaceHolder={"Rechercher un PG"}
                      columns={[
                          {accessor: "consommateur_bucque", title:"Nom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                          {accessor: "consommateur_prenom", title:"Prénom", sortable: true},
                      ]}
                      idAccessor="consommateur_bucque"
                      data={usebucquage.bucquages}
                      isLoading = {usebucquage.isLoading}

                      elementSpacing={"xs"}

                      styles={{
                          input: {width: "60%"}
                      }}

                      searchBarPosition="apart"

                      extraButtons={
                                      <ActionIcon size={33} color="green" onClick={()=>{openBucquage()}}>
                                          <IconUserPlus size={33}/>
                                      </ActionIcon>
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