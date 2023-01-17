import {Center, Stack,Box,Image} from "@mantine/core"
import {useEffect, useState} from "react";
import FinssSelector from "../components/Finss/FinssSelector";
import {useFinssList} from "../hooks/finssHooks/useFinssList";
import FinssRegisterModal from "../components/Finss/FinssRegisterModal";
import {useParams} from "react-router-dom";

const Finss = ({setPage}) => {
    let params = useParams()

    useEffect(()=>{setPage("Finss")})

    const [modalOpened, setModalOpened] = useState(false)
    const [finssBucquage, setFinssBucquage] = useState()


    const {finssList, isLoading, updateFinssList} = useFinssList()

    // On configure un useEffect qui s'execute à chaque changement d'état d'ouverture de la modale de sélection d'inscription
    // Si modalOpened===false alors l'utilisateur vient de fermer la modal : on update donc les résultats
    useEffect(()=>{
        if(modalOpened===false){
            updateFinssList()
        }
    }, [modalOpened])

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
        <Stack style={{ display: "flex", flexDirection: "column", height: "100%" }}>
           <Center>
               <h1>Listes des fin'ss</h1>
           </Center>
            <Box
                style={{
                    flex: "1 1 auto",
                    overflow: "hidden"
                }}
            >
                <FinssSelector
                    data={finssList}
                    isLoading={isLoading}
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