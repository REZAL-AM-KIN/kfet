import {Box, Stack, TextInput, Group, ActionIcon, NativeSelect} from "@mantine/core";
import {IconRefresh, IconReload, IconSearch, IconSquarePlus} from "@tabler/icons";
import {DataTable} from "mantine-datatable";
import {useEffect, useState} from "react";

/*
Ce composant donne une datable triable avec un champ de recherche et la logique de tri intégré.
Les columns triable et recherchable sont les colones avec l'atribut (sortable: true).

defaultSortedColumn : Permet de specifié l'accessor de la colone à trié par défaut (par défaut il s'agit de la première colone)

Il est possible de gérer les styles des composants avec la props styles.
        styles = {{input: {style of search field}, datable: {style of datatable}}}

Il est possible d'ajouter un bouton d'ajout et un bouton de reload. Dans ce cas il faut passer le callback correspondant:
   withAddIcon -> addCallback
   withReloadicon -> reloadCallback
Les logiques d'ajout et de reload sont à implémenter dans leur callback
il est possible d'ajouter des boutons grâce à la props "extraButtons"
categoriesSelector : Doit contenir un noeuds react qui sera affiché contre la barre de recherche (Permet de mettre un selecteur de categorie par exemple)
secondBarNodes: Liste de Nodes qui seront ajouter sous la barre principale (champ de recherche, boutons, ect)

 */
const SearchableDataTable = ({searchPlaceHolder, columns, data, isLoading, defaultSortedColumn, styles, elementSpacing="xs", searchBarPosition = "apart", withAddIcon, withReloadIcon, addCallback, reloadCallback, extraButtons, categoriesSelector, secondBarNodes, ...othersProps})=>{
    const [sortStatus, setSortStatus] = useState({ columnAccessor: (defaultSortedColumn ? defaultSortedColumn : columns[0].accessor), direction: 'asc' });
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);

    //On vérifie que les paramètes passés sont consistant:

    //Vérification de la présence des callbacks si reload ou add
    if(withAddIcon && !addCallback){
        throw "withAddIcon option require addCallback. \n addCallback should be a function that handle add logic"
    }
    if(withReloadIcon && !reloadCallback){
        throw "withReloadIcon option require reloadCallBack. \n reloadCallBack should be a function that handle reload logic"
    }




    //Fonction qui sert à filter les données passés par "data" en fonction de la chaine passé dans "search"
    //La recherche s'effectue sur les champs "data_keys" qui sont ici toutes les colones déclarées comme filtrable. (filtrable : true)
    function filterData(data, search) {
        const data_keys = columns.filter((item)=>item.sortable).map((item)=>item.accessor) // on récupère les accessors des colone filtrable.

        const query = search.toLowerCase().trim();
        return data.filter((item) =>
            data_keys.some((key) => item[key].toLowerCase().includes(query)) // On filtre sur toutes les clés dispo dans data_keys
        );
    }


    //Cette fonction permet de triée les données passées en "data" suivant les caractéristiques définis par "payload"
    //payload: { sortBy: keyof data | null; reversed: boolean; search: string }
    function sortData(data, payload) {


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


    useEffect(() => {
        const sorted_data = sortData(data, {sortBy:sortStatus.columnAccessor, reversed: (sortStatus.direction==="desc"), search:search});
        setSortedData(sorted_data);

    }, [data, sortStatus]);

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy:sortStatus.columnAccessor, reversed: (sortStatus.direction==="desc"), search: value }));
    };

    return (
        <Stack spacing={elementSpacing} style={{height: "100%"}}>
            <Group position={searchBarPosition}>
                <Group spacing="xs" position="left" style={{flex: "auto"}}>
                    <TextInput
                        placeholder={searchPlaceHolder}

                        icon={<IconSearch size={14} stroke={1.5} />}
                        style = {styles.input}
                        value={search}
                        onChange={handleSearchChange}
                    />

                    {/* Ajout du selector si demandé par l'utilisateur*/}
                    {categoriesSelector}
                </Group>

                {/* Ajout des boutons d'ajout et de refresh si demandé par l'utilisateur*/}
                {(withAddIcon || withReloadIcon || extraButtons) && (
                    <Group style={{alignItems: "flex-start"}}>
                        {extraButtons}

                        {withAddIcon && (
                            <ActionIcon size={33} color = "green" onClick={()=>addCallback()}>
                                <IconSquarePlus size={33}/>
                            </ActionIcon>
                        )}

                        {withReloadIcon && (
                            <ActionIcon size={33} color = "blue" onClick={()=>reloadCallback()}>
                                <IconRefresh size={33}/>
                            </ActionIcon>
                        )}

                    </Group>
                )}

            </Group>

            {secondBarNodes}

            <Box style={{
                flex: "1 1 auto",
                overflow: "hidden"
            }}>
                <DataTable
                    minHeight={150}
                    striped
                    highlightOnHover
                    records={sortedData}
                    columns={columns}
                    fetching={isLoading}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}

                    style = {styles.datatable}

                    {...othersProps}

                />

            </Box>
        </Stack>
    );
}

export default SearchableDataTable;