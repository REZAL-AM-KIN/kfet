import {Paper, SimpleGrid, Text, Center, Title, Stack, LoadingOverlay, Space, Box} from "@mantine/core";
import SearchableDataTable from "../../components/SearchableDataTable";
import errorNotif from "../../components/ErrorNotif";



const FinssPrebucquage = ({usebucquage, usefinssproduct}) =>{

    //Construction des informations des quantités de bucquages pour chaque produit
    const quantite_prebucque_info = usefinssproduct.productsList.map((product)=> (

        <Stack spacing="0" key={product.id}>
            <Center>
                <Text weight={500}> {product.nom} :</Text>
            </Center>
            <Center>
                <Text>{product.quantite_prebucque}</Text>
            </Center>
        </Stack>
        ));

    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{

        //Construction des nodes contenant la quantité de chaque produit demandé par le PG
        const productQuantityNodes =
            record.participation_event.map((participation) =>
                {

                    //Récupération des infos des produits depuis le hook useFinssProducts
                    const product = usefinssproduct.productsList.find((product) => (product.id === participation.product_participation))
                    if(!product){
                        errorNotif("Prebucquage","Correspondance produit manquante\n participation id: "+participation.id)
                        return null;
                    }

                    //construction des nodes
                    return (
                        <Center key={participation.id}>
                            <Text weight={500}> {product.nom} </Text>
                            <Text>: {participation.prebucque_quantity}</Text>
                        </Center>
                    )
                })

        // On englobe les nodes de quantités dans une SimpleGrid,
        // S'il y a moins de 3 produits, on règle le nombre de colonnes
        // égales aux nombres de produits afin d'avoir une grille centrée.
        return (

            <SimpleGrid cols={usefinssproduct.productsList.length<3 ? usefinssproduct.productsList.length: 3}>
                {productQuantityNodes}
            </SimpleGrid>
        )

    }

    return (
        <Stack style={{height: "100%" }}>

            {/*Header avec les quantités demandées pour chaque produit*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "20px 10px 0px 10px", position: 'relative'}}>

                <Center><Title order={4}>Quantités pré-bucquées</Title></Center>
                <Space h="sm" />

                {/* S'il y a moins de 3 produits, on règle le nombre de colonnes égales
                    aux nombres de produits afin d'avoir une grille centrée.*/}
                <Box pos="relative" mih="3rem">
                    <LoadingOverlay visible={usefinssproduct.isLoading} overlayBlur={2} />
                    <SimpleGrid cols={usefinssproduct.productsList.length<3 ? usefinssproduct.productsList.length: 3}>
                        {quantite_prebucque_info}
                    </SimpleGrid>
                </Box>
            </Paper>

            {/*Tableau*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", flex:"1 1 auto"}}>

                <Center><Title order={4}>Liste des prébucqués</Title></Center>
                <Space h="sm" />

                <SearchableDataTable
                    searchPlaceHolder={"Rechercher un PG"}
                    columns={[
                                {accessor: "consommateur_bucque_famss", title:"Bucque", searchable: true, sortable: true},
                                {accessor: "consommateur_nom", title:"Nom", searchable: true, sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},

                            ]}
                    idAccessor="consommateur_bucque"

                    // On récupère les bucquages dont les participations ne sont pas vide et dont au moins une participation
                    // a une quantité non nulle. Ainsi, on n'affiche pas les participations qui ont été bucqué mais pas prébucqué.
                    // On ajoute aussi la bucque et la famss du consommateur dans une colonne pour faciliter la recherche
                    data={usebucquage.bucquages.filter((bucquage)=>(
                        (bucquage.participation_event.length!==0)
                        && (bucquage.participation_event.some((participation)=>participation.prebucque_quantity!==0)))
                                                        )
                        .map((bucquage)=> ({...bucquage, consommateur_bucque_famss: bucquage.consommateur_bucque+" "+bucquage.consommateur_fams}))
                        }

                    isLoading = {usebucquage.isLoading}

                    elementSpacing={"xs"}

                    styles={{
                        input: {flex: "auto"}
                    }}

                    rowExpansion={{
                        content: ({record})=>(rowExpansionContent(record))
                    }}

                    withReloadIcon
                    reloadCallback={()=>{
                                        usebucquage.retrieveBucquages();
                                        usefinssproduct.retrieveProducts();
                                    }}
                />

            </Paper>

        </Stack>
    )
}

export default FinssPrebucquage