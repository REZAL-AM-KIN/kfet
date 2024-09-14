import {Paper, SimpleGrid, Text, Center, Title, Stack, LoadingOverlay, Space, Box, useMantineTheme} from "@mantine/core";
import BackendSearchableDataTable from "../../components/BackendSearchableDataTable";
import errorNotif from "../../components/ErrorNotif";
import {useMediaQuery} from "@mantine/hooks";
import {usePrebucquageList} from "../../hooks/finssHooks/usePrebucquageList";



const FinssPrebucquage = ({usefinssproduct, finssId}) =>{

    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')')
    const useprebucquagelist = usePrebucquageList(finssId)
    //Construction des informations des quantités de bucquages pour chaque produit
    const quantite_prebucque_info = usefinssproduct.productsList.map((product)=> (

        <Stack spacing="0" key={product.id}>
            <Center>
                <Text weight={500}> {product.nom} : {product.quantite_prebucque}</Text>
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
                            <Text weight={500}> {product.nom} : {participation.prebucque_quantity}</Text>
                        </Center>
                    )
                })

        // On englobe les nodes de quantités dans une SimpleGrid,
        // S'il y a moins de 3 produits, on règle le nombre de colonnes
        // égales aux nombres de produits afin d'avoir une grille centrée.
        return (

            <SimpleGrid cols={record.participation_event.length<(isSmallDevice ? 2:4) ? record.participation_event.length: (isSmallDevice ? 2:4)}>
                {productQuantityNodes}
            </SimpleGrid>
        )

    }

    return (
        <Stack style={{height: "100%" }}>

            {/*Header avec les quantités demandées pour chaque produit*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "16px 8px 0px 8px", position: 'relative'}}>

                <Center><Title order={4}>Quantités pré-bucquées</Title></Center>
                <Space h="sm" />

                {/* S'il y a moins de 3 produits, on règle le nombre de colonnes égales
                    aux nombres de produits afin d'avoir une grille centrée.*/}
                <Box pos="relative" mih="3rem">
                    <LoadingOverlay visible={usefinssproduct.isLoading} overlayBlur={2} />
                    <SimpleGrid cols={usefinssproduct.productsList.length<(isSmallDevice ? 2:4) ? usefinssproduct.productsList.length: (isSmallDevice ? 2:4)}>
                        {quantite_prebucque_info}
                    </SimpleGrid>
                </Box>
            </Paper>

            {/*Tableau*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "8px 8px 0px 8px", flex:"1 1 auto"}}>

                <Center><Title order={4}>Liste des prébucqués</Title></Center>
                <Space h="sm" />

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

                    // On récupère les bucquages dont les participations ne sont pas vide et dont au moins une participation
                    // a une quantité non nulle. Ainsi, on n'affiche pas les participations qui ont été bucqué mais pas prébucqué.
                    // On ajoute aussi la bucque et la famss du consommateur dans une colonne pour faciliter la recherche
                    data={useprebucquagelist.prebucquages}
                    isLoading = {useprebucquagelist.isLoading}
                    defaultSortedColumn="bucque"
                    setSearch={useprebucquagelist.setSearch}
                    setSort={useprebucquagelist.setOrdering}
                    page={useprebucquagelist.page}
                    onPageChange={useprebucquagelist.setPage}
                    totalRecords={useprebucquagelist.numberRecords}
                    recordsPerPage={useprebucquagelist.limit}
                    setPageSize={useprebucquagelist.setLimit}
                    recordsPerPageOptions={[10, 25, 50]}
                    recordsPerPageLabel={"PG par page"}


                    elementSpacing={"xs"}
                    styles={{
                        input: {flex: "auto"}
                    }}

                    rowExpansion={{
                        content: ({record})=>(rowExpansionContent(record))
                    }}

                    withReloadIcon
                    reloadCallback={()=>{
                                        useprebucquagelist.retrieve();
                                        usefinssproduct.retrieveProducts();
                                    }}
                />

            </Paper>

        </Stack>
    )
}

export default FinssPrebucquage