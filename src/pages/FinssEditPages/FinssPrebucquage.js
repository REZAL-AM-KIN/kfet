import {Paper, SimpleGrid, Text, Center, Title, Stack, LoadingOverlay} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import SearchableDataTable from "../../components/SearchableDataTable";
import {useBucquage} from "../../hooks/finssHooks/useBucquage";
import {useFinssProducts} from "../../hooks/finssHooks/useFinssProduct";
import {useEffect} from "react";
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
                            <Text>: {participation.prebucque_quantity}</Text>
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

    return (
        <Stack style={{height: "100%" }}>

            {/*Header avec les quantités demandées pour chaque produit*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", position: 'relative'}}>
                <LoadingOverlay visible={usefinssproduct.isLoading} overlayBlur={2} />

                <Center><Title order={4}>Quantités pré-bucquées</Title></Center>


                {/* On régle le nombre de colone égale aux nombres de produits
                    si il y a moins de 3 produits afin d'avoir une grille centrée.*/}
                <SimpleGrid cols={usefinssproduct.productsList.length<3 ? usefinssproduct.productsList.length: 3}>

                    {quantite_prebucque_info}
                </SimpleGrid>

            </Paper>

            {/*Tableau*/}
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", flex:"1 1 auto"}}>

                <SearchableDataTable
                    searchPlaceHolder={"Rechercher un PG"}
                    columns={[
                                {accessor: "consommateur_bucque", title:"Nom", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                                {accessor: "consommateur_prenom", title:"Prénom", sortable: true},

                            ]}
                    idAccessor="consommateur_bucque"

                    //On récupère les bucquages dont les participations ne sont pas vide et dont au moins une participation a une quantité non nulle
                    //Ainsi, on affiche pas les participations qui ont été bucqué mais pas prébucqué.
                    data={usebucquage.bucquages.filter((bucquage)=>(
                        (bucquage.participation_event.length!==0)
                        && (bucquage.participation_event.some((participation)=>participation.prebucque_quantity!==0)))
                                                        )}
                    isLoading = {usebucquage.isLoading}

                    elementSpacing={"xs"}

                    styles={{
                        input: {width: "60%"}
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