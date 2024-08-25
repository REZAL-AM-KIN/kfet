import { Select, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const EntitySelector = ({entitiesManageable, entite, ...props})=>{
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')
    return (
        <Select
            data={entitiesManageable}
            label="Catégorie"
            searchable
            nothingFound="Aucune entité trouvée..."
            maxDropdownHeight={isSmallDevice? 120:280}
            withinPortal
            {...props}
        />
    );
}

export default EntitySelector