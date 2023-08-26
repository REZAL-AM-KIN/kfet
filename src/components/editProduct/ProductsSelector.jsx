import {
    Box,
    Paper,
    Stack,
    Text,
    useMantineTheme
} from "@mantine/core"
import {useMediaQuery} from "@mantine/hooks";
import {useEffect, useState} from "react";
import SearchableDataTable from "../SearchableDataTable";

const ProductsSelector = ({useproductslist}) => {

    const [tabData, setTabData] = useState([])
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')


    useEffect(()=>{
        setTabData(useproductslist.productsList)
    }, [useproductslist.productsList])


    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{
        return (
            <Stack spacing="0" style={{marginBottom:7.5, marginTop:7.5, marginLeft:15}}>
                <Text>raccourci : {record.raccourci}</Text>
                <Text>prix (€) : {record.prix}</Text>
            </Stack>
        )
    }


    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>

                <SearchableDataTable
                    noRecordsText="Aucun produit n'a été trouvé"
                    searchPlaceHolder="Rechercher un produit sur n'importe quel critère"
                    striped
                    highlightOnHover
                    data={tabData}
                    columns={[
                        {accessor: "nom", title:"Nom", sortable: true, titleStyle: {minWidth:"280px"}, width: "15%"},
                        {accessor: "raccourci", title:"Raccourci", textAlignment:"center", width:160, sortable: true,  visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                        {accessor: "prix", title:"prix (€)", textAlignment:"center", width:140,  sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)') }
                    ]}
                    defaultSortedColumn="nom"
                    idAccessor="id"
                    isLoading = {useproductslist.isLoading}

                    elementSpacing={"xs"}

                    styles={{
                        input: {flex: "auto"}
                    }}

                    rowExpansion={ isSmallDevice ? {
                        content: ({record})=>(rowExpansionContent(record))
                    }:""}

                    searchBarPosition="apart"

                    withReloadIcon
                    reloadCallback={()=>useproductslist.retrieveProducts()}

                />
            </Paper>
        </Box>
    )
}

export  default  ProductsSelector;