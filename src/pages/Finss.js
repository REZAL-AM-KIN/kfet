import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Center, Stack,Box} from "@mantine/core"

import {useFinssList} from "../hooks/finssHooks/useFinssList";
import FinssSelector from "../components/Finss/FinssSelector";
import FinssRegisterModal from "../components/Finss/FinssRegisterModal";

const Finss = ({setPage}) => {
    let params = useParams()

    useEffect(()=>{setPage("Finss")})

    const [modalOpened, setModalOpened] = useState(false)
    const [finssBucquage, setFinssBucquage] = useState()


    const usefinsslist = useFinssList()

    // On configure un useEffect qui s'execute à chaque changement d'état d'ouverture de la modale de sélection d'inscription
    // Si modalOpened===false alors l'utilisateur vient de fermer la modal : on update donc les résultats
    useEffect(()=>{
        if(modalOpened===false){
            usefinsslist.retrieveFinssList()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalOpened, usefinsslist.retrieveFinssList])

    useEffect(()=>{
        if(params.applyto){
            setFinssBucquage(params.applyto)
            setModalOpened(true)
        }
    },[params])

    /*
    return(
        <Stack style={{height:"100%"}}>
           <Center>
               <h1>Listes des fin'ss</h1>
           </Center>
            <FinssSelector
                data={finssList}
                isLoading={isLoading}
                setFinssId={setFinssBucquage}
                setModalOpened={setModalOpened}
            />

            <FinssRegisterModal
                opened={modalOpened}
                setOpened={setModalOpened}
                finssId={finssBucquage}
            />
        </Stack>
    );
     */

    return(
        <Stack spacing="0" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
           <Center>
               <h1 style={{margin:"10px"}}>Listes des fin'ss</h1>
           </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <FinssSelector
                    usefinsslist={usefinsslist}
                    setFinssId={setFinssBucquage}
                    setModalOpened={setModalOpened}
                />
            </Box>

            <FinssRegisterModal
                opened={modalOpened}
                setOpened={setModalOpened}
                finssId={finssBucquage}
            />
        </Stack>
    );
}

export default Finss;