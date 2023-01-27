//Modal pour afficher le recap des prix et Qts des produits
import {closeAllModals, openModal} from "@mantine/modals";
import {Box, Button} from "@mantine/core";
import {DataTable} from "mantine-datatable";

const openFinssProductRecapModal = (usefinssproduct)=> {
    openModal({
        title: 'Récap des prix et quantités',
        centered: true,
        children: (
            <>
                <Box>
                    <DataTable columns={[
                        {accessor: "nom", title:"Nom"},
                        {accessor: "prix_total", title:"Prix total", visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                        {accessor: "prix_min", title:"Prix min", visibleMediaQuery: (theme)=>('(min-width: '+theme.breakpoints.sm+'px)')},
                        {accessor: "quantite_bucque", title:"Qts"},
                        {accessor: "prix_unitaire", title:"€/u"}
                    ]}
                               records={usefinssproduct.productsList}
                    />
                </Box>
                <Button fullWidth onClick={closeAllModals} mt="md">Fermer</Button>
            </>
        ),
    });
}

export default openFinssProductRecapModal;