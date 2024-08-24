import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {
    ActionIcon,
    Button,
    Group,
    Stack,
    Text,
    Box,
    Paper,
    Center,
    Tooltip, useMantineTheme, Switch
} from "@mantine/core"
import {IconCircleX, IconEdit} from "@tabler/icons-react";
import {useMediaQuery} from "@mantine/hooks";
import {modals} from "@mantine/modals";

import SearchableDataTable from "../SearchableDataTable";
import FinssGeneralParameters from "./FinssGeneralParameters";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";

const FinssSelector = ({usefinsslist, setFinss, setModalOpened}) => {
    const [tabData, setTabData] = useState([])
    const [displayEnded, setDisplayEnded] = useState(false)
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')

    // On convertit la date d'un forma iso vers un format heure:minutes jour/mois/année
    useEffect(()=>{
        let tabData = usefinsslist.finssList

        if(!displayEnded){
            tabData = tabData.filter((finss)=>finss.etat_event < etatEventValues.TERMINE)
        }

        tabData = tabData.map(({date_event, ...finss})=>{
            const date = new Date(date_event)
            const date_string = date.toLocaleDateString() // si on voulait l'heure, il faudrait ajouter : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })+" "+

            return {date_event:date_string, ...finss}
        })
       setTabData(tabData)
    }, [usefinsslist.finssList, displayEnded])

    const ActionRowRender = ({finss}) =>{
        function prebucqageButtons() {
            //Si le prebucquage n'est pas ouvert, on bloque les actions de prébucquage (utile car les managers de finss verront toujours apparaitre les finss dans la liste)
            if(finss.etat_event !== etatEventValues.PREBUCQUAGE){
                return (
                    <Tooltip label={"Inscription terminée"}>
                        <div>
                            <IconCircleX size={30} color="red"/>
                        </div>
                    </Tooltip>) //La div est nécessaire car la node Tooltip a besoin de la prop ref que les icones ne possèdent pas.
            }

            //Si l'utilisateur est déjà prébucqué, alors on lui propose de modifier son inscription.
            if(!finss.is_prebucque){
                return (<Button onClick={()=>{setFinss(finss); setModalOpened(true);}} style={{borderRadius: "1.5em"}}>S'inscrire</Button>)
            }else{
                return (<Button onClick={()=>{setFinss(finss); setModalOpened(true);}} style={{borderRadius: "1.5em"}} color="green">Modifier</Button>)
            }
        }

        return (
            <Stack justify="space-between" align="center" spacing={3}>
                {prebucqageButtons()}
            </Stack>
        )
    }

    const NameRowRender = ({finss}) =>{
        //On vérifie si l'utilisateur est manager du fin'ss
        const EditButton = () => {
            if(!finss.can_manage){
                return;
            }

            return (
                <ActionIcon component={Link} to={"/finssedit/"+finss.id} color="blue">
                    <IconEdit size={20} />
                </ActionIcon>
            )
        }

        return (
        <Group position="apart">
            <Text style={{ maxWidth:200, wordWrap:"break-word", margin:1}}> {finss.titre}</Text>
            <EditButton/>
        </Group>
        )
    }

    //Construction du déroulant au clic sur une ligne du tableau
    //Cette fonction est appelé à chaque ligne par la mantine datatable et le record
    // (les datas correspondant à la ligne) est passé via l'argument record
    const rowExpansionContent = (record)=>{
        return (
            <Stack spacing="0" style={{marginBottom:10, marginTop:10}}>
                <Text>Date: {record.date_event}</Text>
                <Text>Description: {record.description}</Text>
                <Center  style={{marginTop:10}}>
                    <ActionRowRender finss={record}/>
                </Center>
            </Stack>
        )
    }

    const CategorieFilter = (
        <Switch
            style={{flex:"1"}}
            styles={{body:{alignItems:"center"}}}
            labelPosition="left"
            label="Afficher les fin'ss cloturés ?"
            checked={displayEnded}
            onChange={(event)=>setDisplayEnded(event.currentTarget.checked)}

        />
    )

    return (
        <Box style={{display: "flex", height: "100%"}}>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>
                <SearchableDataTable
                    noRecordsText="Aucun fin'ss n'a été trouvé"
                    searchPlaceHolder="Rechercher un fin'ss sur n'importe quel critère"
                    striped
                    highlightOnHover
                    data={tabData}
                    columns={[
                        {accessor: "titre", title:"Nom", searchable: true, sortable: true, render: (finss)=>(<NameRowRender finss={finss}/>), titleStyle: {minWidth:"280px"}, width: "20%"},
                        {accessor: "description", title:"Description", searchable: true, sortable: true,  visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                        {accessor: "date_event", title:"Date", searchable: true, textAlignment:"center", width:160, sortable: true,  visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')')},
                        {accessor: "actions", title:"Inscription", searchable: false, textAlignment:"center", width:140, render: (finss) => (<ActionRowRender finss={finss}/>), visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+')') }
                    ]}
                    defaultSortedColumn="titre"
                    idAccessor="id"
                    isLoading = {usefinsslist.isLoading}

                    elementSpacing={"xs"}

                    styles={{
                        input: {flex: "auto"}
                    }}

                    rowExpansion={ isSmallDevice ? {
                        content: ({record})=>(rowExpansionContent(record))
                    }:""}

                    searchBarPosition="apart"

                    categoriesSelector={CategorieFilter}

                    withReloadIcon
                    reloadCallback={()=>usefinsslist.retrieveFinssList()}

                    withAddIcon
                    addCallback={()=> {
                        modals.open({title: "Ajouter un fin'ss", children: <FinssGeneralParameters usefinssinfo={{
                                isLoading: false,
                                finssInfo: {date_event: new Date().toISOString()}
                            }} useFinssList={usefinsslist}/>})}
                    }
                />
            </Paper>
        </Box>
    )
}

export  default  FinssSelector;