import {
    Box,
    Paper,
    useMantineTheme
} from "@mantine/core"
import {useEffect, useState} from "react";
import SearchableDataTable from "../SearchableDataTable";

const ProductsSelector = ({productsList}) => {

    const [tabData, setTabData] = useState([])
    const theme = useMantineTheme();

    useEffect(()=>{
        let tabData = productsList
        setTabData(tabData)
    }, [productsList])

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
                        {accessor: "id", title:"id", titleStyle: {minWidth:"280px"}, width: "20%"},
                        {accessor: "nom", title:"Nom", sortable: true,  visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                        {accessor: "raccourci", title:"Raccourci", textAlignment:"center", width:160, sortable: true,  visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                        {accessor: "prix", title:"prix (€)", textAlignment:"center", width:140, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)') }
                    ]}
                    defaultSortedColumn="nom"
                    idAccessor="id"
                    isLoading = {false}

                    elementSpacing={"xs"}

                    styles={{
                        input: {flex: "auto"}
                    }}

                    searchBarPosition="apart"

                />
            </Paper>
        </Box>
    )
}

export  default  ProductsSelector;