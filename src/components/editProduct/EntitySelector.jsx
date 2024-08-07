import { Select } from '@mantine/core';

const EntitySelector = ({entitiesManageable, entite, ...props})=>{
    return (
        <Select
            data={entitiesManageable}
            label="Catégorie"
            searchable
            nothingFound="Aucune entité trouvée..."
            maxDropdownHeight={280}
            withinPortal
            {...props}
        />
    );
}

export default EntitySelector