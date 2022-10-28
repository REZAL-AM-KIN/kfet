import {
    Group,
    Button,
    Text,
    Center,
    UnstyledButton,
    createStyles,
    ScrollArea,
    TextInput,
    ActionIcon,
    Stack
} from "@mantine/core"
import {IconChevronDown, IconChevronUp, IconEdit, IconSearch, IconSelector} from "@tabler/icons";
import {useCallback, useEffect, useState} from "react";
import { keys } from '@mantine/utils';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={14} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      </th>
  );
}

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
                return (<Button onClick={()=>{setFinssId(finss.id); setModalOpened(true);}} style={{borderRadius: "1.5em"}} color="green">Modifier mon inscription</Button>)
            }

        }

        //On vérifie si l'utilisateur est manager du fin'ss
        function editButton(){
            if(!finss.can_manage){
                return;
            }

            return (
                <ActionIcon color="blue" onClick={() => console.log("edit"+finss.name)}>
                    <IconEdit size={20} />
                </ActionIcon>
            )

        }

        return (
            <Stack justify="space-between" align="center" spacing={3}>
                {prebucqageButtons()}
                {editButton()}
            </Stack>
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
                {accessor: "titre", title:"Nom", sortable: true},
                {accessor: "description", title:"Description", sortable: true},
                {accessor: "date_event", title:"Date", width: 110, sortable: true},
                {accessor: "actions", title:"Actions", textAlignment:"center", width:"20%", render: (finss) => (<ActionRowRender finss={finss}/>) }
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