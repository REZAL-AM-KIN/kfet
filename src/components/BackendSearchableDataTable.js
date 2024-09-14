import {Box, Stack, TextInput, Group, ActionIcon} from "@mantine/core";
import {IconCirclePlus, IconRefresh, IconSearch} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import {useEffect, useState} from "react";
import {useDebouncedState} from "@mantine/hooks";

/*
Ce composant donne une datable triable avec un champ de recherche et la logique de tri intégré.
Les columns triable sont les colones avec l'attribut (sortable: true).
Les columns cherchable sont les colones avec l'attribut (searchable: true).

defaultSortedColumn : Permet de specifié l'accessor de la colonne à trier par défaut (par défaut il s'agit de la première colonne)

Il est possible de gérer les styles des composants avec la props styles.
        styles = {{input: {style of search field}, datatable: {style of datatable}}}

Il est possible d'ajouter un bouton d'ajout et un bouton de reload. Dans ce cas, il faut passer le callback correspondant :
   withAddIcon -> addCallback
   withReloadicon -> reloadCallback
Les logiques d'ajout et de reload sont à implémenter dans leur callback.
Il est possible d'ajouter des boutons grâce à la props "extraButtons".
categoriesSelector : Doit contenir un noeud react qui sera affiché contre la barre de recherche (Permet de mettre un sélecteur de categorie par exemple).
secondBarNodes: Liste de Nodes qui seront ajouter sous la barre principale (champ de recherche, boutons, ect).

 */
const BackendSearchableDataTable = ({searchPlaceHolder, columns, data, isLoading, defaultSortedColumn, defaultSortedDir="asc",
                                    styles, elementSpacing="xs", searchBarPosition = "apart",
                                    withAddIcon, withReloadIcon, addCallback, reloadCallback, extraButtons,
                                    setSearch, setSort,
                                    page, pageSizeOptions, onPageChange, recordsPerPageLabel, totalRecords, recordsPerPage, setPageSize,
                                    secondBarNodes, ...othersProps})=>{
    const [sortStatus, setSortStatus] = useState({ columnAccessor: (defaultSortedColumn ? defaultSortedColumn : columns[0].accessor), direction: defaultSortedDir });
    const [debounced, setDebounced] = useDebouncedState('', 300);

    //On vérifie que les paramètres passés sont consistants.
    //Vérification de la présence des callbacks si reload ou add
    if(withAddIcon && !addCallback){
        throw Object.assign(
            new Error("withAddIcon option require addCallback. \n addCallback should be a function that handle add logic"),
            { code: 501 }
        );
    }
    if(withReloadIcon && !reloadCallback){
        throw Object.assign(
            new Error("withReloadIcon option require reloadCallBack. \n reloadCallBack should be a function that handle reload logic"),
            { code: 501 }
        );
    }

    useEffect(()=>{
        setSearch(debounced);
    }, [setSearch, debounced]);

    useEffect(() => {
        if (sortStatus.direction === 'asc') {
            setSort(sortStatus.columnAccessor);
        } else {
            setSort("-"+sortStatus.columnAccessor);
        }
    }, [setSort, sortStatus]);

    return (
        <Stack spacing={elementSpacing} style={{height: "100%"}}>
            <Group spacing="xs" position={searchBarPosition} style={styles.searchBar}>
                <TextInput
                    placeholder={searchPlaceHolder}

                    icon={<IconSearch size={14} stroke={1.5} />}
                    style = {styles.input}
                    onChange={(event) => setDebounced(event.currentTarget.value)}
                />

                {/* Ajout des boutons d'ajout et de refresh si demandé par l'utilisateur*/}
                {(withAddIcon || withReloadIcon || extraButtons) && (
                    <Group style={{alignItems: "center", ...styles.buttons}}>
                        {extraButtons}

                        {withAddIcon && (
                            <ActionIcon  style={{flex:"initial"}} size={33} color = "green" onClick={()=>addCallback()}>
                                <IconCirclePlus size={33}/>
                            </ActionIcon>
                        )}

                        {withReloadIcon && (
                            <ActionIcon style={{flex:"initial"}} size={33} color = "blue" onClick={()=>reloadCallback()}>
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
                    records={data}
                    columns={columns}
                    fetching={isLoading}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    page={page}
                    onPageChange={onPageChange}
                    totalRecords={totalRecords}
                    recordsPerPage={recordsPerPage}
                    recordsPerPageOptions={pageSizeOptions}
                    onRecordsPerPageChange={setPageSize}
                    recordsPerPageLabel={recordsPerPageLabel}

                    style = {styles.datatable}

                    {...othersProps}

                />

            </Box>
        </Stack>
    );
}

export default BackendSearchableDataTable;