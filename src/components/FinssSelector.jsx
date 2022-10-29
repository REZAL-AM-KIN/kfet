import {ActionIcon, Button, Group, ScrollArea, Stack, Text, TextInput} from "@mantine/core"
import {IconEdit, IconSearch} from "@tabler/icons";
import {useEffect, useState} from "react";
import {DataTable} from 'mantine-datatable';
import {Link} from "react-router-dom";


function filterData(data, search) {
  const data_keys = ["titre", "description", "date_event"]

  const query = search.toLowerCase().trim();
  return data.filter((item) =>
      data_keys.some((key) => item[key].toLowerCase().includes(query)) // On filtre sur toutes les clés dispo dans data_keys
  );
}


//payload: { sortBy: keyof data | null; reversed: boolean; search: string }
function sortData(data,payload) {

    if(data.length===0){
        return data
    }

  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
      [...data].sort((a, b) => {

        if (payload.reversed) {
          return b[sortBy].localeCompare(a[sortBy]);
        }

        return a[sortBy].localeCompare(b[sortBy]);
      }),
      payload.search
  );
}



const FinssSelector = ({data, isLoading, setFinssId, setModalOpened}) => {
  const [sortStatus, setSortStatus] = useState({ columnAccessor: 'titre', direction: 'asc' });
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);



  useEffect(() => {
        const sorted_data = sortData(data, {sortBy:sortStatus.columnAccessor, reversed: (sortStatus.direction==="desc"), search:search});
        setSortedData(sorted_data);

  }, [data, sortStatus]);

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy:sortStatus.columnAccessor, reversed: (sortStatus.direction==="desc"), search: value }));
  };

    const ActionRowRender = ({finss}) =>{

        function prebucqageButtons() {

            //Si le prebucquage n'est pas ouvert, on bloque les actions de prébucquage (utile car les managers de finss verront toujours apparaitre les finss dans la liste)
            if(!finss.can_subscribe){
                return
            }

            //Si l'utilisateur est déjà prébucque, alors on lui propose de modifier son inscription.
            if(!finss.is_prebucque){
                return (<Button onClick={()=>{setFinssId(finss.id); setModalOpened(true);}} style={{borderRadius: "1.5em"}}>S'inscrire</Button>)
            }else{
                return (<Button onClick={()=>{setFinssId(finss.id); setModalOpened(true);}} style={{borderRadius: "1.5em"}} color="green">Modifier</Button>)
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
                <ActionIcon component={Link} to={"/finssedit/"+finss.id} color="blue" onClick={() => console.log("edit"+finss.name)}>
                    <IconEdit size={20} />
                </ActionIcon>
            )

        }

        /*


         */

        return (

        <Group position="apart">



            <Text style={{maxWidth:200, wordWrap:"break-word", margin:1}}> {finss.titre}</Text>

            <EditButton/>

        </Group>

        )
    }


  return (
      <ScrollArea>
        <TextInput
            placeholder="Rechercher un fin'ss sur n'importe quel critère"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
        />

        <DataTable
            minHeight={150}
            striped
            highlightOnHover
            fetching={isLoading}
            records={sortedData}
            columns={[
                {accessor: "test", title:"Nom", sortable: true, render: (finss)=>(<NameRowRender finss={finss}/>), width:270},
                {accessor: "description", title:"Description", sortable: true, visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                {accessor: "date_event", title:"Date", width: 110, sortable: true},
                {accessor: "actions", title:"Inscription", textAlignment:"center", width:"20%", render: (finss) => (<ActionRowRender finss={finss}/>) }
            ]}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            noRecordsText="Aucun fin'ss n'a été trouvé"
        >

        </DataTable>

      </ScrollArea>
  )
}

export  default  FinssSelector;