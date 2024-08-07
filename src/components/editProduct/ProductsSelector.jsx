import {
    Box,
    Paper,
    Stack,
    Group,
    Text,
    ActionIcon,
    useMantineTheme
} from "@mantine/core"
import {IconCircleX, IconEdit} from "@tabler/icons-react";
import {useMediaQuery} from "@mantine/hooks";
import {useEffect, useState} from "react";
import SearchableDataTable from "../SearchableDataTable";
import {openConfirmModal} from '@mantine/modals';
import {usePermissions} from "../../hooks/useUser";
import {useProductInfo} from "../../hooks/products/useProductInfo";

const ProductsSelector = ({useproductslist, category, setProductId, setModalOpened}) => {
    const [tabData, setTabData] = useState([])
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')

    const permissions = usePermissions();
    const [canManageEntity, setCanManageEntity] = useState(false)
    const useproductinfo = useProductInfo();


    useEffect(()=>{
        if(permissions.entities_manageable){
            setCanManageEntity(permissions.entities_manageable.some(item => category === item))
        }
    }, [permissions.entities_manageable,category])

    useEffect(()=>{
        setTabData(useproductslist.productsList)
    }, [useproductslist.productsList])


    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{
        return (
            <Stack spacing="0" style={{marginBottom:7.5, marginTop:7.5, marginLeft:15}}>
                <Text>Raccourci : {record.raccourci}</Text>
                <Text>Prix (€) : {record.prix}</Text>
                <Text>Stock : {record.suivi_stock ? record.stock : '-'}</Text>
            </Stack>
        )
    }

    const openDeleteModal = (product) =>
        openConfirmModal({
            title: 'Supprimer le produit',
            centered: true,
            children: (
                <Text size="sm">
                    Êtes-vous sûr de vouloir supprimer le produit "{product.nom}"?
                </Text>
            ),
            labels: { confirm: 'Supprimer', cancel: "Annuler" },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                useproductinfo.deleteProduct(product).then(()=>useproductslist.retrieveProducts());
            },
        });

    const NameRowRender = ({product}) =>{
        const EditButton = () => {
            if(canManageEntity){
                return (
                    <ActionIcon variant="subtle" color={theme.primaryColor} size="lg" onClick={() => {
                        setProductId(product.id);
                        setModalOpened(true);
                    }}>
                        <IconEdit size={30}/>
                    </ActionIcon>)
            }
        }
        const DeleteButton = () => {
            if(canManageEntity) {
                return (
                    <ActionIcon variant="subtle" color="red" size="lg" onClick={() => {
                        openDeleteModal(product)
                    }}>
                        <IconCircleX size={30}/>
                    </ActionIcon>
                )
            }
        }

        return (
            <Group position="apart">
                <Text style={{ maxWidth:200, wordWrap:"break-word", margin:1}}> {product.nom}</Text>
                <Group>
                    <EditButton/>
                    <DeleteButton/>
                </Group>
            </Group>
        )
    }


    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>

                <SearchableDataTable
                    noRecordsText="Aucun produit n'a été trouvé"
                    searchPlaceHolder="Rechercher suivant le nom/raccourcit/prix"
                    striped
                    highlightOnHover
                    data={tabData}
                    columns={[
                        {accessor: "nom",
                            title:"Nom",
                            titleStyle: {minWidth:"160px"},
                            sortable: true,
                            searchable: true,
                            render: (product) => (<NameRowRender product={product}/>)},
                        {accessor: "raccourci",
                            title:"Raccourci",
                            textAlignment:"center",
                            width: theme.breakpoints.sm/2,
                            sortable: true,
                            searchable: true,
                            visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                        {accessor: "prix",
                            title:"Prix (€)",
                            textAlignment:"center",
                            width: theme.breakpoints.sm/2,
                            sortable: true,
                            searchable: false,
                            visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')') },
                        {accessor: "stock",
                            title:"Stock",
                            textAlignment:"center",
                            width: theme.breakpoints.sm/2,
                            sortable: true,
                            searchable: false,
                            visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')'),
                            render: (product) => product.suivi_stock ? product.stock : '-'},
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

                    {...(canManageEntity && (
                                {
                                    withAddIcon : true,
                                    addCallback : ()=> {setProductId(null);setModalOpened(true)}
                                })
                    )}
                />
            </Paper>
        </Box>
    )
}

export  default  ProductsSelector;