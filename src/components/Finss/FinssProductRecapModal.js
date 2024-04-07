//Modal pour afficher le recap des prix et Qts des produits
import {closeAllModals} from "@mantine/modals";
import {Box, Button, Modal} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {useEffect} from "react";

const FinssProductRecapModal = ({opened, setOpened, usefinssproduct})=> {
    useEffect(()=>{
        if(opened){
            usefinssproduct.retrieveProducts()
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, usefinssproduct.retrieveProducts])

    return (
        <Modal
            opened={opened}
            onClose={()=>setOpened(false)}
            title="Récap des prix et quantités"
        >
            <>
                <Box>
                    <DataTable columns={[
                        {accessor: "nom", title: "Nom"},
                        {
                            accessor: "prix_total",
                            title: "Prix total",
                            visibleMediaQuery: (theme) => ('(min-width: ' + theme.breakpoints.sm + 'px)')
                        },
                        {
                            accessor: "prix_min",
                            title: "Prix min",
                            visibleMediaQuery: (theme) => ('(min-width: ' + theme.breakpoints.sm + 'px)')
                        },
                        {accessor: "quantite_bucque", title: "Qts"},
                        {accessor: "prix_unitaire", title: "€/u", width: 50}
                    ]}
                               records={usefinssproduct.productsList}
                               fetching={usefinssproduct.isLoading}
                    />
                </Box>
                <Button fullWidth onClick={()=>setOpened(false)} mt="md">Fermer</Button>
            </>

        </Modal>
    )
}

export default FinssProductRecapModal;