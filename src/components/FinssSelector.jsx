import {Group, Table, Text, Center, UnstyledButton, createStyles, ScrollArea, TextInput} from "@mantine/core"
import {IconChevronDown, IconChevronUp, IconSearch, IconSelector} from "@tabler/icons";
import {useCallback, useState} from "react";
import { keys } from '@mantine/utils';
import {useEventListener} from "@mantine/hooks";

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
  const data_keys = Object.assign({}, data[0])
  delete data_keys["id"] // On récupère le nom des clés qui peuvent servir au filtrage (soit toutes sauf id)

  const query = search.toLowerCase().trim();
  return data.filter((item) =>
      keys(data_keys).some((key) => item[key].toLowerCase().includes(query)) // On filtre sur toutes les clés dispo dans data_keys
  );
}

function sortData(data,payload) {
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

const FinssSelector = ({data, callbackFct}) => {

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const clickCallback = useCallback((obj) => console.log(obj), []);
  const clickEventListener = useEventListener('click', clickCallback);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };


  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
      <tr key={row.id} ref={clickEventListener}>
        <td>{row.name}</td>
        <td>{row.desc}</td>
        <td>{row.date}</td>
      </tr>
  ));

  return (
      <ScrollArea>
        <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
        />
        <Table
            striped
            highlightOnHover
        >
          <thead>
          <tr>
            <Th
                sorted={sortBy === 'name'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('name')}
            >
              Nom
            </Th>
            <Th
                sorted={sortBy === 'desc'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('desc')}
            >
              Description
            </Th>
            <Th
                sorted={sortBy === 'date'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('date')}
            >
              Date
            </Th>
          </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
                rows
            ) : (
                <tr>
                  <td colSpan={Object.keys(data[0]).length}>
                    <Text weight={500} align="center">
                      Nothing found
                    </Text>
                  </td>
                </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
  )
}

export  default  FinssSelector;