import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Center, Stack, Box, Title} from "@mantine/core"

import {useFinssList} from "../hooks/finssHooks/useFinssList";
import FinssSelector from "../components/Finss/FinssSelector";
import FinssRegisterModal from "../components/Finss/FinssRegisterModal";

const Finss = () => {
    let params = useParams()

    const [modalOpened, setModalOpened] = useState(false)
    const [finssBucquage, setFinssBucquage] = useState()


    const usefinsslist = useFinssList()

    // On configure un useEffect qui s'exécute à chaque changement d'état d'ouverture de la modale de sélection d'inscription
    // Si modalOpened===false alors l'utilisateur vient de fermer la modal.
    // Si les résultats ne sont pas déjà en cours de chargement, on les actualise.
    useEffect(()=>{
        if(modalOpened===false && usefinsslist.isLoading===false){
            usefinsslist.retrieveFinssList()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalOpened])

    useEffect(()=>{
        if(params.applyto){
            setFinssBucquage(params.applyto)
            setModalOpened(true)
        }
    },[params])

    return(
        <Stack spacing="0" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
           <Center>
               <Title order={1} style={{margin:"0.5rem"}}>Listes des fin'ss</Title>
           </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <FinssSelector
                    usefinsslist={usefinsslist}
                    setFinss={setFinssBucquage}
                    setModalOpened={setModalOpened}
                />
            </Box>

            <FinssRegisterModal
                opened={modalOpened}
                setOpened={setModalOpened}
                finss={finssBucquage}
            />
        </Stack>
    );
}

export default Finss;
