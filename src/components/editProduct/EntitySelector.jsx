import {Select, useMantineTheme} from '@mantine/core';
import {useDebouncedState, useMediaQuery} from '@mantine/hooks';
import {useEffect} from "react";

const EntitySelector = ({entitiesManageable, entite, setSearch, ...props})=>{
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')
    const [debounced, setDebounced] = useDebouncedState(props["value"], 300);
    useEffect(() => {
        setSearch(debounced)
    }, [setSearch, debounced]);
    return (
        <Select
            data={entitiesManageable}
            label="Catégorie"
            searchable
            nothingFound="Aucune entité trouvée..."
            maxDropdownHeight={isSmallDevice? 120:280}
            withinPortal
            {...props}
            onSearchChange={setDebounced}
            defaultValue={props["value"]}
        />
    );
}

export default EntitySelector